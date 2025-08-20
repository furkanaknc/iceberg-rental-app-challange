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

      return {
        postcode: result.postcode,
        latitude: result.latitude,
        longitude: result.longitude,
        parish: result.parish,
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

  async searchPostcodes(query: string, limit = 10): Promise<PostcodeInfo[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<PostcodeApiResponse>(
          `${this.baseUrl}/postcodes?query=${encodeURIComponent(query)}&limit=${limit}`,
        ),
      );

      const data = response.data;
      const results = data.result as PostcodeResult[];

      return results.map((result) => ({
        postcode: result.postcode,
        latitude: result.latitude,
        longitude: result.longitude,
        parish: result.parish,
      }));
    } catch (error) {
      throw new BadRequestError({
        message: `Error searching postcodes: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  async findNearestPostcodes(latitude: number, longitude: number, limit = 10): Promise<PostcodeInfo[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<PostcodeApiResponse>(
          `${this.baseUrl}/postcodes?lat=${latitude}&lon=${longitude}&limit=${limit}`,
        ),
      );

      const data = response.data;
      const results = data.result as PostcodeResult[];

      return results.map((result) => ({
        postcode: result.postcode,
        latitude: result.latitude,
        longitude: result.longitude,
        parish: result.parish,
      }));
    } catch (error) {
      throw new BadRequestError({
        message: `Error finding nearest postcodes: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  async validatePostcode(postcode: string): Promise<boolean> {
    try {
      await this.lookupPostcode(postcode);
      return true;
    } catch {
      return false;
    }
  }
}
