import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EnvironmentService } from '../common/environment/environment.service';
import { AxiosError } from 'axios';
import { BadRequestError } from '../../common/errors/bad-request.error';
import { PostcodeApiResponse, PostcodeInfo, PostcodeResult } from './interfaces/postcode.interface';

@Injectable()
export class PostcodeService {
  constructor(
    private readonly envService: EnvironmentService,
    private readonly httpService: HttpService,
  ) {}

  private readonly baseUrl = this.envService.get('POSTCODE_API_URL');

  async lookupPostcode(postcode: string): Promise<PostcodeInfo> {
    try {
      const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
      const response = await firstValueFrom(
        this.httpService.get<PostcodeApiResponse>(`${this.baseUrl}/postcodes/${cleanPostcode}`),
      );

      const data = response.data;
      const result = data.result as PostcodeResult;

      const parish =
        result.parish ||
        result.admin_district ||
        result.admin_county ||
        result.admin_ward ||
        result.region ||
        'Unknown Area';

      return {
        postcode: result.postcode,
        latitude: result.latitude,
        longitude: result.longitude,
        parish: parish,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new BadRequestError({
          message: `Postcode '${postcode}' not found`,
        });
      }
      throw new BadRequestError({
        message: `Error looking up postcode: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }
}
