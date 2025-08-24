import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Appointment, Customer, Property, Office } from '@prisma/client';
import { CreateAppointmentPayload } from '../../validations/appointment.validation';
import { DistanceService } from './distance.service';
import { NotFoundError } from '../../common/errors/not-found.error';
import { ConflictError } from '../../common/errors/conflict.error';
import { EnvironmentService } from '../common/environment/environment.service';
import { AppointmentCalculation } from './interfaces/appointment.interface';
import { PrismaFindManyArgs } from '../../common/types/prisma.type';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly distanceService: DistanceService,
    private readonly envService: EnvironmentService,
  ) {}

  private readonly APPOINTMENT_DURATION_MINUTES = this.envService.get('APPOINTMENT_DURATION_MINUTES');

  async findByIdOrThrow(id: string): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundError({ message: 'Appointment not found' });
    }

    return appointment;
  }

  async createAppointment(agentId: string, payload: CreateAppointmentPayload): Promise<Appointment> {
    return await this.prisma.$transaction(async (tx) => {
      const property = await tx.property.findUnique({
        where: { id: payload.property_id },
      });
      if (!property) {
        throw new NotFoundError({ message: 'Property not found' });
      }

      const mainOffice = await tx.office.findFirst({
        where: { name: 'Main Office' },
      });
      if (!mainOffice) {
        throw new NotFoundError({ message: 'Main Office not found' });
      }

      const calculations = await this.calculateAppointmentTimes(mainOffice, property, new Date(payload.starts_at));

      await this.checkAgentAvailability(agentId, calculations.departure_time, calculations.available_again_time, tx);

      const customer = await this.findOrCreateCustomer(payload.customer, tx);

      await this.checkCustomerAvailability(customer.id, new Date(payload.starts_at), calculations.return_time, tx);

      const appointment = await tx.appointment.create({
        data: {
          agent_id: agentId,
          customer_id: customer.id,
          property_id: payload.property_id,
          starts_at: new Date(payload.starts_at),
          distance_km: calculations.distance_km,
          travel_duration_min: calculations.travel_duration_min,
          departure_time: calculations.departure_time,
          return_time: calculations.return_time,
          available_again_time: calculations.available_again_time,
          notes: payload.notes,
        },
      });

      return appointment;
    });
  }

  async getAgentSchedule(agentId: string, query?: PrismaFindManyArgs<'appointment'>): Promise<Appointment[]> {
    return await this.prisma.appointment.findMany({
      ...query,
      where: {
        ...query?.where,
        agent_id: agentId,
      },
    });
  }

  async updateAppointment(id: string, agentId: string, payload: any): Promise<Appointment> {
    return await this.prisma.$transaction(async (tx) => {
      const existingAppointment = await tx.appointment.findUnique({
        where: { id, agent_id: agentId },
      });

      if (!existingAppointment) {
        throw new NotFoundError({ message: 'Appointment not found' });
      }

      if (payload.starts_at || payload.property_id) {
        const property = await tx.property.findUnique({
          where: { id: payload.property_id || existingAppointment.property_id },
        });

        if (!property) {
          throw new NotFoundError({ message: 'Property not found' });
        }

        const mainOffice = await tx.office.findFirst({
          where: { name: 'Main Office' },
        });

        if (!mainOffice) {
          throw new NotFoundError({ message: 'Main Office not found' });
        }

        const newStartTime = payload.starts_at ? new Date(payload.starts_at) : existingAppointment.starts_at;
        const calculations = await this.calculateAppointmentTimes(mainOffice, property, newStartTime);

        await this.checkAgentAvailability(
          existingAppointment.agent_id,
          calculations.departure_time,
          calculations.available_again_time,
          tx,
          id,
        );

        await this.checkCustomerAvailability(
          existingAppointment.customer_id,
          newStartTime,
          calculations.return_time,
          tx,
          id,
        );

        return await tx.appointment.update({
          where: { id },
          data: {
            ...payload,
            starts_at: newStartTime,
            distance_km: calculations.distance_km,
            travel_duration_min: calculations.travel_duration_min,
            departure_time: calculations.departure_time,
            return_time: calculations.return_time,
            available_again_time: calculations.available_again_time,
          },
        });
      }

      return await tx.appointment.update({
        where: { id },
        data: payload,
      });
    });
  }

  async deleteAppointment(id: string, agentId: string): Promise<void> {
    await this.findByIdOrThrow(id);

    await this.prisma.appointment.delete({
      where: { id, agent_id: agentId },
    });
  }

  private async calculateAppointmentTimes(
    office: Office,
    property: Property,
    appointmentStart: Date,
  ): Promise<AppointmentCalculation> {
    const { distance_km, duration_minutes } = await this.distanceService.calculateDistanceByCoordinates(
      Number(office.latitude),
      Number(office.longitude),
      Number(property.latitude),
      Number(property.longitude),
    );

    const departure_time = new Date(appointmentStart.getTime() - duration_minutes * 60 * 1000);
    const appointment_end = new Date(appointmentStart.getTime() + this.APPOINTMENT_DURATION_MINUTES * 60 * 1000);
    const return_time = new Date(appointment_end.getTime() + duration_minutes * 60 * 1000);
    const available_again_time = return_time;

    return {
      distance_km,
      travel_duration_min: duration_minutes,
      departure_time,
      return_time,
      available_again_time,
    };
  }

  private async checkAgentAvailability(
    agentId: string,
    departureTime: Date,
    availableAgainTime: Date,
    tx: any,
    excludeAppointmentId?: string,
  ): Promise<void> {
    const whereClause: any = {
      agent_id: agentId,
      AND: [
        {
          OR: [
            {
              departure_time: { lte: departureTime },
              available_again_time: { gt: departureTime },
            },
            {
              departure_time: { lt: availableAgainTime },
              available_again_time: { gte: availableAgainTime },
            },
            {
              departure_time: { gte: departureTime },
              available_again_time: { lte: availableAgainTime },
            },
          ],
        },
      ],
    };

    if (excludeAppointmentId) {
      whereClause.id = { not: excludeAppointmentId };
    }

    const conflictingAppointment = await tx.appointment.findFirst({
      where: whereClause,
      include: {
        property: { select: { title: true } },
      },
    });

    if (conflictingAppointment) {
      throw new ConflictError({
        message: `Agent has a conflicting appointment from ${conflictingAppointment.departure_time.toISOString()} to ${conflictingAppointment.available_again_time.toISOString()} for property: ${conflictingAppointment.property.title}`,
      });
    }
  }

  private async checkCustomerAvailability(
    customerId: string,
    appointmentStart: Date,
    appointmentEnd: Date,
    tx: any,
    excludeAppointmentId?: string,
  ): Promise<void> {
    const whereClause: any = {
      customer_id: customerId,
      AND: [
        {
          OR: [
            {
              starts_at: { lte: appointmentStart },
              return_time: { gt: appointmentStart },
            },
            {
              starts_at: { lt: appointmentEnd },
              return_time: { gte: appointmentEnd },
            },
            {
              starts_at: { gte: appointmentStart },
              return_time: { lte: appointmentEnd },
            },
          ],
        },
      ],
    };

    if (excludeAppointmentId) {
      whereClause.id = { not: excludeAppointmentId };
    }

    const conflictingAppointment = await tx.appointment.findFirst({
      where: whereClause,
      include: {
        property: { select: { title: true } },
        agent: { select: { first_name: true, last_name: true } },
      },
    });

    if (conflictingAppointment) {
      throw new ConflictError({
        message: `Customer already has an appointment from ${conflictingAppointment.starts_at.toISOString()} to ${conflictingAppointment.return_time.toISOString()} for property: ${conflictingAppointment.property.title} with agent: ${conflictingAppointment.agent.first_name} ${conflictingAppointment.agent.last_name}`,
      });
    }
  }

  private async findOrCreateCustomer(customerData: CreateAppointmentPayload['customer'], tx: any): Promise<Customer> {
    let customer = await tx.customer.findFirst({
      where: { email: customerData.email },
    });

    if (!customer) {
      customer = await tx.customer.create({
        data: customerData,
      });
    }

    return customer;
  }
}
