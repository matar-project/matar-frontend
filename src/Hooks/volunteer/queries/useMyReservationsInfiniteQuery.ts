import { useInfiniteQuery } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';

export function useMyReservationsInfiniteQuery(search: string) {
  return useInfiniteQuery({
    queryKey: ['volunteer-my-reservations', search],
    queryFn: ({ pageParam }) =>
      workflowApi.getMyReservations({
        page: pageParam,
        limit: 10,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    refetchInterval: 60_000,
  });
}
