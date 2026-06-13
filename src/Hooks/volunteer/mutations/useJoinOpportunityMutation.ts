import { useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesApi } from '../../../api/opportunities';
import { VOLUNTEER_OPPORTUNITY_QUERY_KEYS } from '../../../constants/volunteerOpportunities.constants';

export function useJoinOpportunityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opportunitiesApi.join,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: VOLUNTEER_OPPORTUNITY_QUERY_KEYS.opportunities,
      }),
  });
}
