export interface DistanceResult {
  distance_km: number;
  duration_minutes: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface OpenRouteServiceResponse {
  routes: Array<{
    summary: {
      distance: number;
      duration: number;
    };
  }>;
}
