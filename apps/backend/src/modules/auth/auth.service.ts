import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import { compare } from 'bcrypt';
import ms from 'ms';

import { TokenType } from '../../common/enums/token-type.enum';
import { NotFoundError } from '../../common/errors/not-found.error';
import { UnauthorizedError } from '../../common/errors/unauthorized.error';
import { UserTokenResponse } from '../../common/interfaces/token-response.interface';
import { OmittedUser } from '../../common/types/model.type';
import { UserLoginPayload, UserRegisterPayload } from '../../validations/auth.validation';
import { EnvironmentService } from '../common/environment/environment.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly accessTokenExpiryMs: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly envService: EnvironmentService,
    private readonly jwtService: JwtService,
  ) {
    this.accessTokenSecret = this.envService.get('JWT_SECRET');
    this.accessTokenExpiry = this.envService.get('JWT_EXPIRES_IN');
    this.accessTokenExpiryMs = ms(this.accessTokenExpiry as ms.StringValue);
  }

  async register(payload: UserRegisterPayload): Promise<OmittedUser> {
    await this.usersService.checkExistUserOrThrow(payload.email, payload.phone);

    return await this.usersService.create(payload);
  }

  async login(payload: UserLoginPayload): Promise<UserTokenResponse> {
    try {
      const user = await this.usersService.findByEmailOrThrow(payload.email, {
        select: {
          email: true,
          first_name: true,
          last_name: true,
          password: true,
          status: true,
        },
      });

      if (user.status === UserStatus.INACTIVE) {
        throw new UnauthorizedError();
      }

      const isPasswordMatch = await compare(payload.password, user.password);

      if (!isPasswordMatch) throw new UnauthorizedError({ message: 'Invalid email or password' });

      const access_token = this.jwtService.sign(
        { sub: user.email },
        { secret: this.accessTokenSecret, expiresIn: this.accessTokenExpiry },
      );

      return {
        access_token,
        token_type: TokenType.Bearer,
        expires_in: this.accessTokenExpiryMs,
      };
    } catch (error) {
      if (error instanceof NotFoundError) throw new UnauthorizedError({ message: 'Invalid email or password' });

      throw error;
    }
  }
}
