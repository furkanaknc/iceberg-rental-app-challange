import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma, Property } from '@prisma/client';
import { PostcodeService } from './postcode.service';
import { CreatePropertyPayload, UpdatePropertyPayload } from '../../validations/properties.validation';
import { PrismaFindManyArgs } from '../../common/types/prisma.type';
import { paginate } from '../../common/utils/pagination.util';
import { PaginatedAPIResponse } from '../../common/types/response.type';
import { NotFoundError } from '../../common/errors/not-found.error';
import { ConflictError } from '../../common/errors/conflict.error';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly postcodeService: PostcodeService,
  ) {}

  async findByIdOrThrow(id: string, options?: Omit<Prisma.PropertyFindUniqueArgs, 'where'>): Promise<Property> {
    const property = await this.prismaService.property.findUnique({
      ...options,
      where: { id },
    });

    if (!property) throw new NotFoundError({ message: 'Property not found' });

    return property;
  }

  async createProperty(payload: CreatePropertyPayload): Promise<Property> {
    const { latitude, longitude, parish } = await this.postcodeService.lookupPostcode(payload.postcode);

    return await this.prismaService.property.create({
      data: {
        ...payload,
        latitude,
        longitude,
        parish,
      },
    });
  }

  async updateProperty(id: string, payload: UpdatePropertyPayload): Promise<Property> {
    await this.findByIdOrThrow(id);

    const propertyData = payload.postcode ? await this.enrichWithPostcodeData(payload) : payload;

    return await this.prismaService.property.update({
      where: { id },
      data: propertyData,
    });
  }

  async list(query?: PrismaFindManyArgs<'property'>): Promise<PaginatedAPIResponse<'properties', Property[]>> {
    const { data, metadata } = await paginate<'property'>(this.prismaService.property, {
      ...query,
      where: {
        ...query?.where,
      },
    });

    return { metadata, properties: data };
  }

  async delete(id: string): Promise<void> {
    await this.findByIdOrThrow(id);

    const appointmentCount = await this.prismaService.appointment.count({
      where: { property_id: id },
    });

    if (appointmentCount > 0) {
      throw new ConflictError({
        message: `Cannot delete property. There are ${appointmentCount} appointment(s) associated with this property. Please cancel or delete the appointments first.`,
      });
    }

    await this.prismaService.property.delete({ where: { id } });
  }

  private async enrichWithPostcodeData(payload: UpdatePropertyPayload) {
    const { latitude, longitude, parish } = await this.postcodeService.lookupPostcode(payload.postcode!);

    return {
      ...payload,
      latitude,
      longitude,
      parish,
    };
  }
}
