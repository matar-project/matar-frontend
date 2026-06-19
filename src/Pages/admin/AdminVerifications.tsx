import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { type PendingVerification, verificationsApi } from '../../api/verifications';

export default function AdminVerifications() {
  const [items, setItems] = useState<PendingVerification[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    verificationsApi.pending().then(setItems).catch(() => setError('تعذر تحميل طلبات التحقق.'));
  }, []);

  const removeItem = (id: number) =>
    setItems((current) => current.filter((item) => item.id !== id));

  const approveMutation = useMutation({
    mutationFn: (id: number) => verificationsApi.approve(id),
    onMutate: () => setError(''),
    onSuccess: (_data, id) => removeItem(id),
    onError: () => setError('تعذر قبول الطلب. حاول مرة أخرى.'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      verificationsApi.reject(id, reason),
    onMutate: () => setError(''),
    onSuccess: (_data, { id }) => removeItem(id),
    onError: () => setError('تعذر رفض الطلب. حاول مرة أخرى.'),
  });

  function reject(id: number) {
    const reason = window.prompt('سبب رفض التقرير');
    if (!reason) return;
    rejectMutation.mutate({ id, reason });
  }

  async function download(item: PendingVerification) {
    const response = await verificationsApi.download(item.id);
    const url = URL.createObjectURL(response.data);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = item.originalName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">طلبات التحقق من المستفيدين</h1>
        <p className="mt-1 text-sm text-gray-500">راجع التقارير الصحية ثم اقبل الحساب أو ارفضه.</p>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      {!items.length && !error && <p className="rounded-xl bg-white p-6 text-gray-500">لا توجد طلبات معلقة.</p>}
      <div className="grid gap-4">
        {items.map((item) => {
          const isApproving = approveMutation.isPending && approveMutation.variables === item.id;
          const isRejecting = rejectMutation.isPending && rejectMutation.variables?.id === item.id;
          const isBusy = isApproving || isRejecting;

          return (
            <article key={item.id} className="rounded-xl bg-white p-5 shadow-sm">
              <h2 className="font-bold">{item.user.name}</h2>
              <p className="text-sm text-gray-600">{item.user.email} · {item.user.phone}</p>
              <p className="mt-2 text-sm">الملف: {item.originalName} ({Math.ceil(item.fileSize / 1024)} KB)</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => void download(item)}
                  disabled={isBusy}
                  className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  تنزيل التقرير
                </button>
                <button
                  onClick={() => approveMutation.mutate(item.id)}
                  disabled={isBusy}
                  aria-busy={isApproving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isApproving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                  )}
                  {isApproving ? 'جارٍ القبول وإرسال البريد...' : 'قبول وإرسال البريد'}
                </button>
                <button
                  onClick={() => reject(item.id)}
                  disabled={isBusy}
                  aria-busy={isRejecting}
                  className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isRejecting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                  )}
                  {isRejecting ? 'جارٍ الرفض...' : 'رفض'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
