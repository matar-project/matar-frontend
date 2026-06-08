import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginSubmitForm } from '../Hooks/auth/UseLoginSubmitForm';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const {
    errors,
    isSubmitting,
    serverError,
    session,
    submitForm,
    updateField,
    values,
  } = useLoginSubmitForm();

  useEffect(() => {
    if (session) {
      navigate('/', { replace: true });
    }
  }, [navigate, session]);

  return (
    <main className="login-page">
      <section className="login-card">
        <header className="login-header">
          <h1>Login Portal</h1>
          <p>Sign in to your account</p>
        </header>

        {serverError && (
          <p className="login-message login-error" role="alert">
            {serverError}
          </p>
        )}

        <form className="login-form" onSubmit={submitForm} noValidate>
          <label>
            Email
            <input
              type="email"
              value={values.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <span>{errors.email}</span>}
          </label>

          <label>
            Password
            <input
              type="password"
              value={values.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <span>{errors.password}</span>}
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
