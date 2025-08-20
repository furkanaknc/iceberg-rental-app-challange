import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { paginationSchema } from '../../validations/common/pagination.validation';

export const Pagination = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const query = request.query;

  return paginationSchema.parse(query);
});
