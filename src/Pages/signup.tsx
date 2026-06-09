import { Link } from 'react-router-dom';
import { useSignupSubmitForm } from '../Hooks/auth/UseSignupSubmitForm';
import type { SignupRole } from '../Types/auth.types';

function Signup() {
  const {
    errors,
    isSubmitting,
    serverError,
    submitForm,
    updateField,
    values,
  } = useSignupSubmitForm();

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
        <header className="mb-7 text-center">
          <h1 className="mb-2 text-3xl font-semibold text-slate-900">
            Create Account
          </h1>
          <p className="text-slate-500">Sign up to get started</p>
        </header>

        {serverError && (
          <p
            className="mb-5 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
            role="alert"
          >
            {serverError}
          </p>
        )}

        <form className="grid gap-5" onSubmit={submitForm} noValidate>
          <label className="grid gap-2 text-left text-sm font-semibold text-slate-700">
            Name
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 aria-invalid:border-red-600"
              type="text"
              value={values.name}
              onChange={(event) => updateField('name', event.target.value)}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <span className="text-xs font-normal text-red-600">
                {errors.name}
              </span>
            )}
          </label>

          <label className="grid gap-2 text-left text-sm font-semibold text-slate-700">
            Email
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 aria-invalid:border-red-600"
              type="email"
              value={values.email}
              onChange={(event) => updateField('email', event.target.value)}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <span className="text-xs font-normal text-red-600">
                {errors.email}
              </span>
            )}
          </label>

          <label className="grid gap-2 text-left text-sm font-semibold text-slate-700">
            Password
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 aria-invalid:border-red-600"
              type="password"
              value={values.password}
              onChange={(event) => updateField('password', event.target.value)}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <span className="text-xs font-normal text-red-600">
                {errors.password}
              </span>
            )}
          </label>

          <label className="grid gap-2 text-left text-sm font-semibold text-slate-700">
            Account type
            <select
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 aria-invalid:border-red-600"
              value={values.role}
              onChange={(event) =>
                updateField('role', event.target.value as SignupRole)
              }
              aria-invalid={Boolean(errors.role)}
            >
              <option value="volunteer">Volunteer</option>
              <option value="visually_impired">Visually impaired</option>
            </select>
            {errors.role && (
              <span className="text-xs font-normal text-red-600">
                {errors.role}
              </span>
            )}
          </label>

          <button
            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            className="font-semibold text-blue-600 hover:underline"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Signup;
