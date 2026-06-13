import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';
import { VOLUNTEER_OPPORTUNITY_QUERY_KEYS } from '../../../constants/volunteerOpportunities.constants';

interface ReservePagesVariables {
  requestId: number;
  pageCount: number;
}

interface UseReservePagesMutationOptions {
  onSuccess: (requestId: number) => void;
  onError: (requestId: number) => void;
}

export function useReservePagesMutation({
  onSuccess,
  onError,
}: UseReservePagesMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, pageCount }: ReservePagesVariables) =>
      workflowApi.reservePages(requestId, pageCount),
    onSuccess: (_, { requestId }) => {
      onSuccess(requestId);
      void queryClient.invalidateQueries({
        queryKey: VOLUNTEER_OPPORTUNITY_QUERY_KEYS.availableRequests,
      });
      void queryClient.invalidateQueries({
        queryKey: VOLUNTEER_OPPORTUNITY_QUERY_KEYS.reservations,
      });
    },
    onError: (_, { requestId }) => {
      onError(requestId);
      void queryClient.invalidateQueries({
        queryKey: VOLUNTEER_OPPORTUNITY_QUERY_KEYS.availableRequests,
      });
    },
  });
}
