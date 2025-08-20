import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const emailSchema = z.string().email().min(1);
export const passwordSchema = z
  .string()
  .min(8)
  .refine((password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).{8,}$/.test(password), {
    message:
      'password need to be at least 8 character long. Must contain at least one special character, one uppercase/lowercase letter and number.',
  });

export const firstNameSchema = z.string().min(3);

export const lastNameSchema = z.string().min(3);

export const phoneSchema = z.string().min(10);

export const userRegisterSchema = z.object({
  email: emailSchema,
  first_name: firstNameSchema,
  last_name: lastNameSchema,
  password: passwordSchema,
  phone: phoneSchema,
});

const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export class UserRegisterPayload extends createZodDto(userRegisterSchema) {}
export class UserLoginPayload extends createZodDto(userLoginSchema) {}
