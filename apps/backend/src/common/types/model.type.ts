import { User } from '@prisma/client';

export type OmittedUser = Omit<User, 'id' | 'status' | 'password' | 'role'>;
