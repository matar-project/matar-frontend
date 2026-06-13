import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';
import { COORDINATOR_QUERY_KEYS } from '../../../constants/coordinator.constants';

interface RejectReservationVariables {
  id: number;
  reason?: string;
}

export function useRejectVolunteerReservationMutation(requestId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: RejectReservationVariables) =>
      workflowApi.rejectVolunteerReservation(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...COORDINATOR_QUERY_KEYS.reservations, requestId],
      });
      queryClient.invalidateQueries({
        queryKey: COORDINATOR_QUERY_KEYS.books,
      });
      queryClient.invalidateQueries({
        queryKey: COORDINATOR_QUERY_KEYS.stats,
      });
    },
  });
}
