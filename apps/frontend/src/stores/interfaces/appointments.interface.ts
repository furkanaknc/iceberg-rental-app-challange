export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface Property {
  id: string;
  title: string;
  parish: string;
  postcode: string;
  latitude: number;
  longitude: number;
}

export interface Appointment {
  id: string;
  agent_id: string;
  customer_id: string;
  property_id: string;
  starts_at: string;
  distance_km?: number;
  travel_duration_min?: number;
  departure_time?: string;
  return_time?: string;
  available_again_time?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  customer: Customer;
  property: Property;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  property_id: string;
  starts_at: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  property_id?: string;
  starts_at?: string;
  notes?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}
