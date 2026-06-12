import { useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '../../../api/library';
import { ADMIN_LIBRARY_QUERY_KEY } from '../queries/useAdminLibraryInfiniteQuery';

export function useDeleteLibraryItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: libraryApi.remove,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ADMIN_LIBRARY_QUERY_KEY }),
  });
}
