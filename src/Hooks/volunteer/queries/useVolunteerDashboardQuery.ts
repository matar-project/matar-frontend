import { useQuery } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';

export function useVolunteerDashboardQuery() {
  return useQuery({
    queryKey: ['volunteer-dashboard'],
    queryFn: workflowApi.getVolunteerDashboard,
    refetchInterval: 60_000,
  });
}
