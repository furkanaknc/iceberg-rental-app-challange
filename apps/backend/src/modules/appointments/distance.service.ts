import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { BadRequestError } from '../../common/errors/bad-request.error';
import { EnvironmentService } from '../common/environment/environment.service';
import { Coordinates, DistanceResult, OpenRouteServiceResponse } from './interfaces/distance.interface';

@Injectable()
export class DistanceService {
  constructor(
    private readonly httpService: HttpService,
    private readonly envService: EnvironmentService,
  ) {}

  private readonly apiUrl = this.envService.get('OPENROUTESERVICE_API_URL');

  async calculateDistance(origin: Coordinates, destination: Coordinates): Promise<DistanceResult> {
    try {
      const apiKey = this.envService.get('OPENROUTESERVICE_API_KEY');

      const requestBody = {
        coordinates: [
          [origin.longitude, origin.latitude],
          [destination.longitude, destination.latitude],
        ],
        format: 'json',
      };

      const headers = {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      };

      const response: AxiosResponse<OpenRouteServiceResponse> = await firstValueFrom(
        this.httpService.post(this.apiUrl, requestBody, { headers }),
      );

      const route = response.data.routes[0];
      const distanceKm = route.summary.distance / 1000;
      const durationMinutes = Math.ceil(route.summary.duration / 60);

      return {
        distance_km: Math.round(distanceKm * 100) / 100,
        duration_minutes: Math.max(durationMinutes, 1),
      };
    } catch {
      throw new BadRequestError({ message: 'Failed to calculate distance' });
    }
  }

  async calculateDistanceByCoordinates(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): Promise<DistanceResult> {
    return this.calculateDistance({ latitude: lat1, longitude: lon1 }, { latitude: lat2, longitude: lon2 });
  }
}
