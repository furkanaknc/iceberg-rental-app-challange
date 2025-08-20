import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/common/prisma/prisma.module';
import { EnvironmentModule } from './modules/common/environment/environment.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { GlobalExceptionFilter } from './common/exception-filters/global-exception.filter';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [PrismaModule, EnvironmentModule, UsersModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
