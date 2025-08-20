import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AuthService } from './auth.service';
import { VerificationService } from './verification.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule, PrismaModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, VerificationService],
  exports: [AuthService, VerificationService],
})
export class AuthModule {}
