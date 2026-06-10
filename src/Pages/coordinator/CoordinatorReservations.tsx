import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workflowApi, type ReservationStatus } from '../../api/workflow';
import { SelectField } from '../../Components/ui/FormField';
import { StatusBadge } from '../../Components/ui/StatusBadge';

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
  const { data = [], isLoading } = useQuery({
    queryKey: ['coordinator-reservations', status],
    queryFn: () => workflowApi.getCoordinatorReservations(status || undefined),
    refetchInterval: 60_000,
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">حجوزات الصفحات</h2>
          <p className="mt-1 text-sm text-gray-500">متابعة المتطوعين والمواعيد النهائية.</p>
        </div>
        <SelectField
          id="reservation-status"
          label="الحالة"
          value={status}
          onChange={(event) => setStatus(event.target.value as ReservationStatus | '')}
          className="min-w-52"
        >
          <option value="">الكل</option>
          <option value="IN_PROGRESS">قيد التنفيذ</option>
          <option value="DONE">تم</option>
          <option value="REJECTED">مرفوض</option>
          <option value="LATE">متأخر</option>
        </SelectField>
      </div>
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">المتطوع</th>
              <th className="px-4 py-3">الطلب</th>
              <th className="px-4 py-3">النوع</th>
              <th className="px-4 py-3">نطاق الصفحات</th>
              <th className="px-4 py-3">تاريخ الحجز</th>
              <th className="px-4 py-3">الموعد النهائي</th>
              <th className="px-4 py-3">الوقت</th>
              <th className="px-4 py-3">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((reservation) => (
              <tr key={reservation.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{reservation.volunteer.name}</td>
                <td className="px-4 py-3">{reservation.request.title ?? '-'}</td>
                <td className="px-4 py-3">{typeLabels[reservation.request.requestType]}</td>
                <td className="px-4 py-3" dir="ltr">{reservation.startPage} - {reservation.endPage}</td>
                <td className="px-4 py-3">{new Date(reservation.createdAt).toLocaleDateString('ar-JO')}</td>
                <td className="px-4 py-3">{new Date(reservation.deadlineAt).toLocaleString('ar-JO')}</td>
                <td className="px-4 py-3">{deadlineLabel(reservation.deadlineAt, reservation.effectiveStatus)}</td>
                <td className="px-4 py-3"><StatusBadge status={reservation.effectiveStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="p-6 text-sm text-gray-500">جاري التحميل...</p>}
        {!isLoading && data.length === 0 && <p className="p-6 text-sm text-gray-500">لا توجد حجوزات.</p>}
      </div>
    </div>
  );
}
