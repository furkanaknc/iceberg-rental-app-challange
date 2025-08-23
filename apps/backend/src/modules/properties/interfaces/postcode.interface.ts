export interface PostcodeResult {
  postcode: string;
  latitude: number;
  longitude: number;
  parish?: string;
  admin_district?: string;
  admin_county?: string;
  admin_ward?: string;
  country?: string;
  region?: string;
}

export interface PostcodeApiResponse {
  status: number;
  result: PostcodeResult | PostcodeResult[];
}

export interface PostcodeInfo {
  postcode: string;
  latitude: number;
  longitude: number;
  parish: string;
}
