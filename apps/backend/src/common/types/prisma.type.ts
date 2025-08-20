import { PrismaClient } from '@prisma/client';

export type PrismaModelName = Exclude<keyof PrismaClient, `$${string}`>;

export type PrismaFindManyArgs<T extends PrismaModelName = PrismaModelName> = T extends `${infer U}`
  ? U extends keyof PrismaClient
    ? PrismaClient[U] extends { findMany: (args?: infer A) => any }
      ? A
      : never
    : never
  : never;

export type PrismaModelInstance<T extends PrismaModelName> = T extends keyof PrismaClient
  ? PrismaClient[T] extends { findMany: (args?: any) => any }
    ? PrismaClient[T]
    : never
  : never;
