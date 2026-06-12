import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  workflowApi,
  type WorkflowRequest,
} from '../../api/workflow';
import {
  BookOpen,
  FileText,
  Headphones,
  Users,
} from 'lucide-react';
import { StatusBadge } from '../../Components/ui/StatusBadge';
import { ExpandableCardHeader } from '../../Components/ExpandableCardHeader';
import { formatArabicPageRange } from '../../lib/utils';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';
import { Button } from '../../Components/ui/Button';

const typeLabels: Record<string, string> = {
  PDF_TO_WORD: 'PDF إلى Word',
  PDF_TO_AUDIO: 'PDF إلى تسجيل صوتي',
};

function deadlineLabel(deadline: string, effectiveStatus: string) {
  if (effectiveStatus === 'DONE') return 'مكتملة';
  if (effectiveStatus === 'REJECTED') return 'مرفوضة';
  if (effectiveStatus === 'EXPIRED') return 'منتهية';
  const ms = new Date(deadline).getTime() - Date.now();
  const hours = Math.ceil(Math.abs(ms) / 3_600_000);
  return ms < 0 ? `متأخر ${hours} ساعة` : `متبقي ${hours} ساعة`;
}

function BookCard({ request }: { request: WorkflowRequest }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();

  const { data: reservations, isLoading: loadingReservations } = useQuery({
    queryKey: ['request-reservations', request.id],
    queryFn: () => workflowApi.getRequestReservations(request.id),
    enabled: expanded,
  });

  const bookName = request.bookName ?? request.title ?? '—';
  const TypeIcon =
    request.requestType === 'PDF_TO_AUDIO' ? Headphones : FileText;
  const reservationCount = request._count?.reservations ?? 0;
  const progress = request.conversionProgress;
  const progressPercent =
    progress && progress.totalPages
      ? Math.min(
          100,
          Math.round(
            (progress.completedThroughPage / progress.totalPages) * 100,
          ),
        )
      : 0;
  const rejectReservation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      workflowApi.rejectVolunteerReservation(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['request-reservations', request.id],
      });
      void queryClient.invalidateQueries({ queryKey: ['coordinator-books'] });
      void queryClient.invalidateQueries({ queryKey: ['coordinator-stats'] });
    },
  });

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <ExpandableCardHeader
        expanded={expanded}
        onToggle={() => setExpanded((current) => !current)}
        className="gap-4"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
          <TypeIcon size={20} className="text-primary-600" aria-hidden />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-gray-900">{bookName}</h3>
            <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700">
              {typeLabels[request.requestType] ?? request.requestType}
            </span>
            <StatusBadge status={request.status} />
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <BookOpen size={13} aria-hidden />
              {request.totalPages ?? '—'} صفحة إجمالي
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={13} aria-hidden />
              {reservationCount} حجز
            </span>
            {progress && (
              <span>مكتمل حتى صفحة {progress.completedThroughPage}</span>
            )}
          </div>

          {progress && request.totalPages ? (
            <div
              className="h-1.5 w-full max-w-xs rounded-full bg-gray-100"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-1.5 rounded-full bg-primary-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          ) : null}
        </div>

      </ExpandableCardHeader>

      {expanded && (
        <div className="border-t border-gray-100">
          {loadingReservations ? (
            <p className="p-5 text-sm text-gray-500">جاري التحميل...</p>
          ) : !reservations || reservations.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">لا توجد حجوزات لهذا الكتاب.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-right text-sm">
                <thead className="bg-gray-50 text-xs font-medium text-gray-600">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3">اسم المتطوع</th>
                    <th className="whitespace-nowrap px-4 py-3">رقم الهاتف</th>
                    <th className="whitespace-nowrap px-4 py-3">نطاق الصفحات</th>
                    <th className="whitespace-nowrap px-4 py-3">تاريخ الحجز</th>
                    <th className="whitespace-nowrap px-4 py-3">الموعد النهائي</th>
                    <th className="whitespace-nowrap px-4 py-3">الوقت</th>
                    <th className="whitespace-nowrap px-4 py-3">الحالة</th>
                    <th className="whitespace-nowrap px-4 py-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                        {reservation.volunteer.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        <span dir="ltr" className="inline-block">
                          {reservation.volunteer.phone ?? '—'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {formatArabicPageRange(
                          reservation.startPage,
                          reservation.endPage,
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        {new Date(reservation.createdAt).toLocaleDateString(
                          'ar-JO-u-nu-latn',
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        {new Date(reservation.deadlineAt).toLocaleString(
                          'ar-JO-u-nu-latn',
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        {deadlineLabel(
                          reservation.deadlineAt,
                          reservation.effectiveStatus,
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge status={reservation.effectiveStatus} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {reservation.status === 'IN_PROGRESS' ? (
                          <Button
                            size="sm"
                            variant="danger"
                            loading={
                              rejectReservation.isPending &&
                              rejectReservation.variables?.id === reservation.id
                            }
                            onClick={() => {
                              const confirmed = window.confirm(
                                `هل تريد إلغاء حجز ${reservation.volunteer.name} للصفحات ${reservation.startPage} - ${reservation.endPage} وإعادتها إلى الفرص المتاحة؟`,
                              );
                              if (!confirmed) return;
                              const reason = window.prompt(
                                'سبب إلغاء الحجز (اختياري)',
                              );
                              if (reason === null) return;
                              rejectReservation.mutate({
                                id: reservation.id,
                                reason: reason.trim() || undefined,
                              });
                            }}
                          >
                            إلغاء الحجز
                          </Button>
                        ) : (
                          '—'
                        )}
                        {rejectReservation.isError &&
                          rejectReservation.variables?.id ===
                            reservation.id && (
                            <p className="mt-2 max-w-48 whitespace-normal text-xs text-red-600">
                              تعذر إلغاء الحجز. ربما لم يعد الحجز قيد التنفيذ.
                            </p>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function CoordinatorReservations() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['coordinator-books', page, debouncedSearch],
    queryFn: () =>
      workflowApi.getCoordinatorRequests({
        page,
        limit: 20,
        search: debouncedSearch || undefined,
      }),
    refetchInterval: 60_000,
  });

  const books = (data?.data ?? []).filter(
    (r) =>
      r.requestType === 'PDF_TO_WORD' || r.requestType === 'PDF_TO_AUDIO',
  );
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 20));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">حجوزات الصفحات</h2>
          <p className="mt-1 text-sm text-gray-500">
            اضغط على أي كتاب لعرض المتطوعين وصفحاتهم المحجوزة.
          </p>
        </div>
        <label className="space-y-1 text-sm">
          <span className="block font-medium text-gray-700">بحث</span>
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="اسم الكتاب، نوع التحويل..."
            className="min-h-12 min-w-72 rounded-lg border border-gray-300 px-4"
          />
        </label>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <p className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow-sm">
            جاري التحميل...
          </p>
        )}
        {!isLoading && books.length === 0 && (
          <p className="rounded-xl bg-white p-6 text-sm text-gray-400 shadow-sm">
            لا توجد كتب قيد التحويل.
          </p>
        )}
        {books.map((request) => (
          <BookCard key={request.id} request={request} />
        ))}
      </div>

      {(data?.total ?? 0) > 0 && (
        <nav className="flex items-center justify-center gap-3">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
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
            onClick={() => setPage((p) => p + 1)}
          >
            التالي
          </Button>
        </nav>
      )}
    </div>
  );
}
