import { useState } from 'react';
import { Download } from 'lucide-react';
import { requestsApi } from '../../api/requests';
import { Button } from '../../Components/ui/Button';
import { InputField, SelectField, TextareaField } from '../../Components/ui/FormField';
import { StatusBadge } from '../../Components/ui/StatusBadge';
import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';
import { useAuth } from '../../Hooks/auth/UseAuth';
import { useMyRequestsInfiniteQuery } from '../../Hooks/visuallyImpaired/queries/useMyRequestsInfiniteQuery';
import { useRequestHelpForm } from '../../Hooks/visuallyImpaired/useRequestHelpForm';
import { REQUEST_TYPE_LABELS } from '../../constants/volunteerOpportunities.constants';

type Tab = 'list' | 'new';

export default function VIRequestHelp() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('list');

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMyRequestsInfiniteQuery();

  const requests = data?.pages.flatMap((p) => p.data) ?? [];

  const {
    register,
    formState: { errors },
    isPdfRequest,
    mutation,
    onSubmit,
  } = useRequestHelpForm(() => setTab('list'));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">طلباتي</h1>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab('list')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'list'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          الطلبات السابقة
        </button>
        <button
          onClick={() => setTab('new')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'new'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          طلب جديد
        </button>
      </div>

      {tab === 'list' && (
        <div className="space-y-3">
          {isLoading && (
            <p className="py-10 text-center text-sm text-gray-500">جاري التحميل...</p>
          )}
          {!isLoading && requests.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-gray-500">لا توجد طلبات سابقة.</p>
              <Button variant="outline" className="mt-4" onClick={() => setTab('new')}>
                قدّم طلبك الأول
              </Button>
            </div>
          )}
          {requests.map((req) => (
            <div key={req.id} className="rounded-2xl bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {req.bookName ?? REQUEST_TYPE_LABELS[req.requestType]}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {REQUEST_TYPE_LABELS[req.requestType]}
                  </p>
                </div>
                <StatusBadge status={req.status} />
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{req.details}</p>
              {req.coordinatorNotes && (
                <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                  ملاحظة الموزع: {req.coordinatorNotes}
                </p>
              )}
              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-xs text-gray-400">
                  {new Date(req.createdAt).toLocaleDateString(
                    'ar-JO-u-nu-latn',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )}
                </p>
                {req.status === 'DONE' && (
                  req.outputOriginalName ? (
                    <button
                      onClick={() =>
                        void requestsApi.downloadOutputFile(
                          req.id,
                          req.outputOriginalName!,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100 transition-colors"
                    >
                      <Download size={13} aria-hidden="true" />
                      تنزيل الملف المحوّل
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">الملف قيد الإعداد...</span>
                  )
                )}
              </div>
            </div>
          ))}
          <InfiniteScrollTrigger
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      )}

      {tab === 'new' && (
        <form
          onSubmit={onSubmit}
          className="space-y-6 rounded-2xl bg-white p-6 shadow-sm md:p-8"
          noValidate
        >
          <div className="space-y-1 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
            <p>الاسم: {user?.name}</p>
            <p>
              الهاتف: <span dir="ltr">{user?.phone}</span>
            </p>
            <p>
              الموقع: {user?.country}، {user?.city}
            </p>
          </div>
          <SelectField
            id="requestType"
            label="نوع الطلب"
            required
            error={errors.requestType?.message}
            {...register('requestType')}
          >
            <option value="PDF_TO_WORD">تحويل PDF إلى Word</option>
            <option value="PDF_TO_AUDIO">تحويل PDF إلى تسجيل صوتي</option>
            <option value="ACCOMPANIMENT">طلب مرافقة</option>
          </SelectField>
          {isPdfRequest && (
            <InputField
              id="bookName"
              label="اسم الكتاب"
              required
              error={errors.bookName?.message}
              {...register('bookName')}
            />
          )}
          <TextareaField
            id="details"
            label="تفاصيل الطلب"
            required
            error={errors.details?.message}
            {...register('details')}
          />
          {isPdfRequest && (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                id="pdfFile"
                label="ملف PDF"
                type="file"
                accept="application/pdf,.pdf"
                required
                error={errors.pdfFile?.message}
                {...register('pdfFile')}
              />
              <InputField
                id="totalPages"
                label="عدد الصفحات"
                type="number"
                min={1}
                required
                error={errors.totalPages?.message}
                {...register('totalPages')}
              />
            </div>
          )}
          {mutation.isError && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              تعذر إرسال الطلب. تحقق من البيانات وحاول مجددا.
            </p>
          )}
          <Button type="submit" size="lg" loading={mutation.isPending} className="w-full">
            إرسال الطلب
          </Button>
        </form>
      )}
    </div>
  );
}
