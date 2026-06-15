import { useEffect, useState } from 'react';
import { type PendingVerification, verificationsApi } from '../../api/verifications';

export default function AdminVerifications() {
  const [items, setItems] = useState<PendingVerification[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    verificationsApi.pending().then(setItems).catch(() => setError('تعذر تحميل طلبات التحقق.'));
  }, []);

  async function approve(id: number) {
    await verificationsApi.approve(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }

  async function reject(id: number) {
    const reason = window.prompt('سبب رفض التقرير');
    if (!reason) return;
    await verificationsApi.reject(id, reason);
    setItems((current) => current.filter((item) => item.id !== id));
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
        {items.map((item) => (
          <article key={item.id} className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="font-bold">{item.user.name}</h2>
            <p className="text-sm text-gray-600">{item.user.email} · {item.user.phone}</p>
            <p className="mt-2 text-sm">الملف: {item.originalName} ({Math.ceil(item.fileSize / 1024)} KB)</p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => void download(item)} className="rounded-lg border px-4 py-2">تنزيل التقرير</button>
              <button onClick={() => void approve(item.id)} className="rounded-lg bg-green-600 px-4 py-2 text-white">قبول وإرسال البريد</button>
              <button onClick={() => void reject(item.id)} className="rounded-lg bg-red-600 px-4 py-2 text-white">رفض</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
