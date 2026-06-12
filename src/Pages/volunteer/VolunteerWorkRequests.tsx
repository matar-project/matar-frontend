import { useRef, useState } from 'react';
import axios from 'axios';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  BookOpen,
  CalendarClock,
  Download,
  FileText,
  Phone,
  Upload,
} from 'lucide-react';
import {
  workflowApi,
  type AccompanimentAssignment,
  type Reservation,
} from '../../api/workflow';
import { Button } from '../../Components/ui/Button';
import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';
import { StatusBadge } from '../../Components/ui/StatusBadge';
import { ExpandableCardHeader } from '../../Components/ExpandableCardHeader';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';
import { formatArabicPageRange } from '../../lib/utils';

const typeLabels = {
  PDF_TO_WORD: 'PDF إلى Word',
  PDF_TO_AUDIO: 'PDF إلى تسجيل صوتي',
  ACCOMPANIMENT: 'طلب مرافقة',
};

function AccompanimentRow({
  assignment,
}: {
  assignment: AccompanimentAssignment;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <ExpandableCardHeader
        expanded={expanded}
        onToggle={() => setExpanded((current) => !current)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-gray-900">
              {assignment.request.title ?? 'طلب مرافقة'}
            </h3>
            <StatusBadge status={assignment.status} />
            <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700">
              طلب مرافقة
            </span>
          </div>
          <p className="mt-2 line-clamp-1 text-sm text-gray-500">
            {assignment.request.details}
          </p>
        </div>
      </ExpandableCardHeader>

      {expanded && (
        <div className="space-y-4 border-t border-gray-100 p-5">
          <section>
            <h4 className="mb-2 text-sm font-semibold text-gray-900">
              تفاصيل الطلب
            </h4>
            <p className="rounded-lg bg-gray-50 p-4 text-sm leading-7 text-gray-700">
              {assignment.request.details}
            </p>
          </section>
          {assignment.request.coordinator?.phone && (
            <a
              href={`tel:${assignment.request.coordinator.phone}`}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800"
            >
              <Phone size={16} aria-hidden="true" />
              رقم المنسق:
              <bdi dir="ltr">{assignment.request.coordinator.phone}</bdi>
            </a>
          )}
        </div>
      )}
    </article>
  );
}

function ReservationRow({
  reservation,
  onUpdate,
  updating,
  updateError,
}: {
  reservation: Reservation;
  onUpdate: (
    action: 'done' | 'reject',
    reason?: string,
    file?: File,
  ) => void;
  updating: boolean;
  updateError?: string;
}) {
  const [expanded, setExpanded] = useState(
    reservation.status === 'IN_PROGRESS',
  );
  const bookName =
    reservation.request.bookName ??
    reservation.request.title ??
    'طلب تحويل كتاب';
  const wordFileRef = useRef<HTMLInputElement>(null);

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <ExpandableCardHeader
        expanded={expanded}
        onToggle={() => setExpanded((current) => !current)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-gray-900">{bookName}</h3>
            <StatusBadge status={reservation.effectiveStatus} />
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {typeLabels[reservation.request.requestType]}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen size={16} aria-hidden="true" />
              الصفحات{' '}
              {formatArabicPageRange(
                reservation.startPage,
                reservation.endPage,
              )}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock size={16} aria-hidden="true" />
              {new Date(reservation.deadlineAt).toLocaleString(
                'ar-JO-u-nu-latn',
              )}
            </span>
          </div>
        </div>
      </ExpandableCardHeader>

      {expanded && (
        <div className="border-t border-gray-100 p-5">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-4">
              <dl className="grid gap-3 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">اسم الكتاب</dt>
                  <dd className="mt-1 font-medium text-gray-900">{bookName}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">نوع التحويل</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {typeLabels[reservation.request.requestType]}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">الصفحات المحجوزة</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {formatArabicPageRange(
                      reservation.startPage,
                      reservation.endPage,
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">الموعد النهائي</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {new Date(reservation.deadlineAt).toLocaleString(
                      'ar-JO-u-nu-latn',
                    )}
                  </dd>
                </div>
              </dl>

              {reservation.rejectionReason && (
                <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  <span className="font-semibold">سبب الرفض:</span>{' '}
                  {reservation.rejectionReason}
                </p>
              )}
            </div>

            <aside className="flex flex-col gap-2">
              {reservation.request.pdfOriginalName && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-full bg-white"
                  onClick={() =>
                    void workflowApi.downloadRequestPdf(
                      reservation.request.id,
                      reservation.request.pdfOriginalName!,
                    )
                  }
                >
                  <Download size={15} aria-hidden="true" />
                  تنزيل ملف PDF
                </Button>
              )}
              {reservation.status === 'IN_PROGRESS' && (
                <>
                  {reservation.request.requestType === 'PDF_TO_WORD' ? (
                    <>
                      <input
                        ref={wordFileRef}
                        type="file"
                        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) onUpdate('done', undefined, file);
                          event.target.value = '';
                        }}
                      />
                      <Button
                        size="sm"
                        className="w-full"
                        disabled={reservation.effectiveStatus === 'LATE'}
                        loading={updating}
                        onClick={() => wordFileRef.current?.click()}
                      >
                        <Upload size={15} aria-hidden="true" />
                        رفع ملف Word وإكمال الصفحات
                      </Button>
                      <p className="rounded-lg bg-blue-50 p-3 text-xs leading-6 text-blue-700">
                        لن تُعتبر الصفحات مكتملة قبل رفع ملف Word بصيغة
                        .docx.
                      </p>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={reservation.effectiveStatus === 'LATE'}
                      loading={updating}
                      onClick={() => onUpdate('done')}
                    >
                      <FileText size={15} aria-hidden="true" />
                      تم إكمال الصفحات
                    </Button>
                  )}
                  {updateError && (
                    <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
                      {updateError}
                    </p>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    className="w-full"
                    onClick={() => {
                      const reason = window.prompt(
                        'سبب رفض المهمة (اختياري)',
                      );
                      if (reason === null) return;
                      onUpdate('reject', reason.trim() || undefined);
                    }}
                  >
                    رفض المهمة
                  </Button>
                </>
              )}
              {(reservation.effectiveStatus === 'LATE' ||
                reservation.effectiveStatus === 'EXPIRED') && (
                <p className="rounded-lg bg-orange-50 p-3 text-xs text-orange-700">
                  انتهى الموعد النهائي وتمت إعادة الصفحات إلى الفرص المتاحة.
                </p>
              )}
            </aside>
          </div>
        </div>
      )}
    </article>
  );
}

