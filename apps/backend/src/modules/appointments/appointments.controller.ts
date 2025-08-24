import { Body, Controller, Get, Post, Patch, Delete, HttpCode, Param, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentPayload, UpdateAppointmentPayload } from '../../validations/appointment.validation';
import type { IRequest } from '../../common/interfaces/requests.interface';
import { Search } from '../../common/decorators/search.decorator';
import type { SearchParams } from '../../common/types/search-params.type';
import { Appointment } from '@prisma/client';
import { OrderBy } from '../../common/decorators/orderby-decorator';
import type { OrderByParams } from '../../common/types/order.type';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(@Req() req: IRequest, @Body() payload: CreateAppointmentPayload) {
    if (!req.user?.id) {
      throw new Error('User not authenticated');
    }
    return await this.appointmentsService.createAppointment(req.user.id, payload);
  }

  @Patch(':id')
  async updateAppointment(@Req() req: IRequest, @Param('id') id: string, @Body() payload: UpdateAppointmentPayload) {
    return await this.appointmentsService.updateAppointment(id, req.user.id, payload);
  }

  @Get('schedule')
  async getAgentSchedule(
    @Search<Appointment>(['id', 'notes'])
    search: SearchParams<'appointment'>,
    @OrderBy<Appointment>(['starts_at', 'distance_km', 'travel_duration_min', 'departure_time', 'return_time'])
    orderBy: OrderByParams<'appointment'>,
    @Req() req: IRequest,
  ) {
    return await this.appointmentsService.getAgentSchedule(req.user.id, {
      where: search,
      orderBy,
    });
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteAppointment(@Req() req: IRequest, @Param('id') id: string) {
    await this.appointmentsService.deleteAppointment(id, req.user.id);
  }
}
