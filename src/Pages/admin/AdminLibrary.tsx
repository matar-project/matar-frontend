import { Edit2, Plus, Trash2 } from 'lucide-react';
import { LibraryForm } from '../../Components/admin/LibraryForm';
import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';
import { Button } from '../../Components/ui/Button';
import { useAdminLibrary } from '../../Hooks/admin/useAdminLibrary';

export default function AdminLibrary() {
  const {
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
    items,
    total,
  } = useAdminLibrary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">المكتبة</h1>
        <Button
          onClick={openCreateForm}
          className="flex items-center gap-2"
        >
          <Plus size={16} aria-hidden="true" />
          إضافة مادة
        </Button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="ابحث في جميع الحقول..."
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      {libraryQuery.isLoading && (
        <div className="flex justify-center py-12" aria-busy="true">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"
            aria-hidden="true"
          />
          <span className="sr-only">جاري التحميل...</span>
        </div>
      )}

      {libraryQuery.data && (
        <>
          <p className="text-sm text-gray-500">{total} عنصر</p>
          <ul className="space-y-3" role="list">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">
                    {item.title}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {item.author}
                    {item.subject ? ` · ${item.subject}` : ''}
                  </p>
                  <span className="rounded bg-primary-50 px-2 py-0.5 text-xs text-primary-700">
                    {item.itemType}
                  </span>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditForm(item)}
                    aria-label={`تعديل ${item.title}`}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    loading={
                      deleteMutation.isPending &&
                      deleteMutation.variables === item.id
                    }
                    onClick={() => deleteItem(item)}
                    aria-label={`حذف ${item.title}`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <InfiniteScrollTrigger
            hasNextPage={Boolean(libraryQuery.hasNextPage)}
            isFetchingNextPage={libraryQuery.isFetchingNextPage}
            fetchNextPage={() => void libraryQuery.fetchNextPage()}
          />
        </>
      )}

      {formOpen && (
        <LibraryForm item={editItem ?? undefined} onClose={closeForm} />
      )}
    </div>
  );
}
