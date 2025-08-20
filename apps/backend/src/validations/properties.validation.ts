import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const createPropertySchema = z.object({
  title: z.string().min(1),
  postcode: z.string().min(1),
});

const updatePropertySchema = createPropertySchema.partial().extend({
  postcode: z.string().min(1).optional(),
});

export class CreatePropertyPayload extends createZodDto(createPropertySchema) {}

export class UpdatePropertyPayload extends createZodDto(updatePropertySchema) {}
