import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PropertiesModule } from '../properties/properties.module';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [PrismaModule, PropertiesModule, AppointmentsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
