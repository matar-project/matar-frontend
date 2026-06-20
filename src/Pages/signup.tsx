import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
  getCountryCallingCode,
  type Country,
} from 'react-phone-number-input';
import PhoneNumberInput from 'react-phone-number-input/input';
import {
  BookOpen,
  Building2,
  Eye,
  EyeOff,
  HandHeart,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Upload,
  UserRound,
} from 'lucide-react';
import { AuthPageShell } from '../Components/auth/AuthPageShell';
import { useSignupSubmitForm } from '../Hooks/auth/UseSignupSubmitForm';
import { useAuth } from '../Hooks/auth/UseAuth';
import { cn } from '../lib/utils';
import { COUNTRY_OPTIONS } from '../constants/signup.constants';

const inputContainer =
  'flex min-h-14 items-center rounded-xl border bg-gray-50/80 transition focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-50';

function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    errors,
    isSubmitting,
    serverError,
    submitForm,
    updateField,
    validateField,
    values,
  } = useSignupSubmitForm();
  const selectedCountry = values.country
    ? (values.country as Country)
    : undefined;

  useEffect(() => {
    if (user) navigate('/login', { replace: true });
  }, [navigate, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const result = await submitForm(event);
    if (!result) return;

    sessionStorage.setItem('pendingVerificationEmail', result.email);
    sessionStorage.setItem('pendingSignupToken', result.signupToken);
    navigate('/verify-email', {
      replace: true,
      state: { email: result.email },
    });
  }

  const fieldClass = (hasError: boolean) =>
    cn(inputContainer, hasError ? 'border-red-400' : 'border-gray-200');

  return (
    <AuthPageShell mode="signup">
      <div className="min-w-0 px-5 py-9 sm:px-10 lg:px-12 xl:px-16">
        <div className="mx-auto w-full min-w-0 max-w-4xl">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold text-secondary-600">
              ابدأ رحلتك معنا
            </p>
            <h1 className="text-2xl font-bold text-primary-900 sm:text-4xl">
              إنشاء حساب جديد
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              أدخل بياناتك واختر نوع الحساب المناسب لك.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2"
            noValidate
            aria-label="نموذج إنشاء حساب"
          >
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                الاسم الكامل
              </label>
              <div className={fieldClass(Boolean(errors.name))}>
                <span className="grid h-7 w-14 place-items-center border-l border-gray-200 text-gray-400">
                  <UserRound size={20} aria-hidden="true" />
                </span>
                <input
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={(event) =>
                    updateField('name', event.target.value)
                  }
                  placeholder="محمد أحمد"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
              {errors.name && (
                <p id="name-error" className="text-sm text-red-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                البريد الإلكتروني
              </label>
              <div className={fieldClass(Boolean(errors.email))}>
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
                  onBlur={() => validateField('email')}
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
              <label
                htmlFor="country"
                className="block text-sm font-semibold text-gray-700"
              >
                الدولة
              </label>
              <div className="relative">
                <MapPin
                  size={20}
                  className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <Select
                  inputId="country"
                  isRtl
                  isSearchable
                  options={COUNTRY_OPTIONS}
                  value={
                    COUNTRY_OPTIONS.find(
                      (option) => option.value === values.country,
                    ) ?? null
                  }
                  onChange={(option) => {
                    updateField('country', option?.value ?? '');
                    updateField('city', '');
                    updateField('phone', '');
                  }}
                  placeholder="ابحث عن الدولة..."
                  noOptionsMessage={() => 'لا توجد دولة مطابقة'}
                  classNamePrefix="searchable-country"
                  className={cn(
                    'signup-country-select',
                    errors.country && 'searchable-country-error',
                  )}
                  aria-invalid={Boolean(errors.country)}
                  aria-describedby={
                    errors.country ? 'country-error' : undefined
                  }
                />
              </div>
              {errors.country && (
                <p
                  id="country-error"
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {errors.country}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="city"
                className="block text-sm font-semibold text-gray-700"
              >
                المدينة
              </label>
              <div className={fieldClass(Boolean(errors.city))}>
                <span className="grid h-7 w-14 place-items-center border-l border-gray-200 text-gray-400">
                  <Building2 size={20} aria-hidden="true" />
                </span>
                <input
                  id="city"
                  type="text"
                  value={values.city}
                  onChange={(event) =>
                    updateField('city', event.target.value)
                  }
                  maxLength={30}
                  placeholder={selectedCountry ? 'عمّان' : 'اختر الدولة أولاً'}
                  disabled={!selectedCountry}
                  autoComplete="address-level2"
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              {errors.city && (
                <p id="city-error" className="text-sm text-red-600" role="alert">
                  {errors.city}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700"
              >
                رقم الهاتف
              </label>
              <div
                className={cn(fieldClass(Boolean(errors.phone)), 'px-3')}
                dir="ltr"
              >
                <Phone
                  size={20}
                  className="mx-2 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <span className="border-r border-gray-200 px-3 text-sm text-gray-500">
                  {selectedCountry
                    ? `+${getCountryCallingCode(selectedCountry)}`
                    : '--'}
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
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-left text-gray-900 outline-none placeholder:text-gray-400"
                  autoComplete="tel"
                  maxLength={16}
                  disabled={!selectedCountry}
                  placeholder={
                    selectedCountry ? 'رقم الهاتف' : 'اختر الدولة أولاً'
                  }
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
              </div>
              {errors.phone && (
                <p
                  id="phone-error"
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                كلمة المرور
              </label>
              <div className={fieldClass(Boolean(errors.password))}>
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
                  placeholder="أدخل كلمة المرور"
                  autoComplete="new-password"
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

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700"
              >
                تأكيد كلمة المرور
              </label>
              <div className={fieldClass(Boolean(errors.confirmPassword))}>
                <span className="grid h-7 w-14 place-items-center border-l border-gray-200 text-gray-400">
                  <LockKeyhole size={20} aria-hidden="true" />
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={values.confirmPassword}
                  onChange={(event) =>
                    updateField('confirmPassword', event.target.value)
                  }
                  placeholder="أعد إدخال كلمة المرور"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={
                    errors.confirmPassword ? 'confirmPassword-error' : undefined
                  }
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'إخفاء كلمة المرور'
                      : 'إظهار كلمة المرور'
                  }
                  className="grid h-12 w-12 place-items-center text-gray-400 transition hover:text-primary-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} aria-hidden="true" />
                  ) : (
                    <Eye size={20} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <fieldset className="space-y-3 md:col-span-2">
              <legend className="text-sm font-semibold text-gray-700">
                نوع الحساب
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <RoleOption
                  selected={values.role === 'volunteer'}
                  name="volunteer"
                  title="متطوع"
                  description="أساهم في تحويل الكتب والمواد"
                  icon={<HandHeart size={24} aria-hidden="true" />}
                  onSelect={() => updateField('role', 'volunteer')}
                />
                <RoleOption
                  selected={values.role === 'visually_impired'}
                  name="visually_impired"
                  title="مستفيد"
                  description="أحتاج مواد تعليمية بصيغة مناسبة"
                  icon={<BookOpen size={24} aria-hidden="true" />}
                  secondary
                  onSelect={() => updateField('role', 'visually_impired')}
                />
              </div>
              {errors.role && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.role}
                </p>
              )}
            </fieldset>

            {values.role === 'visually_impired' && (
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="healthReport"
                  className="block text-sm font-semibold text-gray-700"
                >
                  التقرير الصحي
                </label>
                <label
                  htmlFor="healthReport"
                  className={cn(
                    'flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed p-4 transition hover:bg-secondary-50/50',
                    errors.healthReport
                      ? 'border-red-400 bg-red-50'
                      : 'border-secondary-300 bg-secondary-50/30',
                  )}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary-100 text-secondary-700">
                    <Upload size={23} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-gray-800">
                      {values.healthReport?.name ?? 'اختر التقرير الصحي'}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500">
                      PDF أو JPG أو PNG، بحد أقصى 5MB
                    </span>
                  </span>
                  <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-secondary-700 shadow-sm">
                    اختيار ملف
                  </span>
                </label>
                <input
                  id="healthReport"
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={(event) =>
                    updateField(
                      'healthReport',
                      event.target.files?.[0] ?? null,
                    )
                  }
                  className="sr-only"
                />
                {errors.healthReport && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.healthReport}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 md:col-span-2"
            >
              {isSubmitting && (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden="true"
                />
              )}
              {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            لديك حساب بالفعل؟{' '}
            <Link
              to="/login"
              className="font-semibold text-secondary-600 hover:underline"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </AuthPageShell>
  );
}

interface RoleOptionProps {
  selected: boolean;
  name: 'volunteer' | 'visually_impired';
  title: string;
  description: string;
  icon: React.ReactNode;
  secondary?: boolean;
  onSelect: () => void;
}

function RoleOption({
  selected,
  name,
  title,
  description,
  icon,
  secondary = false,
  onSelect,
}: RoleOptionProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition',
        selected
          ? secondary
            ? 'border-secondary-500 bg-secondary-50 shadow-sm'
            : 'border-primary-500 bg-primary-50 shadow-sm'
          : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50',
      )}
    >
      <input
        type="radio"
        name="role"
        value={name}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        className={cn(
          'grid h-12 w-12 shrink-0 place-items-center rounded-xl',
          secondary
            ? 'bg-secondary-100 text-secondary-700'
            : 'bg-primary-100 text-primary-700',
        )}
      >
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-gray-900">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-gray-500">
          {description}
        </span>
      </span>
    </label>
  );
}

export default Signup;
