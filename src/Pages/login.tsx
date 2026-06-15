import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { AuthPageShell } from '../Components/auth/AuthPageShell';
import { useLoginSubmitForm } from '../Hooks/auth/UseLoginSubmitForm';
import { useAuth } from '../Hooks/auth/UseAuth';
import { getAccountRedirectPath } from '../lib/roleRedirect';

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    errors,
    isSubmitting,
    serverError,
    submitForm,
    updateField,
    values,
  } = useLoginSubmitForm();

  useEffect(() => {
    if (user) navigate(getAccountRedirectPath(user), { replace: true });
  }, [navigate, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const session = await submitForm(event);
    if (session) {
      navigate(getAccountRedirectPath(session.user), { replace: true });
    }
  }

  return (
    <AuthPageShell mode="login">
      <div className="flex min-w-0 items-center px-5 py-9 sm:px-12 lg:px-16">
        <div className="mx-auto w-full min-w-0 max-w-lg">
          <div className="mb-9">
            <p className="mb-2 text-sm font-semibold text-secondary-600">
              أهلاً بك من جديد
            </p>
            <h1 className="text-2xl font-bold text-primary-900 sm:text-4xl">
              تسجيل الدخول
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              أدخل بيانات حسابك للوصول إلى خدمات مشروع مطر.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
            aria-label="نموذج تسجيل الدخول"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                البريد الإلكتروني
              </label>
              <div
                className={`flex min-h-14 items-center rounded-xl border bg-gray-50/80 transition focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-50 ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <span className="grid h-7 w-14 place-items-center border-l border-gray-200 text-gray-400">
                  <Mail size={20} aria-hidden="true" />
                </span>
                <input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={(event) =>
                    updateField('email', event.target.value)
                  }
                  placeholder="name@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-left text-gray-900 outline-none placeholder:text-gray-400"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  كلمة المرور
                </label>
                <Link
                  to="/signup"
                  className="text-xs font-semibold text-primary-600 transition hover:text-primary-800 hover:underline"
                >
                  ليس لديك حساب؟
                </Link>
              </div>
              <div
                className={`flex min-h-14 items-center rounded-xl border bg-gray-50/80 transition focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-50 ${
                  errors.password ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <span className="grid h-7 w-14 place-items-center border-l border-gray-200 text-gray-400">
                  <LockKeyhole size={20} aria-hidden="true" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={(event) =>
                    updateField('password', event.target.value)
                  }
                  placeholder="كلمة المرور"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'
                  }
                  className="grid h-12 w-12 place-items-center text-gray-400 transition hover:text-primary-600"
                >
                  {showPassword ? (
                    <EyeOff size={20} aria-hidden="true" />
                  ) : (
                    <Eye size={20} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting && (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden="true"
                />
              )}
              {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            مستخدم جديد؟{' '}
            <Link
              to="/signup"
              className="font-semibold text-secondary-600 hover:underline"
            >
              إنشاء حساب
            </Link>
          </p>
        </div>
      </div>
    </AuthPageShell>
  );
}

export default Login;
