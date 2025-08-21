import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { DistanceService } from './distance.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, DistanceService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
