import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';
import { COORDINATOR_QUERY_KEYS } from '../../../constants/coordinator.constants';

export function useUploadRequestOutputMutation(requestId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => workflowApi.uploadOutputFile(requestId, file),
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
