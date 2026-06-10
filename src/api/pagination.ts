export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}
