import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { ConflictError } from '../../common/errors/conflict.error';
import { NotFoundError } from '../../common/errors/not-found.error';
import { OmittedUser } from '../../common/types/model.type';
import { hashPassword } from '../../common/utils/hash-password.util';
import { UserUpdatePayload } from '../../validations/users.validation';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserRegisterPayload } from '../../validations/auth.validation';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkExistUserOrThrow(
    email: string,
    phone: string,
    options?: Omit<Prisma.UserFindUniqueArgs, 'where'>,
  ): Promise<void> {
    const existingUser = await this.prismaService.user.findFirst({
      ...options,
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) throw new ConflictError({ message: 'User already exists' });
  }

  async findByIdOrThrow(id: string, options?: Omit<Prisma.UserFindUniqueArgs, 'where'>): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      ...options,
      where: { id },
    });

    if (!user) throw new NotFoundError({ message: 'User not found' });

    return user;
  }

  async findByEmailOrThrow(email: string, options?: Omit<Prisma.UserFindUniqueArgs, 'where'>): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      ...options,
      where: { email },
    });

    if (!user) throw new NotFoundError({ message: 'User not found' });

    return user;
  }

  async create(payload: UserRegisterPayload): Promise<OmittedUser> {
    const { password, ...data } = payload;
    const hashedPassword = hashPassword(payload.password);
    return this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async updateProfile(id: string, payload: UserUpdatePayload): Promise<OmittedUser> {
    await this.findByIdOrThrow(id);
    let data = payload;

    if (payload.email) {
      const existingUser = await this.prismaService.user.findFirst({ where: { email: payload.email } });
      if (existingUser) throw new ConflictError({ message: 'Email already exists' });
    }

    if (payload.phone) {
      const existingUser = await this.prismaService.user.findFirst({ where: { phone: payload.phone } });
      if (existingUser) throw new ConflictError({ message: 'Phone number already exists' });
    }

    if (payload.password) {
      const hashedPassword = hashPassword(payload.password);
      data = { ...payload, password: hashedPassword };
    }

    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async getDetails(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundError({ message: 'User not found' });

    return user;
  }

  async deleteAccount(id: string): Promise<void> {
    await this.findByIdOrThrow(id);

    await this.prismaService.user.delete({
      where: { id },
    });
  }
}
