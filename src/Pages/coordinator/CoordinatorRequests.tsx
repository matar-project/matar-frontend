import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  workflowApi,
  type CoordinatorRequestStatus,
  type WorkflowRequest,
} from '../../api/workflow';
import { Button } from '../../Components/ui/Button';
import { SelectField } from '../../Components/ui/FormField';
import { StatusBadge } from '../../Components/ui/StatusBadge';

const typeLabels = {
  PDF_TO_WORD: 'PDF إلى Word',
  PDF_TO_AUDIO: 'PDF إلى تسجيل صوتي',
  ACCOMPANIMENT: 'طلب مرافقة',
};

function RequestCard({ request }: { request: WorkflowRequest }) {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState(request.coordinatorNotes ?? '');
  const [showReject, setShowReject] = useState(false);

  const review = useMutation({
    mutationFn: (action: 'accept' | 'reject') =>
      action === 'accept'
        ? workflowApi.acceptRequest(request.id, notes || undefined)
        : workflowApi.rejectRequest(request.id, notes),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['coordinator-requests'] });
      void queryClient.invalidateQueries({ queryKey: ['coordinator-stats'] });
    },
  });

  const pending = request.status === 'PENDING_COORDINATOR';
  const requester = request.createdByUser;

  return (
    <article className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-gray-900">{request.title ?? 'طلب بدون عنوان'}</h3>
          <p className="mt-1 text-sm text-cyan-700">{typeLabels[request.requestType]}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>
      <p className="text-sm leading-7 text-gray-700">{request.details}</p>
      <dl className="grid gap-2 rounded-lg bg-gray-50 p-4 text-sm sm:grid-cols-2">
        <div><dt className="text-gray-500">مقدم الطلب</dt><dd>{requester?.name ?? request.fullName}</dd></div>
        <div><dt className="text-gray-500">التواصل</dt><dd dir="ltr">{requester?.phone ?? request.phone}</dd></div>
        <div><dt className="text-gray-500">البريد</dt><dd>{requester?.email ?? request.email ?? '-'}</dd></div>
        <div><dt className="text-gray-500">عدد الصفحات</dt><dd>{request.totalPages ?? '-'}</dd></div>
      </dl>
      {request.pdfOriginalName && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            void workflowApi.downloadRequestPdf(request.id, request.pdfOriginalName!)
          }
        >
          تنزيل {request.pdfOriginalName}
        </Button>
      )}
      {!request.pdfOriginalName && request.pdfFileUrl && (
        <a
          href={request.pdfFileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-sm font-medium text-blue-700 underline"
        >
          فتح ملف PDF
        </a>
      )}
      {pending && (
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor={`notes-${request.id}`}>
            ملاحظات الموزع
          </label>
          <textarea
            id={`notes-${request.id}`}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={showReject ? 'سبب الرفض مطلوب' : 'ملاحظات اختيارية'}
          />
          {review.isError && (
            <p className="text-sm text-red-600">تعذر تحديث الطلب. تحقق من البيانات وحاول مجددا.</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              loading={review.isPending}
              onClick={() => review.mutate('accept')}
            >
              قبول
            </Button>
            {!showReject ? (
              <Button size="sm" variant="danger" onClick={() => setShowReject(true)}>
                رفض
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
        </div>
      )}
      {!pending && request.coordinatorNotes && (
        <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          ملاحظات الموزع: {request.coordinatorNotes}
        </p>
      )}
    </article>
  );
}

export default function CoordinatorRequests() {
  const [status, setStatus] = useState<CoordinatorRequestStatus | ''>('');
  const { data = [], isLoading } = useQuery({
    queryKey: ['coordinator-requests', status],
    queryFn: () => workflowApi.getCoordinatorRequests(status || undefined),
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">طلبات المستفيدين</h2>
          <p className="mt-1 text-sm text-gray-500">تصل الطلبات الجديدة هنا قبل عرضها للمتطوعين.</p>
        </div>
        <SelectField
          id="request-status"
          label="الحالة"
          value={status}
          onChange={(event) => setStatus(event.target.value as CoordinatorRequestStatus | '')}
          className="min-w-56"
        >
          <option value="">الكل</option>
          <option value="PENDING_COORDINATOR">بانتظار الموزع</option>
          <option value="COORDINATOR_ACCEPTED">مقبول</option>
          <option value="COORDINATOR_REJECTED">مرفوض</option>
        </SelectField>
      </div>
      {isLoading && <p className="text-sm text-gray-500">جاري التحميل...</p>}
      {!isLoading && data.length === 0 && (
        <p className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow-sm">لا توجد طلبات بهذه الحالة.</p>
      )}
      <div className="grid gap-4 xl:grid-cols-2">
        {data.map((request) => <RequestCard key={request.id} request={request} />)}
      </div>
    </div>
  );
}
