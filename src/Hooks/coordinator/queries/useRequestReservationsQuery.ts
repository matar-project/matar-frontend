import { useQuery } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';
import { COORDINATOR_QUERY_KEYS } from '../../../constants/coordinator.constants';

export function useRequestReservationsQuery(
  requestId: number,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [...COORDINATOR_QUERY_KEYS.reservations, requestId],
    queryFn: () => workflowApi.getRequestReservations(requestId),
    enabled,
  });
}
