import { useQuery } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';
import { COORDINATOR_QUERY_KEYS } from '../../../constants/coordinator.constants';

export function useCoordinatorBooksQuery(page: number, search: string) {
  return useQuery({
    queryKey: [...COORDINATOR_QUERY_KEYS.books, page, search],
    queryFn: () =>
      workflowApi.getCoordinatorRequests({
        page,
        limit: 20,
        search: search || undefined,
      }),
    refetchInterval: 60_000,
  });
}
