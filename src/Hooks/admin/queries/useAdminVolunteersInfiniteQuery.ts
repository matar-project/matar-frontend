import { useInfiniteQuery } from '@tanstack/react-query';
import { volunteersApi } from '../../../api/volunteers';
import {
  ADMIN_PAGE_SIZE,
  ADMIN_QUERY_KEYS,
} from '../../../constants/admin.constants';

export function useAdminVolunteersInfiniteQuery(search: string) {
  return useInfiniteQuery({
    queryKey: [...ADMIN_QUERY_KEYS.volunteers, search],
    queryFn: ({ pageParam }) =>
      volunteersApi.getAll({
        page: pageParam,
        limit: ADMIN_PAGE_SIZE,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
