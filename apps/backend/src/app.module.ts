import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/common/prisma/prisma.module';
import { EnvironmentModule } from './modules/common/environment/environment.module';

@Module({
  imports: [PrismaModule, EnvironmentModule],
})
export class AppModule {}
