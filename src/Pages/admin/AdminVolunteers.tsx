import { useState } from 'react';
import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';
import { VolunteerCard } from '../../Components/admin/VolunteerCard';
import { useAdminVolunteersInfiniteQuery } from '../../Hooks/admin/queries/useAdminVolunteersInfiniteQuery';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';

export default function AdminVolunteers() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);
  const volunteersQuery =
    useAdminVolunteersInfiniteQuery(debouncedSearch);
  const volunteers =
    volunteersQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const total = volunteersQuery.data?.pages[0]?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المتطوعون</h1>
        <p className="mt-1 text-sm text-gray-500">
          الحسابات المسجلة في النظام بدور متطوع.
        </p>
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="ابحث في جميع الحقول..."
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      {volunteersQuery.isLoading && (
        <div
          className="flex justify-center py-12"
          aria-live="polite"
          aria-busy="true"
        >
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"
            aria-hidden="true"
          />
          <span className="sr-only">جاري التحميل...</span>
        </div>
      )}

      {volunteersQuery.data && (
        <>
          <p className="text-sm text-gray-500">{total} متطوع</p>
          <ul className="grid gap-3 md:grid-cols-2" role="list">
            {volunteers.map((volunteer) => (
              <VolunteerCard key={volunteer.id} volunteer={volunteer} />
            ))}
          </ul>
          <InfiniteScrollTrigger
            hasNextPage={Boolean(volunteersQuery.hasNextPage)}
            isFetchingNextPage={volunteersQuery.isFetchingNextPage}
            fetchNextPage={() => void volunteersQuery.fetchNextPage()}
          />
        </>
      )}
    </div>
  );
}
