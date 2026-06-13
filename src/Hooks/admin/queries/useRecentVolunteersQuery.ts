import { useQuery } from '@tanstack/react-query';
import { volunteersApi } from '../../../api/volunteers';
import { ADMIN_QUERY_KEYS } from '../../../constants/admin.constants';

export function useRecentVolunteersQuery() {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.recentVolunteers, 'recent'],
    queryFn: () => volunteersApi.getAll({ page: 1, limit: 5 }),
  });
}
