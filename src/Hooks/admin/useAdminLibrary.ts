import { useState } from 'react';
import type { LibraryItem } from '../../api/library';
import { useDebouncedValue } from '../useDebouncedValue';
import { useDeleteLibraryItemMutation } from './mutations/useDeleteLibraryItemMutation';
import { useAdminLibraryInfiniteQuery } from './queries/useAdminLibraryInfiniteQuery';

export function useAdminLibrary() {
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<LibraryItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 500);
  const libraryQuery = useAdminLibraryInfiniteQuery(debouncedSearch);
  const deleteMutation = useDeleteLibraryItemMutation();

  const openCreateForm = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const openEditForm = (item: LibraryItem) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditItem(null);
  };

  const deleteItem = (item: LibraryItem) => {
    if (window.confirm(`حذف "${item.title}"؟`)) {
      deleteMutation.mutate(item.id);
    }
  };

  return {
    search,
    setSearch,
    editItem,
    formOpen,
    openCreateForm,
    openEditForm,
    closeForm,
    deleteItem,
    deleteMutation,
    libraryQuery,
    items: libraryQuery.data?.pages.flatMap((page) => page.data) ?? [],
    total: libraryQuery.data?.pages[0]?.total ?? 0,
  };
}
