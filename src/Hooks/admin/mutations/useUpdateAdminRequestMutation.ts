import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  requestsApi,
  type UpdateAdminRequestDto,
} from '../../../api/requests';
import { ADMIN_QUERY_KEYS } from '../../../constants/admin.constants';

interface UpdateAdminRequestVariables {
  id: number;
  dto: UpdateAdminRequestDto;
}

export function useUpdateAdminRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: UpdateAdminRequestVariables) =>
      requestsApi.updateRequest(id, dto),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.requests }),
  });
}
