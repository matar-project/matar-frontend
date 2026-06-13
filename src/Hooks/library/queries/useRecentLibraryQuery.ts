import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '../../../api/library';

export function useRecentLibraryQuery() {
  return useQuery({
    queryKey: ['vi-library', 'recent'],
    queryFn: () => libraryApi.getAll({ limit: 5 }),
  });
}
