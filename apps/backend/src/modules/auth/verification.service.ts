import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, Role, UserStatus } from '@prisma/client';

import { ForbiddenError } from '../../common/errors/forbidden.error';
import { UnauthorizedError } from '../../common/errors/unauthorized.error';
import { EnvironmentService } from '../common/environment/environment.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class VerificationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvironmentService,
    private readonly usersService: UsersService,
  ) {}

  async verifyUser(token: string, requiredRole?: Role[]): Promise<User> {
    let payload;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.envService.get('JWT_SECRET'),
      });
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedError({ message: 'Token expired' });
      }

      throw new UnauthorizedError({ message: 'Invalid token' });
    }

    const { sub: email } = payload;

    const user = await this.usersService.findByEmailOrThrow(email, { omit: { role: false, status: false } });

    if (!user || user.status !== UserStatus.ACTIVE) throw new UnauthorizedError();

    if (requiredRole && !requiredRole.includes(user.role as Role)) {
      throw new ForbiddenError({ message: 'Insufficient role' });
    }

    return user;
  }
}
