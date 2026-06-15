import { useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginSubmitForm } from '../Hooks/auth/UseLoginSubmitForm';
import { useAuth } from '../Hooks/auth/UseAuth';
import { getAccountRedirectPath } from '../lib/roleRedirect';
import { House } from 'lucide-react';
import logo from '../assets/logo.png';

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { errors, isSubmitting, serverError, submitForm, updateField, values } = useLoginSubmitForm();

  useEffect(() => {
    if (user) {
      navigate(getAccountRedirectPath(user), { replace: true });
    }
  }, [navigate, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const session = await submitForm(event);

    if (session) {
      navigate(getAccountRedirectPath(session.user), { replace: true });
    }
  }

  return (
    <main className="relative min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
      <Link
        to="/"
        aria-label="العودة إلى الصفحة الرئيسية"
        className="group absolute right-4 top-4 inline-flex h-12 items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-4 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white hover:text-primary-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:right-8 sm:top-8"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-100">
          <House size={17} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span>الرئيسية</span>
      </Link>

      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <img src={logo} alt="مشروع مطر" className="h-16 w-auto mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">مشروع مطر</h1>
          <p className="text-gray-500 text-sm">لوحة تحكم الإدارة</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
          {serverError && (
            <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-label="نموذج تسجيل الدخول">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600" role="alert">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={values.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-red-600" role="alert">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors min-h-[48px] flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              )}
              {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            ليس لديك حساب؟{' '}
            <Link to="/signup" className="text-primary-600 hover:underline font-medium">
              إنشاء حساب
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
