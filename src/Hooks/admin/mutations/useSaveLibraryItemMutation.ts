import { useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi, type LibraryItem } from '../../../api/library';
import type { AdminLibraryFormValues } from '../../../schema/adminLibrary.schema';
import { ADMIN_LIBRARY_QUERY_KEY } from '../queries/useAdminLibraryInfiniteQuery';

export function useSaveLibraryItemMutation(
  item: LibraryItem | undefined,
  onSuccess: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminLibraryFormValues) =>
      item ? libraryApi.update(item.id, data) : libraryApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ADMIN_LIBRARY_QUERY_KEY,
      });
      onSuccess();
    },
  });
}
