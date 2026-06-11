import { useState, useRef } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  Pencil,
  Phone,
  UserRound,
} from 'lucide-react';
import {
  workflowApi,
  type CoordinatorRequestStatus,
  type WorkflowRequest,
} from '../../api/workflow';
import { Button } from '../../Components/ui/Button';
import {
  InputField,
  SelectField,
  TextareaField,
} from '../../Components/ui/FormField';
import { StatusBadge } from '../../Components/ui/StatusBadge';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';
import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';

const typeLabels = {
  PDF_TO_WORD: 'PDF إلى Word',
  PDF_TO_AUDIO: 'PDF إلى تسجيل صوتي',
  ACCOMPANIMENT: 'طلب مرافقة',
};

function RequestCard({ request }: { request: WorkflowRequest }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(
    request.status === 'PENDING_COORDINATOR',
  );
  const [notes, setNotes] = useState(request.coordinatorNotes ?? '');
  const [showReject, setShowReject] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    bookName: request.bookName ?? '',
    details: request.details,
    totalPages: request.totalPages?.toString() ?? '',
  });

  const pending = request.status === 'PENDING_COORDINATOR';
  const conversion =
    request.requestType === 'PDF_TO_WORD' ||
    request.requestType === 'PDF_TO_AUDIO';
  const requester = request.createdByUser;
  const progress = request.conversionProgress;
  const displayName =
    request.bookName ??
    request.title ??
    (request.requestType === 'ACCOMPANIMENT'
      ? 'طلب مرافقة'
      : 'طلب تحويل كتاب');
  const formValid =
    form.details.trim().length >= 10 &&
    (!conversion ||
      (form.bookName.trim().length > 0 && Number(form.totalPages) > 0));

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['coordinator-requests'] });
    void queryClient.invalidateQueries({ queryKey: ['coordinator-stats'] });
    void queryClient.invalidateQueries({ queryKey: ['system-library-books'] });
  };

  const review = useMutation({
    mutationFn: (action: 'accept' | 'reject') =>
      action === 'accept'
        ? workflowApi.acceptRequest(request.id, notes || undefined)
        : workflowApi.rejectRequest(request.id, notes),
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: () =>
      workflowApi.updateCoordinatorRequest(request.id, {
        bookName: conversion ? form.bookName.trim() : undefined,
        details: form.details.trim(),
        totalPages: conversion ? Number(form.totalPages) : undefined,
      }),
    onSuccess: () => {
      setEditing(false);
      refresh();
    },
  });

  const approveCompletion = useMutation({
    mutationFn: () => workflowApi.approveRequestCompletion(request.id),
    onSuccess: refresh,
  });

  const outputFileRef = useRef<HTMLInputElement>(null);
  const uploadOutput = useMutation({
    mutationFn: (file: File) => workflowApi.uploadOutputFile(request.id, file),
    onSuccess: refresh,
  });

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 p-5 text-right transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">{displayName}</h3>
            <StatusBadge status={request.status} />
            <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700">
              {typeLabels[request.requestType]}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <UserRound size={16} aria-hidden="true" />
              {requester?.name ?? request.fullName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone size={16} aria-hidden="true" />
              <bdi dir="ltr">{requester?.phone ?? request.phone}</bdi>
            </span>
            {conversion && (
              <span className="inline-flex items-center gap-1.5">
                <BookOpen size={16} aria-hidden="true" />
                {request.totalPages ?? '-'} صفحة
              </span>
            )}
          </div>
        </div>
        <span className="mt-1 rounded-lg bg-gray-100 p-2 text-gray-600">
          {expanded ? (
            <ChevronUp size={18} aria-hidden="true" />
          ) : (
            <ChevronDown size={18} aria-hidden="true" />
          )}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-5">
          {editing ? (
            <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
              <h4 className="font-semibold text-gray-900">تعديل بيانات الطلب</h4>
              {conversion && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    id={`book-${request.id}`}
                    label="اسم الكتاب"
                    value={form.bookName}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        bookName: event.target.value,
                      }))
                    }
                  />
                  <InputField
                    id={`pages-${request.id}`}
                    label="عدد الصفحات"
                    type="number"
                    min={1}
                    value={form.totalPages}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        totalPages: event.target.value,
                      }))
                    }
                  />
                </div>
              )}
              <TextareaField
                id={`details-${request.id}`}
                label="تفاصيل الطلب"
                value={form.details}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    details: event.target.value,
                  }))
                }
              />
              {update.isError && (
                <p className="text-sm text-red-600">تعذر حفظ التعديلات.</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  disabled={!formValid}
                  loading={update.isPending}
                  onClick={() => update.mutate()}
                >
                  حفظ التعديلات
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-5">
                <section>
                  <h4 className="mb-2 text-sm font-semibold text-gray-900">
                    تفاصيل الطلب
                  </h4>
                  <p className="rounded-lg bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                    {request.details}
                  </p>
                </section>

                {request.volunteerAssignment && (
                  <section className="rounded-lg bg-cyan-50 p-4 text-sm text-cyan-900">
                    <h4 className="font-semibold">المتطوع المسؤول</h4>
                    <p className="mt-1">
                      {request.volunteerAssignment.volunteer.name}
                      {request.volunteerAssignment.volunteer.phone && (
                        <>
                          {' - '}
                          <bdi dir="ltr">
                            {request.volunteerAssignment.volunteer.phone}
                          </bdi>
                        </>
                      )}
                    </p>
                  </section>
                )}

                {request.conversionBook && (
                  <section className="rounded-lg bg-purple-50 p-4 text-sm text-purple-900">
                    <h4 className="font-semibold">حالة الكتاب في النظام</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1">
                        Word:{' '}
                        {request.conversionBook.wordCompleted
                          ? 'مكتمل'
                          : 'غير مكتمل'}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1">
                        صوتي:{' '}
                        {request.conversionBook.audioCompleted
                          ? 'مكتمل'
                          : 'غير مكتمل'}
                      </span>
                    </div>
                  </section>
                )}

                {conversion &&
                  request.status === 'COORDINATOR_ACCEPTED' &&
                  progress && (
                    <section className="space-y-3 rounded-lg border border-cyan-100 p-4 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-semibold text-gray-900">
                          تقدم التحويل
                        </h4>
                        <span className="font-medium text-cyan-700">
                          {progress.completedThroughPage} من{' '}
                          {progress.totalPages ?? 0} صفحة
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-cyan-600"
                          style={{
                            width: `${Math.min(
                              100,
                              progress.totalPages
                                ? (progress.completedThroughPage /
                                    progress.totalPages) *
                                    100
                                : 0,
                            )}%`,
                          }}
                        />
                      </div>
                      <Button
                        size="sm"
                        disabled={!progress.canApproveCompletion}
                        loading={approveCompletion.isPending}
                        onClick={() => approveCompletion.mutate()}
                      >
                        اعتماد اكتمال التحويل 100%
                      </Button>
                      {!progress.canApproveCompletion && (
                        <p className="text-xs text-gray-500">
                          يتاح الاعتماد بعد إكمال جميع الصفحات وعدم وجود حجز قيد
                          التنفيذ.
                        </p>
                      )}
                    </section>
                  )}

                {pending && (
                  <section className="space-y-3 border-t border-gray-100 pt-5">
                    <label
                      className="block text-sm font-semibold text-gray-900"
                      htmlFor={`notes-${request.id}`}
                    >
                      قرار المنسق
                    </label>
                    <textarea
                      id={`notes-${request.id}`}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder={
                        showReject ? 'سبب الرفض مطلوب' : 'ملاحظات اختيارية'
                      }
                    />
                    {review.isError && (
                      <p className="text-sm text-red-600">تعذر تحديث الطلب.</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        loading={review.isPending}
                        onClick={() => review.mutate('accept')}
                      >
                        قبول الطلب
                      </Button>
                      {!showReject ? (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setShowReject(true)}
                        >
                          رفض الطلب
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={!notes.trim()}
                          loading={review.isPending}
                          onClick={() => review.mutate('reject')}
                        >
                          تأكيد الرفض
                        </Button>
                      )}
                    </div>
                  </section>
                )}

                {!pending && request.coordinatorNotes && (
                  <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                    <span className="font-semibold">ملاحظات المنسق:</span>{' '}
                    {request.coordinatorNotes}
                  </p>
                )}
              </div>

              <aside className="space-y-4">
                <dl className="space-y-3 rounded-xl border border-gray-200 p-4 text-sm">
                  <div>
                    <dt className="text-gray-500">مقدم الطلب</dt>
                    <dd className="mt-0.5 font-medium text-gray-900">
                      {requester?.name ?? request.fullName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">رقم التواصل</dt>
                    <dd className="mt-0.5 text-right font-medium" dir="ltr">
                      {requester?.phone ?? request.phone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">البريد الإلكتروني</dt>
                    <dd className="mt-0.5 break-all">
                      {requester?.email ?? request.email ?? '-'}
                    </dd>
                  </div>
                  {conversion && (
                    <div>
                      <dt className="text-gray-500">عدد الصفحات</dt>
                      <dd className="mt-0.5 font-medium">
                        {request.totalPages ?? '-'}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-white"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil size={15} aria-hidden="true" />
                    تعديل الطلب
                  </Button>
                  {request.pdfOriginalName && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="w-full bg-white"
                      onClick={() =>
                        void workflowApi.downloadRequestPdf(
                          request.id,
                          request.pdfOriginalName!,
                        )
                      }
                    >
                      <Download size={15} aria-hidden="true" />
                      تنزيل ملف PDF
                    </Button>
                  )}
                  {request.status === 'DONE' && (
                    <div className="space-y-1.5 rounded-lg border border-dashed border-gray-300 p-3">
                      <p className="text-xs font-medium text-gray-700">
                        الملف المحوّل
                      </p>
                      {request.outputOriginalName && (
                        <p className="truncate text-xs text-gray-500">
                          {request.outputOriginalName}
                        </p>
                      )}
                      {uploadOutput.isError && (
                        <p className="text-xs text-red-600">تعذر رفع الملف.</p>
                      )}
                      <input
                        ref={outputFileRef}
                        type="file"
                        accept=".docx,.doc,.mp3,.wav,.ogg,.aac,.m4a"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadOutput.mutate(file);
                          e.target.value = '';
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-full bg-white"
                        loading={uploadOutput.isPending}
                        onClick={() => outputFileRef.current?.click()}
                      >
                        {request.outputOriginalName ? 'استبدال الملف' : 'رفع الملف المحوّل'}
                      </Button>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function CoordinatorRequests() {
  const [status, setStatus] = useState<CoordinatorRequestStatus | ''>('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['coordinator-requests', status, debouncedSearch],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      workflowApi.getCoordinatorRequests({
        status: status || undefined,
        page: pageParam,
        limit: 10,
        search: debouncedSearch || undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
  const requests = data?.pages.flatMap((result) => result.data) ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">طلبات المستفيدين</h2>
          <p className="mt-1 text-sm text-gray-500">
            اضغط على أي طلب لعرض التفاصيل والإجراءات.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="space-y-1 text-sm">
            <span className="block font-medium text-gray-700">بحث</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="الكتاب، المستفيد، الهاتف، التفاصيل..."
              className="min-h-12 min-w-72 rounded-lg border border-gray-300 px-4"
            />
          </label>
          <SelectField
            id="request-status"
            label="الحالة"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as CoordinatorRequestStatus | '')
            }
            className="min-w-56"
          >
            <option value="">الكل</option>
            <option value="PENDING_COORDINATOR">بانتظار المنسق</option>
            <option value="COORDINATOR_ACCEPTED">مقبول</option>
            <option value="COORDINATOR_REJECTED">مرفوض</option>
            <option value="DONE">مكتمل</option>
          </SelectField>
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-500">جاري التحميل...</p>}
      {!isLoading && requests.length === 0 && (
        <p className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow-sm">
          لا توجد طلبات بهذه الحالة.
        </p>
      )}
      <div className="space-y-3">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
      <InfiniteScrollTrigger
        hasNextPage={Boolean(hasNextPage)}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={() => void fetchNextPage()}
      />
    </div>
  );
}
