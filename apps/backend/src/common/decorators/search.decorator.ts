import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { PrismaFindManyArgs } from '../types/prisma.type';

export const Search = <T>(fields: (keyof T)[]) =>
  createParamDecorator((data: unknown, ctx: ExecutionContext): PrismaFindManyArgs['where'] => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query.q;

    if (!query) return;

    return {
      OR: fields.map((field) => ({
        [field]: {
          contains: query,
          mode: 'insensitive',
        },
      })),
    };
  })();
