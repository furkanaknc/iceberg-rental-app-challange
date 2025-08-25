import { Body, Controller, Post, Get, Param, Patch, Delete, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyPayload, UpdatePropertyPayload } from '../../validations/properties.validation';
import { Search } from '../../common/decorators/search.decorator';
import type { SearchParams } from '../../common/types/search-params.type';
import type { OrderByParams } from '../../common/types/order.type';
import { Property } from '@prisma/client';
import { OrderBy } from '../../common/decorators/orderby-decorator';
import { Pagination } from '../../common/decorators/pagination.decorator';
import type { PaginationPayload } from '../../validations/common/pagination.validation';

@ApiTags('Properties')
@ApiBearerAuth('JWT-auth')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  @ApiBody({ type: CreatePropertyPayload })
  @ApiResponse({
    status: 201,
    description: 'Property created successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createProperty(@Body() payload: CreatePropertyPayload) {
    return await this.propertiesService.createProperty(payload);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  @ApiBody({ type: UpdatePropertyPayload })
  @ApiResponse({
    status: 200,
    description: 'Property updated successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async updateProperty(@Param('id') id: string, @Body() payload: UpdatePropertyPayload) {
    return await this.propertiesService.updateProperty(id, payload);
  }

  @Get()
  @ApiOperation({ summary: 'List properties with search, order and pagination' })
  @ApiQuery({ name: 'q', required: false, description: 'Search in property titles' })
  @ApiQuery({ name: 'orderBy', required: false, description: 'Order by latitude, longitude' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'per_page', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully',
    type: [Object],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async list(
    @Search<Property>(['title']) search: SearchParams<'property'>,
    @OrderBy<Property>(['latitude', 'longitude']) orderBy: OrderByParams<'property'>,
    @Pagination() { skip, take }: PaginationPayload,
  ) {
    return await this.propertiesService.list({ where: search, orderBy, skip, take });
  }

  @HttpCode(204)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  @ApiResponse({ status: 204, description: 'Property deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async deleteProperty(@Param('id') id: string) {
    return await this.propertiesService.delete(id);
  }
}
