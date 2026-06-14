import { useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignupSubmitForm } from '../Hooks/auth/UseSignupSubmitForm';
import { useAuth } from '../Hooks/auth/UseAuth';
import logo from '../assets/logo.png';
import Select from 'react-select';
import {
  getCountryCallingCode,
  type Country,
} from 'react-phone-number-input';
import PhoneNumberInput from 'react-phone-number-input/input';
import { cn } from '../lib/utils';
import { COUNTRY_OPTIONS } from '../constants/signup.constants';

function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { errors, isSubmitting, serverError, submitForm, updateField, validateField, values } = useSignupSubmitForm();
  const selectedCountry = values.country ? values.country as Country : undefined;

  useEffect(() => {
    if (user) {
      navigate('/login', { replace: true });
    }
  }, [navigate, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const result = await submitForm(event);

    if (result) {
      sessionStorage.setItem('pendingVerificationEmail', result.email);
      sessionStorage.setItem('pendingSignupToken', result.signupToken);
      navigate('/verify-email', { replace: true, state: { email: result.email } });
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:px-6" dir="rtl">
      <div className="w-full max-w-6xl space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <img src={logo} alt="مشروع مطر" className="h-16 w-auto mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">مشروع مطر</h1>
          <p className="text-gray-500 text-sm">إنشاء حساب جديد</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-8 space-y-5">
          {serverError && (
            <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            noValidate
            aria-label="نموذج إنشاء حساب"
          >
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
                onBlur={() => validateField('email')}
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
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                الدولة
              </label>
              <Select
                inputId="country"
                isRtl
                isSearchable
                options={COUNTRY_OPTIONS}
                value={COUNTRY_OPTIONS.find((option) => option.value === values.country) ?? null}
                onChange={(option) => {
                  updateField('country', option?.value ?? '');
                  updateField('city', '');
                  updateField('phone', '');
                }}
                placeholder="ابحث عن الدولة..."
                noOptionsMessage={() => 'لا توجد دولة مطابقة'}
                classNamePrefix="searchable-country"
                className={errors.country ? 'searchable-country-error' : undefined}
                aria-invalid={Boolean(errors.country)}
                aria-describedby={errors.country ? 'country-error' : undefined}
              />
              {errors.country && (
                <p id="country-error" className="text-sm text-red-600" role="alert">{errors.country}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                المدينة
              </label>
              <input
                id="city"
                type="text"
                value={values.city}
                onChange={(e) => updateField('city', e.target.value)}
                maxLength={30}
                placeholder={selectedCountry ? 'عمّان' : 'اختر الدولة أولاً'}
                disabled={!selectedCountry}
                autoComplete="address-level2"
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? 'city-error' : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.city && (
                <p id="city-error" className="text-sm text-red-600" role="alert">{errors.city}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                رقم الهاتف
              </label>
              <div className={cn('international-phone-input', errors.phone && 'international-phone-input-error')}>
                <span className="phone-country-code" dir="ltr">
                  {selectedCountry ? `+${getCountryCallingCode(selectedCountry)}` : '--'}
                </span>
                <PhoneNumberInput
                  id="phone"
                  country={selectedCountry}
                  value={values.phone || undefined}
                  onChange={(value) => {
                    if (!value || value.replace(/\D/g, '').length <= 15) {
                      updateField('phone', value ?? '');
                    }
                  }}
                  className="PhoneInputInput"
                  autoComplete="tel"
                  maxLength={16}
                  disabled={!selectedCountry}
                  placeholder={selectedCountry ? 'رقم الهاتف' : 'اختر الدولة أولاً'}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className="text-sm text-red-600" role="alert">{errors.phone}</p>
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
            <div
              className={cn(
                'space-y-2 sm:col-span-2',
                values.role === 'visually_impired'
                  ? 'lg:col-span-2'
                  : 'lg:col-span-3',
              )}
            >
              <p className="block text-sm font-medium text-gray-700">نوع الحساب</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

            {values.role === 'visually_impired' && (
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <label htmlFor="healthReport" className="block text-sm font-medium text-gray-700">
                  تقريرك الصحي
                </label>
                <input
                  id="healthReport"
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={(event) => updateField('healthReport', event.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
                />
                <p className="text-xs text-gray-500">
                  يرجى رفع تقرير صحي بصيغة PDF أو صورة، وبحجم أقصى 5MB.
                </p>
                {errors.healthReport && (
                  <p className="text-sm text-red-600" role="alert">{errors.healthReport}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="sm:col-span-2 lg:col-span-3 w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors min-h-[48px] flex items-center justify-center gap-2"
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
