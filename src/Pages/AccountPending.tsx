import { useAuth } from '../Hooks/auth/UseAuth';
import { useNavigate } from 'react-router-dom';

export default function AccountPending() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <section className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">حسابك قيد المراجعة</h1>
        <p className="mt-4 leading-8 text-gray-600">
          تم استلام تقريرك الصحي بنجاح. عليك الانتظار حتى يوافق المشرف على حسابك، وسنرسل لك بريداً إلكترونياً عند التحقق وقبول الحساب.
        </p>
        <div className="mt-5 rounded-lg bg-amber-50 p-3 font-medium text-amber-800">PENDING_ADMIN_REVIEW</div>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="mt-6 text-sm font-medium text-primary-700"
        >
          تسجيل الخروج
        </button>
      </section>
    </main>
  );
}
