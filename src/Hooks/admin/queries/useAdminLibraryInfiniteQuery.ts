import { useInfiniteQuery } from '@tanstack/react-query';
import { libraryApi } from '../../../api/library';

export const ADMIN_LIBRARY_QUERY_KEY = ['admin-library-list'] as const;

export function useAdminLibraryInfiniteQuery(search: string) {
  return useInfiniteQuery({
    queryKey: [...ADMIN_LIBRARY_QUERY_KEY, search],
    queryFn: ({ pageParam }) =>
      libraryApi.getAllAdmin({
        page: pageParam,
        limit: 10,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
