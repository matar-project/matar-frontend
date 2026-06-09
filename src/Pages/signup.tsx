import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignupSubmitForm } from '../Hooks/auth/UseSignupSubmitForm';
import { useAuth } from '../Hooks/auth/UseAuth';
import { getRoleRedirectPath } from '../lib/roleRedirect';
import logo from '../assets/logo.png';

function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { errors, isSubmitting, serverError, submitForm, updateField, values } = useSignupSubmitForm();

  useEffect(() => {
    if (user) {
      navigate(getRoleRedirectPath(user.role), { replace: true });
    }
  }, [navigate, user]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10" dir="rtl">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <img src={logo} alt="مشروع مطر" className="h-16 w-auto mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">مشروع مطر</h1>
          <p className="text-gray-500 text-sm">إنشاء حساب جديد</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
          {serverError && (
            <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={submitForm} className="space-y-5" noValidate aria-label="نموذج إنشاء حساب">
            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                الاسم الكامل
              </label>
              <input
                id="name"
                type="text"
                value={values.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="محمد أحمد"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-600" role="alert">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600" role="alert">{errors.email}</p>
              )}
            </div>

            {/* Password */}
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
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-red-600" role="alert">{errors.password}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <p className="block text-sm font-medium text-gray-700">نوع الحساب</p>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    values.role === 'volunteer'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="volunteer"
                    checked={values.role === 'volunteer'}
                    onChange={() => updateField('role', 'volunteer')}
                    className="sr-only"
                  />
                  <span className="text-2xl" aria-hidden="true">🤝</span>
                  <span className="text-sm font-medium text-gray-800 text-center">متطوع</span>
                  <span className="text-xs text-gray-500 text-center">أريد المساهمة في تحويل الكتب</span>
                </label>

                <label
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    values.role === 'visually_impired'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="visually_impired"
                    checked={values.role === 'visually_impired'}
                    onChange={() => updateField('role', 'visually_impired')}
                    className="sr-only"
                  />
                  <span className="text-2xl" aria-hidden="true">📚</span>
                  <span className="text-sm font-medium text-gray-800 text-center">مستفيد</span>
                  <span className="text-xs text-gray-500 text-center">أحتاج مواد تعليمية مسموعة</span>
                </label>
              </div>
              {errors.role && (
                <p className="text-sm text-red-600" role="alert">{errors.role}</p>
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
              {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Signup;
