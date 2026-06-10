import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workflowApi, type ReservationStatus } from '../../api/workflow';
import { SelectField } from '../../Components/ui/FormField';
import { StatusBadge } from '../../Components/ui/StatusBadge';
import { formatArabicPageRange } from '../../lib/utils';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';
import { Button } from '../../Components/ui/Button';

const typeLabels = {
  PDF_TO_WORD: 'PDF إلى Word',
  PDF_TO_AUDIO: 'PDF إلى تسجيل صوتي',
  ACCOMPANIMENT: 'طلب مرافقة',
};

function deadlineLabel(deadline: string, status: ReservationStatus) {
  if (status === 'DONE') return 'مكتملة';
  if (status === 'REJECTED') return 'مرفوضة';

  const milliseconds = new Date(deadline).getTime() - Date.now();
  const hours = Math.ceil(Math.abs(milliseconds) / 3_600_000);
  return milliseconds < 0 ? `متأخر ${hours} ساعة` : `متبقي ${hours} ساعة`;
}

export default function CoordinatorReservations() {
  const [status, setStatus] = useState<ReservationStatus | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 500);
  const { data, isLoading } = useQuery({
    queryKey: ['coordinator-reservations', status, page, debouncedSearch],
    queryFn: () =>
      workflowApi.getCoordinatorReservations({
        status: status || undefined,
        page,
        limit: 10,
        search: debouncedSearch || undefined,
      }),
    refetchInterval: 60_000,
  });
  const reservations = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">حجوزات الصفحات</h2>
          <p className="mt-1 text-sm text-gray-500">
            متابعة المتطوعين، الصفحات المحجوزة، وحالة الموعد النهائي.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="space-y-1 text-sm">
            <span className="block font-medium text-gray-700">بحث</span>
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="الاسم، الهاتف، الكتاب، الصفحات..."
              className="min-h-12 min-w-72 rounded-lg border border-gray-300 px-4"
            />
          </label>
          <SelectField
            id="reservation-status"
            label="الحالة"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as ReservationStatus | '');
              setPage(1);
            }}
            className="min-w-52"
          >
            <option value="">الكل</option>
            <option value="IN_PROGRESS">قيد التنفيذ</option>
            <option value="DONE">تم</option>
            <option value="REJECTED">مرفوض</option>
            <option value="LATE">انتهى الوقت</option>
          </SelectField>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="whitespace-nowrap px-4 py-3">اسم المتطوع</th>
              <th className="whitespace-nowrap px-4 py-3">رقم المتطوع</th>
              <th className="whitespace-nowrap px-4 py-3">اسم الكتاب</th>
              <th className="whitespace-nowrap px-4 py-3">نوع التحويل</th>
              <th className="whitespace-nowrap px-4 py-3">نطاق الصفحات</th>
              <th className="whitespace-nowrap px-4 py-3">تاريخ الحجز</th>
              <th className="whitespace-nowrap px-4 py-3">الموعد النهائي</th>
              <th className="whitespace-nowrap px-4 py-3">الوقت</th>
              <th className="whitespace-nowrap px-4 py-3">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                  {reservation.volunteer.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span dir="ltr" className="inline-block">
                    {reservation.volunteer.phone ?? '-'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {reservation.request.bookName ??
                    reservation.request.title ??
                    '-'}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {typeLabels[reservation.request.requestType]}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {formatArabicPageRange(
                    reservation.startPage,
                    reservation.endPage,
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {new Date(reservation.createdAt).toLocaleDateString('ar-JO')}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {new Date(reservation.deadlineAt).toLocaleString('ar-JO')}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {deadlineLabel(
                    reservation.deadlineAt,
                    reservation.effectiveStatus,
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={reservation.effectiveStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && (
          <p className="p-6 text-sm text-gray-500">جاري التحميل...</p>
        )}
        {!isLoading && reservations.length === 0 && (
          <p className="p-6 text-sm text-gray-500">لا توجد حجوزات.</p>
        )}
      </div>
      {(data?.total ?? 0) > 0 && (
        <nav className="flex items-center justify-center gap-3">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
          >
            السابق
          </Button>
          <span className="text-sm text-gray-600">
            صفحة {page} من {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={!data?.hasMore}
            onClick={() => setPage((current) => current + 1)}
          >
            التالي
          </Button>
        </nav>
      )}
    </div>
  );
}
