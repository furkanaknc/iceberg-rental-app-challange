import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PrismaFindManyArgs } from '../../common/types/prisma.type';
import { Appointment } from '@prisma/client';
import { PropertiesService } from '../properties/properties.service';
import { UpdateAppointmentPayload } from '../../validations/appointment.validation';
import { AppointmentsService } from '../appointments/appointments.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertiesService: PropertiesService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async listAppointments(query?: PrismaFindManyArgs<'appointment'>): Promise<Appointment[]> {
    return await this.prisma.appointment.findMany({
      ...query,
      where: {
        ...query?.where,
      },
      include: {
        customer: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
        agent: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
        property: {
          select: {
            title: true,
            parish: true,
            postcode: true,
          },
        },
      },
      orderBy: {
        starts_at: 'asc',
      },
    });
  }

  async updateAppointment(id: string, payload: UpdateAppointmentPayload): Promise<Appointment> {
    return await this.appointmentsService.updateAppointment(id, '', payload, true);
  }

  async deleteAppointment(id: string): Promise<void> {
    return await this.appointmentsService.deleteAppointment(id, '', true);
  }

  async forceDeleteProperty(id: string): Promise<void> {
    await this.propertiesService.findByIdOrThrow(id);

    await this.prisma.property.delete({
      where: { id },
    });
  }
}
