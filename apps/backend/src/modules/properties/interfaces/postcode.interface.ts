export interface PostcodeResult {
  postcode: string;
  latitude: number;
  longitude: number;
  parish: string;
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
