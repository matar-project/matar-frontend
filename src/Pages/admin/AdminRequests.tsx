import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../../api/requests';
import { StatusBadge } from '../../Components/ui/StatusBadge';
import { Button } from '../../Components/ui/Button';
import { SelectField } from '../../Components/ui/FormField';

type Tab = 'requests' | 'book-requests';

function RequestRow({ r, onUpdate }: { r: any; onUpdate: (id: number, dto: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(r.status);
  const [notes, setNotes] = useState(r.notes ?? '');

  const save = () => { onUpdate(r.id, { status, notes }); setEditing(false); };

  return (
    <li className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="font-semibold text-gray-900">{r.fullName}</p>
          <p className="text-sm text-gray-500">{r.phone}{r.email ? ` · ${r.email}` : ''} · {r.city}</p>
          {r.requestType && <p className="text-xs text-primary-600">{r.requestType}</p>}
          {r.bookTitle && <p className="text-xs text-primary-600">📚 {r.bookTitle}{r.author ? ` — ${r.author}` : ''}</p>}
        </div>
        <StatusBadge status={r.status} />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{r.details || r.notes}</p>
      {r.adminNotes && !editing && (
        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">ملاحظة: {r.adminNotes}</p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{new Date(r.createdAt).toLocaleDateString('ar-JO')}</span>
        <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>
          {editing ? 'إلغاء' : 'تعديل'}
        </Button>
      </div>
      {editing && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <SelectField id={`status-${r.id}`} label="الحالة" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="NEW">جديد</option>
            <option value="IN_PROGRESS">قيد التنفيذ</option>
            <option value="COMPLETED">مكتمل</option>
          </SelectField>
          <div className="space-y-1">
            <label htmlFor={`notes-${r.id}`} className="block text-sm font-medium text-gray-700">ملاحظات</label>
            <textarea
              id={`notes-${r.id}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button size="sm" onClick={save}>حفظ</Button>
        </div>
      )}
    </li>
  );
}

export default function AdminRequests() {
  const [tab, setTab] = useState<Tab>('requests');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [tab, page, statusFilter],
    queryFn: () =>
      tab === 'requests'
        ? requestsApi.getRequests(page, 20, statusFilter || undefined)
        : requestsApi.getBookRequests(page, 20, statusFilter || undefined),
  });

  const mutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: any }) =>
      tab === 'requests'
        ? requestsApi.updateRequest(id, dto)
        : requestsApi.updateBookRequest(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [tab] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">الطلبات</h1>

      {/* Tabs */}
      <div className="flex gap-2" role="tablist">
        {([['requests', 'طلبات المساعدة'], ['book-requests', 'طلبات الكتب']] as const).map(([t, label]) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => { setTab(t); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              tab === t ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <SelectField id="status-filter" label="فلترة حسب الحالة" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="max-w-xs">
          <option value="">الكل</option>
          <option value="NEW">جديد</option>
          <option value="IN_PROGRESS">قيد التنفيذ</option>
          <option value="COMPLETED">مكتمل</option>
        </SelectField>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12" aria-live="polite" aria-busy="true">
          <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="sr-only">جاري التحميل...</span>
        </div>
      )}

      {data && (
        <>
          <p className="text-sm text-gray-500">{data.total} طلب</p>
          <ul className="space-y-3" role="list">
            {data.data.map((r: any) => (
              <RequestRow
                key={r.id}
                r={r}
                onUpdate={(id, dto) => mutation.mutate({ id, dto })}
              />
            ))}
          </ul>

          {data.total > 20 && (
            <nav className="flex justify-center gap-2" aria-label="التنقل بين الصفحات">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>السابق</Button>
              <span className="flex items-center px-3 text-sm text-gray-600">صفحة {page}</span>
              <Button variant="outline" size="sm" disabled={page >= Math.ceil(data.total / 20)} onClick={() => setPage((p) => p + 1)}>التالي</Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
