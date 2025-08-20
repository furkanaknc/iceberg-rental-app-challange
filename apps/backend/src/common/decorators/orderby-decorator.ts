import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { PrismaFindManyArgs } from '../types/prisma.type';
import { createOrderBySchema } from '../../validations/common/orderby.validation';

export const OrderBy = <T>(fields: (keyof T)[]) =>
  createParamDecorator((data: unknown, ctx: ExecutionContext): PrismaFindManyArgs['orderBy'] => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query.order_by;

    if (!query) return;

    const orderBySchema = createOrderBySchema(fields as string[]);

    return orderBySchema.parse(query);
  })();
