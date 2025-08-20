import { PrismaFindManyArgs, PrismaModelInstance, PrismaModelName } from '../types/prisma.type';
import { Metadata, PageBasedPagination } from '../types/response.type';

export async function paginate<T extends PrismaModelName>(
  model: PrismaModelInstance<T>,
  query?: PrismaFindManyArgs<T>,
): Promise<Metadata & { data: any[] }> {
  const where = query?.where || {};

  const [items, count] = await Promise.all([(model as any).findMany(query), (model as any).count({ where })]);

  let page = 1;
  let totalPages = 1;

  if (query && query.skip !== undefined && query.take !== undefined) {
    page = query.skip / query.take + 1;
    totalPages = Math.ceil(count / query.take);
  }

  const pagination: PageBasedPagination = {
    page,
    count: items.length,
    total: count,
    total_pages: totalPages,
  };

  return {
    data: items,
    metadata: {
      pagination,
    },
  };
}

export function getSkipOf(page: number, perPage: number): number {
  return (page - 1) * perPage;
}
