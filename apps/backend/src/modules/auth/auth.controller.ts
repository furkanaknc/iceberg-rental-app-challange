import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginPayload, UserRegisterPayload } from '../../validations/auth.validation';
import { OmittedUser } from '../../common/types/model.type';
import { UserTokenResponse } from '../../common/interfaces/token-response.interface';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Authentication')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: UserRegisterPayload })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() payload: UserRegisterPayload): Promise<OmittedUser> {
    return await this.authService.register(payload);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: UserLoginPayload })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() payload: UserLoginPayload): Promise<UserTokenResponse> {
    return await this.authService.login(payload);
  }
}
