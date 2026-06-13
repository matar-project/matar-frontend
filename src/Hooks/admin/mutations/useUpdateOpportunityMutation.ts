import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  opportunitiesApi,
  type OpportunityInput,
} from '../../../api/settings';
import { ADMIN_QUERY_KEYS } from '../../../constants/admin.constants';

interface UpdateOpportunityVariables {
  id: number;
  dto: OpportunityInput;
}

export function useUpdateOpportunityMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: UpdateOpportunityVariables) =>
      opportunitiesApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_QUERY_KEYS.opportunities,
      });
      onSuccess?.();
    },
  });
}
