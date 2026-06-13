import { useState } from 'react';
import {
  ACCOMPANIMENT_ERROR_MESSAGE,
  RESERVATION_ERROR_MESSAGE,
} from '../../constants/volunteerOpportunities.constants';
import { useDebouncedValue } from '../useDebouncedValue';
import { useClaimAccompanimentMutation } from './mutations/useClaimAccompanimentMutation';
import { useJoinOpportunityMutation } from './mutations/useJoinOpportunityMutation';
import { useReservePagesMutation } from './mutations/useReservePagesMutation';
import { useAvailableOpportunitiesInfiniteQuery } from './queries/useAvailableOpportunitiesInfiniteQuery';
import { useAvailableRequestsInfiniteQuery } from './queries/useAvailableRequestsInfiniteQuery';

export function useVolunteerOpportunities() {
  const [search, setSearch] = useState('');
  const [requestErrors, setRequestErrors] = useState<Record<number, string>>(
    {},
  );
  const debouncedSearch = useDebouncedValue(search, 500);

  const opportunitiesQuery =
    useAvailableOpportunitiesInfiniteQuery(debouncedSearch);
  const requestsQuery = useAvailableRequestsInfiniteQuery(debouncedSearch);
  const joinMutation = useJoinOpportunityMutation();
  const reserveMutation = useReservePagesMutation({
    onSuccess: (requestId) => {
      setRequestErrors((current) => ({ ...current, [requestId]: '' }));
    },
    onError: (requestId) => {
      setRequestErrors((current) => ({
        ...current,
        [requestId]: RESERVATION_ERROR_MESSAGE,
      }));
    },
  });
  const claimMutation = useClaimAccompanimentMutation({
    onError: (requestId) => {
      setRequestErrors((current) => ({
        ...current,
        [requestId]: ACCOMPANIMENT_ERROR_MESSAGE,
      }));
    },
  });

  return {
    search,
    setSearch,
    opportunitiesQuery,
    requestsQuery,
    opportunities:
      opportunitiesQuery.data?.pages.flatMap((page) => page.data) ?? [],
    requests: requestsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    joinOpportunity: (opportunityId: number) =>
      joinMutation.mutate(opportunityId),
    reservePages: (requestId: number, pageCount: number) =>
      reserveMutation.mutate({ requestId, pageCount }),
    claimAccompaniment: (requestId: number) =>
      claimMutation.mutate(requestId),
    isJoining: (opportunityId: number) =>
      joinMutation.isPending && joinMutation.variables === opportunityId,
    isRequestPending: (requestId: number) =>
      (reserveMutation.isPending &&
        reserveMutation.variables?.requestId === requestId) ||
      (claimMutation.isPending && claimMutation.variables === requestId),
    getRequestError: (requestId: number) => requestErrors[requestId],
  };
}
