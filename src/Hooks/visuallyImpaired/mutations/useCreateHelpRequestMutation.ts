import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  requestsApi,
  type CreateRequestDto,
} from '../../../api/requests';

interface CreateHelpRequestVariables {
  data: CreateRequestDto;
  file?: File;
}

export function useCreateHelpRequestMutation(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, file }: CreateHelpRequestVariables) =>
      requestsApi.createRequest(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      onSuccess();
    },
  });
}
