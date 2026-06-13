import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';
import { COORDINATOR_QUERY_KEYS } from '../../../constants/coordinator.constants';

export function useApproveRequestCompletionMutation(requestId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => workflowApi.approveRequestCompletion(requestId),
    onSuccess: () => {
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
