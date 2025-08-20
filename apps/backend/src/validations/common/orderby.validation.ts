import { z } from 'zod';

export const createOrderBySchema = (fields: string[]) =>
  z
    .string()
    .transform((val) => {
      const [direction, field] = val.startsWith('-') ? ['desc', val.slice(1)] : ['asc', val];

      return { [field]: direction };
    })
    .refine((val) => fields.includes(Object.keys(val)[0]), {
      message: `Field must be one of: ${fields.join(', ')} `,
    });
