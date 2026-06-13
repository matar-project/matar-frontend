import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';
import { COORDINATOR_QUERY_KEYS } from '../../../constants/coordinator.constants';

interface UpdateCoordinatorRequestVariables {
  bookName?: string;
  details: string;
  totalPages?: number;
}

export function useUpdateCoordinatorRequestMutation(
  requestId: number,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateCoordinatorRequestVariables) =>
      workflowApi.updateCoordinatorRequest(requestId, dto),
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: COORDINATOR_QUERY_KEYS.requests,
      });
      queryClient.invalidateQueries({
        queryKey: COORDINATOR_QUERY_KEYS.stats,
      });
      queryClient.invalidateQueries({
        queryKey: COORDINATOR_QUERY_KEYS.libraryBooks,
      });
    },
  });
}
