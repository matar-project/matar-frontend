import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  opportunitiesApi,
  type OpportunityInput,
} from '../../../api/settings';
import { ADMIN_QUERY_KEYS } from '../../../constants/admin.constants';

export function useCreateOpportunityMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: OpportunityInput) => opportunitiesApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_QUERY_KEYS.opportunities,
      });
      onSuccess?.();
    },
  });
}
