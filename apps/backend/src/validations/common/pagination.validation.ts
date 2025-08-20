import { z } from 'zod';

import { getSkipOf } from '../../../src/common/utils/pagination.util';

export const paginationSchema = z
  .object({
    page: z.coerce.number().int().positive().optional().default(1),
    per_page: z.coerce.number().int().positive().optional().default(20),
  })
  .transform((data) => {
    const skip = getSkipOf(data.page, data.per_page);

    return {
      skip,
      take: data.per_page,
    };
  });

export type PaginationPayload = z.infer<typeof paginationSchema>;
