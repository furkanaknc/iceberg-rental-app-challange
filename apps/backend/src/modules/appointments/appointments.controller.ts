import { Body, Controller, Get, Post, Patch, Delete, HttpCode, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentPayload, UpdateAppointmentPayload } from '../../validations/appointment.validation';
import type { IRequest } from '../../common/interfaces/requests.interface';
import { Search } from '../../common/decorators/search.decorator';
import type { SearchParams } from '../../common/types/search-params.type';
import { Appointment } from '@prisma/client';
import { OrderBy } from '../../common/decorators/orderby-decorator';
import type { OrderByParams } from '../../common/types/order.type';

@ApiTags('Appointments')
@ApiBearerAuth('JWT-auth')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiBody({ type: CreateAppointmentPayload })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createAppointment(@Req() req: IRequest, @Body() payload: CreateAppointmentPayload) {
    if (!req.user?.id) {
      throw new Error('User not authenticated');
    }
    return await this.appointmentsService.createAppointment(req.user.id, payload);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiBody({ type: UpdateAppointmentPayload })
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async updateAppointment(@Req() req: IRequest, @Param('id') id: string, @Body() payload: UpdateAppointmentPayload) {
    return await this.appointmentsService.updateAppointment(id, req.user.id, payload);
  }

  @Get('schedule')
  @ApiOperation({ summary: 'Get agent schedule with search and ordering' })
  @ApiQuery({ name: 'q', required: false, description: 'Search in appointment ID and notes' })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'Order by starts_at, distance_km, travel_duration_min, departure_time, return_time',
  })
  @ApiResponse({
    status: 200,
    description: 'Agent schedule retrieved successfully',
    type: [Object],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 204, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async deleteAppointment(@Req() req: IRequest, @Param('id') id: string) {
    await this.appointmentsService.deleteAppointment(id, req.user.id);
  }
}
