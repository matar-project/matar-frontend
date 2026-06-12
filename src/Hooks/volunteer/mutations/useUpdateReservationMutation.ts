import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';

export interface UpdateReservationVariables {
  id: number;
  action: 'done' | 'reject';
  reason?: string;
  file?: File;
}

export function useUpdateReservationMutation() {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ['volunteer-available-requests'],
    });
    queryClient.invalidateQueries({
      queryKey: ['volunteer-my-reservations'],
    });
  };

  return useMutation({
    mutationFn: ({
      id,
      action,
      reason,
      file,
    }: UpdateReservationVariables) =>
      action === 'done'
        ? file
          ? workflowApi.completeWordReservation(id, file)
          : workflowApi.markReservationDone(id)
        : workflowApi.rejectReservation(id, reason),
    onSuccess: refresh,
    onError: refresh,
  });
}
