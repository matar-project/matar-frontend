import { useQuery } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';
import { COORDINATOR_QUERY_KEYS } from '../../../constants/coordinator.constants';

export function useCoordinatorStatsQuery() {
  return useQuery({
    queryKey: COORDINATOR_QUERY_KEYS.stats,
    queryFn: workflowApi.getCoordinatorStats,
  });
}
