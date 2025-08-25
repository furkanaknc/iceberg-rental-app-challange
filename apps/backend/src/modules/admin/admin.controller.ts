import { Controller, Delete, Get, HttpCode, Param, Patch, Body} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Appointment, Role } from '@prisma/client';
import type { OrderByParams } from '../../common/types/order.type';
import type { SearchParams } from '../../common/types/search-params.type';
import { Search } from '../../common/decorators/search.decorator';
import { OrderBy } from '../../common/decorators/orderby-decorator';
import { UserRoles } from '../../common/decorators/user-role.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateAppointmentPayload } from '../../validations/appointment.validation';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UserRoles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'List appointments' })
  @ApiQuery({ name: 'q', required: false, description: 'Search in appointment ID and notes' })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'Order by starts_at, distance_km, travel_duration_min, departure_time, return_time',
  })
  @ApiResponse({ status: 200, description: 'Appointments list', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('appointments')
  async listAppointments(
    @Search<Appointment>(['id', 'notes'])
    search: SearchParams<'appointment'>,
    @OrderBy<Appointment>(['starts_at', 'distance_km', 'travel_duration_min', 'departure_time', 'return_time'])
    orderBy: OrderByParams<'appointment'>,
  ) {
    return this.adminService.listAppointments({
      where: search,
      orderBy,
    });
  }

  @Patch('appointments/:id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiBody({ type: UpdateAppointmentPayload })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async updateAppointment(@Param('id') id: string, @Body() payload: UpdateAppointmentPayload) {
    return this.adminService.updateAppointment(id, payload);
  }

  @HttpCode(204)
  @Delete('appointments/:id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 204, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async deleteAppointment(@Param('id') id: string) {
    return this.adminService.deleteAppointment(id);
  }

  @HttpCode(204)
  @Delete('force-delete-property/:id')
  @ApiOperation({ summary: 'Force delete a property (ignores appointments)' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  @ApiResponse({ status: 204, description: 'Property deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async forceDeleteProperty(@Param('id') id: string) {
    return this.adminService.forceDeleteProperty(id);
  }
}
