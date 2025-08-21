import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string(),

  BCRYPT_SALT_ROUND: z.coerce.number().default(10),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),

  POSTCODE_API_URL: z.string(),
  OPENROUTESERVICE_API_KEY: z.string(),
  OPENROUTESERVICE_API_URL: z.string(),
});

export type EnvVariables = z.infer<typeof envSchema>;
