import { useInfiniteQuery } from '@tanstack/react-query';
import { libraryApi } from '../../../api/library';

interface LibraryFilters {
  search?: string;
  author?: string;
  subject?: string;
}

export function useLibraryInfiniteQuery(
  scope: string,
  filters: LibraryFilters,
) {
  return useInfiniteQuery({
    queryKey: [
      scope,
      filters.search ?? '',
      filters.author ?? '',
      filters.subject ?? '',
    ],
    queryFn: ({ pageParam }) =>
      libraryApi.getAll({
        ...filters,
        page: pageParam,
        limit: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
