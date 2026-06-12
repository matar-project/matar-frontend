import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';
import { VOLUNTEER_OPPORTUNITY_QUERY_KEYS } from '../../../constants/volunteerOpportunities.constants';

interface UseClaimAccompanimentMutationOptions {
  onError: (requestId: number) => void;
}

export function useClaimAccompanimentMutation({
  onError,
}: UseClaimAccompanimentMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workflowApi.claimAccompaniment,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: VOLUNTEER_OPPORTUNITY_QUERY_KEYS.availableRequests,
      });
      void queryClient.invalidateQueries({
        queryKey: VOLUNTEER_OPPORTUNITY_QUERY_KEYS.accompanimentRequests,
      });
    },
    onError: (_, requestId) => {
      onError(requestId);
      void queryClient.invalidateQueries({
        queryKey: VOLUNTEER_OPPORTUNITY_QUERY_KEYS.availableRequests,
      });
    },
  });
}
