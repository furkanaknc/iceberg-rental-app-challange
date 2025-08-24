import { Body, Controller, Post, Get, Param, Patch, Delete, HttpCode } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyPayload, UpdatePropertyPayload } from '../../validations/properties.validation';
import { Search } from '../../common/decorators/search.decorator';
import type { SearchParams } from '../../common/types/search-params.type';
import type { OrderByParams } from '../../common/types/order.type';
import { Property } from '@prisma/client';
import { OrderBy } from '../../common/decorators/orderby-decorator';
import { Pagination } from '../../common/decorators/pagination.decorator';
import type { PaginationPayload } from '../../validations/common/pagination.validation';
import { UserRoles } from '../../common/decorators/user-role.decorator';
import { Role } from '@prisma/client';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  async createProperty(@Body() payload: CreatePropertyPayload) {
    return await this.propertiesService.createProperty(payload);
  }

  @Patch(':id')
  async updateProperty(@Param('id') id: string, @Body() payload: UpdatePropertyPayload) {
    return await this.propertiesService.updateProperty(id, payload);
  }

  @Get()
  async list(
    @Search<Property>(['title']) search: SearchParams<'property'>,
    @OrderBy<Property>(['latitude', 'longitude']) orderBy: OrderByParams<'property'>,
    @Pagination() { skip, take }: PaginationPayload,
  ) {
    return await this.propertiesService.list({ where: search, orderBy, skip, take });
  }

  @UserRoles(Role.ADMIN)
  @HttpCode(204)
  @Delete(':id')
  async deleteProperty(@Param('id') id: string) {
    return await this.propertiesService.delete(id);
  }
}
