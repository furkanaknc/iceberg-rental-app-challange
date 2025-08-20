import { Body, Controller, Delete, Get, HttpCode, Patch, Req } from '@nestjs/common';
import type { User } from '@prisma/client';

import type { IRequest } from '../../common/interfaces/requests.interface';
import type { OmittedUser } from '../../common/types/model.type';
import type { UserUpdatePayload } from '../../validations/users.validation';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async profile(@Req() req: IRequest): Promise<User> {
    return await this.usersService.getDetails(req.user.id);
  }

  @Patch('update-profile')
  async updateProfile(@Req() req: IRequest, @Body() payload: UserUpdatePayload): Promise<OmittedUser> {
    return await this.usersService.updateProfile(req.user.id, payload);
  }

  @HttpCode(204)
  @Delete('delete-account')
  async deleteAccount(@Req() req: IRequest): Promise<void> {
    await this.usersService.deleteAccount(req.user.id);
  }
}
