import { Body, Controller, Delete, Get, HttpCode, Patch, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Role, type User } from '@prisma/client';

import type { IRequest } from '../../common/interfaces/requests.interface';
import type { OmittedUser } from '../../common/types/model.type';
import { UserUpdatePayload, UserUpdateRolePayload } from '../../validations/users.validation';
import { UsersService } from './users.service';
import { UserRoles } from '../../common/decorators/user-role.decorator';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async profile(@Req() req: IRequest): Promise<User> {
    return await this.usersService.getDetails(req.user.id);
  }

  @Patch('update-profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UserUpdatePayload })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@Req() req: IRequest, @Body() payload: UserUpdatePayload): Promise<OmittedUser> {
    return await this.usersService.updateProfile(req.user.id, payload);
  }

  @UserRoles(Role.ADMIN)
  @Patch('update-state')
  @ApiOperation({ summary: 'Update user role and status (admin only)' })
  @ApiBody({ type: UserUpdateRolePayload })
  @ApiResponse({ status: 200, description: 'User role and status updated successfully', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateState(@Body() payload: UserUpdateRolePayload): Promise<OmittedUser> {
    return await this.usersService.updateState(payload);
  }

  @HttpCode(204)
  @Delete('delete-account')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAccount(@Req() req: IRequest): Promise<void> {
    await this.usersService.deleteAccount(req.user.id);
  }
}
