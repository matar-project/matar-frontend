import { useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesApi } from '../../../api/settings';
import { ADMIN_QUERY_KEYS } from '../../../constants/admin.constants';

export function useDeleteOpportunityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opportunitiesApi.remove,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ADMIN_QUERY_KEYS.opportunities,
      }),
  });
}
