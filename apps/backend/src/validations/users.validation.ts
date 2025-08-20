import { createZodDto } from '@anatine/zod-nestjs';
import { Role, UserStatus } from '@prisma/client';
import { z } from 'zod';
import { emailSchema, firstNameSchema, lastNameSchema, passwordSchema, phoneSchema } from './auth.validation';

const userCreateSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  first_name: firstNameSchema,
  last_name: lastNameSchema,
  password: passwordSchema,
  role: z.nativeEnum(Role),
  status: z.nativeEnum(UserStatus),
});

const userBaseUpdateSchema = userCreateSchema.partial();

const userUpdateSchema = userBaseUpdateSchema.pick({
  email: true,
  phone: true,
  first_name: true,
  last_name: true,
  password: true,
});

const userUpdateRoleSchema = userBaseUpdateSchema.pick({ role: true, status: true });

export class UserCreatePayload extends createZodDto(userCreateSchema) {}
export class UserUpdatePayload extends createZodDto(userUpdateSchema) {}
export class UserUpdateRolePayload extends createZodDto(userUpdateRoleSchema) {}
