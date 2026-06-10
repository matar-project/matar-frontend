import { useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { requestsApi } from '../../api/requests';
import { StatusBadge } from '../../Components/ui/StatusBadge';
import { Button } from '../../Components/ui/Button';
import { SelectField } from '../../Components/ui/FormField';
import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';

function RequestRow({
  request,
  onUpdate,
}: {
  request: any;
  onUpdate: (id: number, dto: any) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(request.status);
  const [notes, setNotes] = useState(request.notes ?? '');

  return (
    <li className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="font-semibold text-gray-900">{request.fullName}</p>
          <p className="text-sm text-gray-500">
            <bdi dir="ltr">{request.phone}</bdi>
            {request.email ? ` · ${request.email}` : ''} · {request.city}
          </p>
          <p className="text-xs text-primary-600">{request.requestType}</p>
          {request.bookName && (
            <p className="text-sm text-gray-700">
              اسم الكتاب: {request.bookName}
            </p>
          )}
        </div>
        <StatusBadge status={request.status} />
      </div>
      <p className="text-sm leading-relaxed text-gray-700">
        {request.details}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {new Date(request.createdAt).toLocaleDateString('ar-JO')}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditing((current) => !current)}
        >
          {editing ? 'إلغاء' : 'تعديل'}
        </Button>
      </div>
      {editing && (
        <div className="space-y-3 border-t border-gray-100 pt-3">
          <SelectField
            id={`status-${request.id}`}
            label="الحالة"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="PENDING_COORDINATOR">بانتظار المنسق</option>
            <option value="COORDINATOR_ACCEPTED">مقبول</option>
            <option value="COORDINATOR_REJECTED">مرفوض</option>
            <option value="DONE">مكتمل</option>
          </SelectField>
          <div className="space-y-1">
            <label
              htmlFor={`notes-${request.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              الملاحظات
            </label>
            <textarea
              id={`notes-${request.id}`}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <Button
            size="sm"
            onClick={() => {
              onUpdate(request.id, { status, notes });
              setEditing(false);
            }}
          >
            حفظ
          </Button>
        </div>
      )}
    </li>
  );
}

export default function AdminRequests() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);
  const queryClient = useQueryClient();

  const requestsQuery = useInfiniteQuery({
    queryKey: ['admin-requests', statusFilter, debouncedSearch],
    queryFn: ({ pageParam }) =>
      requestsApi.getRequests({
        page: pageParam,
        limit: 10,
        status: statusFilter || undefined,
        search: debouncedSearch || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
  const requests =
    requestsQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const total = requestsQuery.data?.pages[0]?.total ?? 0;

  const mutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: any }) =>
      requestsApi.updateRequest(id, dto),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] }),
  });

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
          <option value="PENDING_COORDINATOR">بانتظار المنسق</option>
          <option value="COORDINATOR_ACCEPTED">مقبول</option>
          <option value="COORDINATOR_REJECTED">مرفوض</option>
          <option value="DONE">مكتمل</option>
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
            {requests.map((request: any) => (
              <RequestRow
                key={request.id}
                request={request}
                onUpdate={(id, dto) => mutation.mutate({ id, dto })}
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
