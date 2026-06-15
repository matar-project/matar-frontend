import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiClient } from '../api/client';

export default function AccountRejected() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) return;
    const data = new FormData();
    data.append('healthReport', file, file.name);
    try {
      await apiClient.post('/verification-documents/reupload', data, {
        headers: { 'Content-Type': undefined },
      });
      const stored = localStorage.getItem('user');
      if (stored) {
        const user = { ...JSON.parse(stored), status: 'PENDING_ADMIN_REVIEW' };
        localStorage.setItem('user', JSON.stringify(user));
      }
      navigate('/account-pending', { replace: true });
    } catch (requestError) {
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setError(
        Array.isArray(message)
          ? message.join('، ')
          : typeof message === 'string'
            ? message
            : 'تعذر رفع التقرير. تأكد من النوع والحجم وحاول مرة أخرى.',
      );
    }
  }

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={submit} className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">تم رفض التقرير الصحي</h1>
        <p className="text-gray-600">يرجى رفع تقرير واضح وصحيح لإعادة مراجعته.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          required
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setError('');
          }}
          className="w-full rounded-lg border p-3"
        />
        <button className="w-full rounded-lg bg-primary-600 px-4 py-3 font-medium text-white">رفع التقرير الجديد</button>
      </form>
    </main>
  );
}
