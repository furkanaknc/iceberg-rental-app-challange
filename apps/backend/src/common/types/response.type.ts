export type PageBasedPagination = {
  page: number;
  count: number;
  total: number;
  total_pages: number;
};

export type Metadata = {
  metadata: {
    pagination: PageBasedPagination;
  };
};

export type APIResponse<T extends string[] | string, R = any[]> = {
  [K in T extends string ? T : T[number]]: R;
};

export type PaginatedAPIResponse<T extends string[] | string, R = any[]> = APIResponse<T, R> & Metadata;
