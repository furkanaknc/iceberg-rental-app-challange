import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  customer: z.object({
    first_name: z.string().min(3),
    last_name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10).optional(),
  }),
  property_id: z.string().uuid(),
  starts_at: z.string().datetime(),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  property_id: z.string().uuid().optional(),
  starts_at: z.string().datetime().optional(),
  notes: z.string().optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
});

export class CreateAppointmentPayload extends createZodDto(createAppointmentSchema) {}
export class UpdateAppointmentPayload extends createZodDto(updateAppointmentSchema) {}