export default function VolunteerWorkRequests() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);
  const reservationsQuery = useInfiniteQuery({
    queryKey: ['volunteer-my-reservations', debouncedSearch],
    queryFn: ({ pageParam }) =>
      workflowApi.getMyReservations({
        page: pageParam,
        limit: 10,
        search: debouncedSearch || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    refetchInterval: 60_000,
  });
  const accompanimentQuery = useInfiniteQuery({
    queryKey: ['volunteer-accompaniment-requests', debouncedSearch],
    queryFn: ({ pageParam }) =>
      workflowApi.getMyAccompanimentRequests({
        page: pageParam,
        limit: 10,
        search: debouncedSearch || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
  const reservations =
    reservationsQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const accompanimentAssignments =
    accompanimentQuery.data?.pages.flatMap((page) => page.data) ?? [];

  const updateReservation = useMutation({
    mutationFn: ({
      id,
      action,
      reason,
      file,
    }: {
      id: number;
      action: 'done' | 'reject';
      reason?: string;
      file?: File;
    }) =>
      action === 'done'
        ? file
          ? workflowApi.completeWordReservation(id, file)
          : workflowApi.markReservationDone(id)
        : workflowApi.rejectReservation(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['volunteer-available-requests'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['volunteer-my-reservations'],
      });
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: ['volunteer-available-requests'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['volunteer-my-reservations'],
      });
    },
  });

  const getUpdateError = (reservationId: number) => {
    if (
      !updateReservation.isError ||
      updateReservation.variables?.id !== reservationId
    ) {
      return undefined;
    }
    const fallback =
      updateReservation.variables.action === 'reject'
        ? 'تعذر رفض المهمة. ربما انتهت المهلة وتمت إعادة الصفحات إلى الفرص المتاحة.'
        : updateReservation.variables.file
          ? 'تعذر إكمال المهمة. تأكد من اختيار ملف Word بصيغة .docx صالح.'
          : 'تعذر إكمال المهمة.';
    if (!axios.isAxiosError(updateReservation.error)) return fallback;
    const message = updateReservation.error.response?.data?.message;
    if (message === 'Reservation is no longer in progress') {
      return 'هذه المهمة لم تعد قيد التنفيذ. ربما انتهت المهلة وتمت إعادة الصفحات إلى الفرص المتاحة.';
    }
    return fallback;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">حجوزاتي</h1>
        <p className="mt-1 text-sm text-gray-500">
          اضغط على أي حجز لعرض التفاصيل والإجراءات.
        </p>
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="ابحث في جميع الحقول..."
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      {accompanimentAssignments.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">
            طلبات المرافقة الخاصة بي
          </h2>
          {accompanimentAssignments.map((assignment) => (
            <AccompanimentRow key={assignment.id} assignment={assignment} />
          ))}
          <InfiniteScrollTrigger
            hasNextPage={Boolean(accompanimentQuery.hasNextPage)}
            isFetchingNextPage={accompanimentQuery.isFetchingNextPage}
            fetchNextPage={() => void accompanimentQuery.fetchNextPage()}
          />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">حجوزات الصفحات</h2>
        {reservationsQuery.isLoading && (
          <p className="text-sm text-gray-500">جاري التحميل...</p>
        )}
        {!reservationsQuery.isLoading && reservations.length === 0 && (
          <p className="rounded-xl bg-white p-5 text-sm text-gray-500 shadow-sm">
            لم تحجز أي صفحات حتى الآن.
          </p>
        )}
        {reservations.map((reservation) => (
          <ReservationRow
            key={reservation.id}
            reservation={reservation}
            updating={
              updateReservation.isPending &&
              updateReservation.variables?.id === reservation.id
            }
            updateError={getUpdateError(reservation.id)}
            onUpdate={(action, reason, file) =>
              updateReservation.mutate({
                id: reservation.id,
                action,
                reason,
                file,
              })
            }
          />
        ))}
        <InfiniteScrollTrigger
          hasNextPage={Boolean(reservationsQuery.hasNextPage)}
          isFetchingNextPage={reservationsQuery.isFetchingNextPage}
          fetchNextPage={() => void reservationsQuery.fetchNextPage()}
        />
      </section>
    </div>
  );
}
