export interface Property {
  id: string;
  title: string;
  parish: string;
  postcode: string;
  latitude: number | string;
  longitude: number | string;
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyData {
  title: string;
  postcode: string;
}

export interface UpdatePropertyData {
  title?: string;
  postcode?: string;
}
