import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string(),
  FRONTEND_URL: z.string().default('http://localhost:4200'),

  BCRYPT_SALT_ROUND: z.coerce.number().default(10),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),

  POSTCODE_API_URL: z.string(),

  OPENROUTESERVICE_API_KEY: z.string(),
  OPENROUTESERVICE_API_URL: z.string(),

  APPOINTMENT_DURATION_MINUTES: z.coerce.number().default(60),
});

export type EnvVariables = z.infer<typeof envSchema>;
