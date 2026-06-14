import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resendEmailCode, verifyEmailCode } from '../api/auth.api';
import { useAuth } from '../Hooks/auth/UseAuth';
import { getAccountRedirectPath } from '../lib/roleRedirect';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithSession, user } = useAuth();
  const email =
    (location.state as { email?: string } | null)?.email ??
    sessionStorage.getItem('pendingVerificationEmail') ??
    user?.email ??
    '';
  const signupToken = sessionStorage.getItem('pendingSignupToken') ?? '';
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const session = await verifyEmailCode(signupToken, email, code);
      sessionStorage.removeItem('pendingVerificationEmail');
      sessionStorage.removeItem('pendingSignupToken');
      loginWithSession(session);
      navigate(getAccountRedirectPath(session.user), { replace: true });
    } catch {
      setError('تعذر تأكيد البريد. تحقق من الرمز وحاول مرة أخرى.');
    }
  }

  async function resend() {
    setError('');
    try {
      const response = await resendEmailCode(signupToken);
      setMessage(response.message);
    } catch {
      setError('تعذر إرسال الرمز حالياً. خدمة البريد الإلكتروني غير متاحة.');
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 px-4 py-16">
      <form onSubmit={submit} className="mx-auto max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">تأكيد البريد الإلكتروني</h1>
        <p className="text-sm text-gray-600">أدخل الرمز المكوّن من 6 أرقام الذي أرسلناه إلى بريدك.</p>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
        <input
          type="email"
          value={email}
          readOnly
          aria-label="البريد الإلكتروني المسجل"
          className="w-full cursor-not-allowed rounded-lg border bg-gray-100 px-4 py-3 text-gray-700"
        />
        <input inputMode="numeric" pattern="\d{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} required placeholder="123456" className="w-full rounded-lg border px-4 py-3 text-center text-2xl tracking-[0.4em]" />
        <button className="w-full rounded-lg bg-primary-600 px-4 py-3 font-medium text-white">تأكيد البريد الإلكتروني</button>
        <button type="button" onClick={() => void resend()} className="w-full text-sm font-medium text-primary-700">إعادة إرسال الرمز</button>
      </form>
    </main>
  );
}
