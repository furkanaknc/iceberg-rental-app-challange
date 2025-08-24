import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginPayload, UserRegisterPayload } from '../../validations/auth.validation';
import { OmittedUser } from '../../common/types/model.type';
import { UserTokenResponse } from '../../common/interfaces/token-response.interface';
import { Public } from '../../common/decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: UserRegisterPayload): Promise<OmittedUser> {
    return await this.authService.register(payload);
  }

  @Post('login')
  async login(@Body() payload: UserLoginPayload): Promise<UserTokenResponse> {
    return await this.authService.login(payload);
  }
}
