import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PropertiesService } from './properties.service';
import { PostcodeService } from './postcode.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { PropertiesController } from './properties.controller';

@Module({
  imports: [HttpModule, PrismaModule, UsersModule],
  controllers: [PropertiesController],
  providers: [PropertiesService, PostcodeService],
  exports: [PropertiesService, PostcodeService],
})
export class PropertiesModule {}
