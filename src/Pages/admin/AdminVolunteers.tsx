import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Mail, MapPin, Phone } from 'lucide-react';
import { volunteersApi } from '../../api/volunteers';
import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';

interface VolunteerUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  createdAt: string;
}

export default function AdminVolunteers() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);
  const volunteersQuery = useInfiniteQuery({
    queryKey: ['admin-volunteers-list', debouncedSearch],
    queryFn: ({ pageParam }) =>
      volunteersApi.getAll({
        page: pageParam,
        limit: 10,
        search: debouncedSearch || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
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
            {volunteers.map((volunteer: VolunteerUser) => (
              <li
                key={volunteer.id}
                className="space-y-3 rounded-xl bg-white p-5 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {volunteer.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    انضم في{' '}
                    {new Date(volunteer.createdAt).toLocaleDateString('ar-JO')}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Phone size={15} aria-hidden="true" />
                    <bdi dir="ltr">{volunteer.phone ?? '-'}</bdi>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={15} aria-hidden="true" />
                    {volunteer.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={15} aria-hidden="true" />
                    {[volunteer.country, volunteer.city]
                      .filter(Boolean)
                      .join('، ') || '-'}
                  </p>
                </div>
              </li>
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
