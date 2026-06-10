import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workflowApi, type AvailableRequest } from '../../api/workflow';
import { Button } from '../../Components/ui/Button';
import { StatusBadge } from '../../Components/ui/StatusBadge';

const typeLabels = {
  PDF_TO_WORD: 'PDF إلى Word',
  PDF_TO_AUDIO: 'PDF إلى تسجيل صوتي',
  ACCOMPANIMENT: 'طلب مرافقة',
};

interface RangeValue {
  startPage: string;
  endPage: string;
}

function RequestCard({
  request,
  value,
  onChange,
  onReserve,
  pending,
  error,
}: {
  request: AvailableRequest;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  onReserve: () => void;
  pending: boolean;
  error?: string;
}) {
  const startPage = Number(value.startPage);
  const endPage = Number(value.endPage);
  const invalidRange =
    !Number.isInteger(startPage) ||
    !Number.isInteger(endPage) ||
    startPage < 1 ||
    endPage < startPage ||
    endPage > (request.totalPages ?? 0);
  const overlaps = request.reservedRanges.some(
    (range) => startPage <= range.endPage && endPage >= range.startPage,
  );

  return (
    <article className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      <div>
        <h3 className="font-bold text-gray-900">{request.title ?? 'طلب بدون عنوان'}</h3>
        <p className="mt-1 text-sm text-blue-700">{typeLabels[request.requestType]}</p>
      </div>
      <p className="text-sm leading-7 text-gray-600">{request.details}</p>
      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
        <span>إجمالي الصفحات: {request.totalPages}</span>
        {request.pdfOriginalName && (
          <button
            type="button"
            onClick={() =>
              void workflowApi.downloadRequestPdf(request.id, request.pdfOriginalName!)
            }
            className="text-blue-700 underline"
          >
            تنزيل {request.pdfOriginalName}
          </button>
        )}
        {!request.pdfOriginalName && request.pdfFileUrl && (
          <a href={request.pdfFileUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">
            فتح ملف PDF
          </a>
        )}
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">النطاقات المحجوزة</p>
        <div className="flex flex-wrap gap-2">
          {request.reservedRanges.length === 0 && (
            <span className="text-sm text-gray-400">لا توجد صفحات محجوزة.</span>
          )}
          {request.reservedRanges.map((range) => (
            <span key={range.id} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700" dir="ltr">
              {range.startPage} - {range.endPage}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3 sm:items-end">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">من صفحة</span>
          <input
            type="number"
            min={1}
            max={request.totalPages ?? undefined}
            value={value.startPage}
            onChange={(event) => onChange({ ...value, startPage: event.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">إلى صفحة</span>
          <input
            type="number"
            min={1}
            max={request.totalPages ?? undefined}
            value={value.endPage}
            onChange={(event) => onChange({ ...value, endPage: event.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <Button
          size="sm"
          loading={pending}
          disabled={invalidRange || overlaps}
          onClick={onReserve}
        >
          حجز صفحات
        </Button>
      </div>
      {overlaps && <p className="text-sm text-red-600">هذا النطاق يتداخل مع صفحات محجوزة.</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </article>
  );
}

export default function VolunteerWorkRequests() {
  const queryClient = useQueryClient();
  const [ranges, setRanges] = useState<Record<number, RangeValue>>({});
  const [reservationError, setReservationError] = useState<Record<number, string>>({});

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['volunteer-available-requests'],
    queryFn: workflowApi.getAvailableRequests,
  });
  const { data: reservations = [], isLoading: reservationsLoading } = useQuery({
    queryKey: ['volunteer-my-reservations'],
    queryFn: workflowApi.getMyReservations,
    refetchInterval: 60_000,
  });

  const reserve = useMutation({
    mutationFn: ({ requestId, startPage, endPage }: { requestId: number; startPage: number; endPage: number }) =>
      workflowApi.reservePages(requestId, startPage, endPage),
    onSuccess: (_, variables) => {
      setRanges((current) => ({ ...current, [variables.requestId]: { startPage: '', endPage: '' } }));
      setReservationError((current) => ({ ...current, [variables.requestId]: '' }));
      void queryClient.invalidateQueries({ queryKey: ['volunteer-available-requests'] });
      void queryClient.invalidateQueries({ queryKey: ['volunteer-my-reservations'] });
    },
    onError: (_, variables) => {
      setReservationError((current) => ({
        ...current,
        [variables.requestId]: 'تعذر حجز الصفحات. قد يكون متطوع آخر حجز هذا النطاق للتو.',
      }));
      void queryClient.invalidateQueries({ queryKey: ['volunteer-available-requests'] });
    },
  });

  const updateReservation = useMutation({
    mutationFn: ({ id, action, reason }: { id: number; action: 'done' | 'reject'; reason?: string }) =>
      action === 'done'
        ? workflowApi.markReservationDone(id)
        : workflowApi.rejectReservation(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['volunteer-available-requests'] });
      void queryClient.invalidateQueries({ queryKey: ['volunteer-my-reservations'] });
    },
  });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">طلبات العمل المتاحة</h1>
          <p className="mt-1 text-sm text-gray-500">اختر نطاق صفحات غير محجوز. الموعد النهائي بعد 3 أيام.</p>
        </div>
        {requestsLoading && <p className="text-sm text-gray-500">جاري التحميل...</p>}
        {!requestsLoading && requests.length === 0 && (
          <p className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow-sm">لا توجد طلبات متاحة حاليا.</p>
        )}
        <div className="grid gap-4 xl:grid-cols-2">
          {requests.map((request) => {
            const value = ranges[request.id] ?? { startPage: '', endPage: '' };
            return (
              <RequestCard
                key={request.id}
                request={request}
                value={value}
                onChange={(next) => setRanges((current) => ({ ...current, [request.id]: next }))}
                onReserve={() =>
                  reserve.mutate({
                    requestId: request.id,
                    startPage: Number(value.startPage),
                    endPage: Number(value.endPage),
                  })
                }
                pending={reserve.isPending && reserve.variables?.requestId === request.id}
                error={reservationError[request.id]}
              />
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">حجوزاتي</h2>
        {reservationsLoading && <p className="text-sm text-gray-500">جاري التحميل...</p>}
        <div className="grid gap-4 lg:grid-cols-2">
          {reservations.map((reservation) => (
            <article key={reservation.id} className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{reservation.request.title ?? 'طلب بدون عنوان'}</h3>
                  <p className="mt-1 text-sm text-gray-500">{typeLabels[reservation.request.requestType]}</p>
                </div>
                <StatusBadge status={reservation.effectiveStatus} />
              </div>
              <p className="text-sm text-gray-700" dir="ltr">
                الصفحات {reservation.startPage} - {reservation.endPage}
              </p>
              <p className="text-sm text-gray-500">
                الموعد النهائي: {new Date(reservation.deadlineAt).toLocaleString('ar-JO')}
              </p>
              {reservation.request.pdfOriginalName && (
                <button
                  type="button"
                  className="text-right text-sm text-blue-700 underline"
                  onClick={() =>
                    void workflowApi.downloadRequestPdf(
                      reservation.request.id,
                      reservation.request.pdfOriginalName!,
                    )
                  }
                >
                  تنزيل {reservation.request.pdfOriginalName}
                </button>
              )}
              {reservation.rejectionReason && (
                <p className="text-sm text-red-600">سبب الرفض: {reservation.rejectionReason}</p>
              )}
              {reservation.status === 'IN_PROGRESS' && (
                <div className="flex gap-2 border-t border-gray-100 pt-3">
                  <Button
                    size="sm"
                    disabled={reservation.effectiveStatus === 'LATE'}
                    loading={updateReservation.isPending && updateReservation.variables?.id === reservation.id}
                    onClick={() => updateReservation.mutate({ id: reservation.id, action: 'done' })}
                  >
                    تم
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      const reason = window.prompt('سبب رفض المهمة (اختياري)') ?? undefined;
                      updateReservation.mutate({ id: reservation.id, action: 'reject', reason });
                    }}
                  >
                    رفض المهمة
                  </Button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
