import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/common/prisma/prisma.module';
import { EnvironmentModule } from './modules/common/environment/environment.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtGuard } from './common/guards/jwt.guard';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { GlobalExceptionFilter } from './common/exception-filters/global-exception.filter';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';

@Module({
  imports: [PrismaModule, EnvironmentModule, UsersModule, AuthModule, PropertiesModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
