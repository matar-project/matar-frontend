import { useState } from 'react';
import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';
import { AdminRequestRow } from '../../Components/admin/AdminRequestRow';
import { SelectField } from '../../Components/ui/FormField';
import { useUpdateAdminRequestMutation } from '../../Hooks/admin/mutations/useUpdateAdminRequestMutation';
import { useAdminRequestsInfiniteQuery } from '../../Hooks/admin/queries/useAdminRequestsInfiniteQuery';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';
import { REQUEST_STATUS_OPTIONS } from '../../constants/admin.constants';

export default function AdminRequests() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);
  const requestsQuery = useAdminRequestsInfiniteQuery(
    statusFilter,
    debouncedSearch,
  );
  const updateRequest = useUpdateAdminRequestMutation();
  const requests =
    requestsQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const total = requestsQuery.data?.pages[0]?.total ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">الطلبات</h1>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ابحث في جميع الحقول..."
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <SelectField
          id="status-filter"
          label="فلترة حسب الحالة"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">الكل</option>
          {REQUEST_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
      </div>

      {requestsQuery.isLoading && (
        <p className="py-8 text-center text-sm text-gray-500">
          جاري التحميل...
        </p>
      )}

      {requestsQuery.data && (
        <>
          <p className="text-sm text-gray-500">{total} طلب</p>
          <ul className="space-y-3" role="list">
            {requests.map((request) => (
              <AdminRequestRow
                key={request.id}
                request={request}
                onUpdate={(id, dto) => updateRequest.mutate({ id, dto })}
              />
            ))}
          </ul>
          <InfiniteScrollTrigger
            hasNextPage={Boolean(requestsQuery.hasNextPage)}
            isFetchingNextPage={requestsQuery.isFetchingNextPage}
            fetchNextPage={() => void requestsQuery.fetchNextPage()}
          />
        </>
      )}
    </div>
  );
}
