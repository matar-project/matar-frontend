import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  HandHeart,
  HelpCircle,
} from 'lucide-react';
import logoMark from '../../assets/logo-mark.png';

interface AuthPageShellProps {
  children: ReactNode;
  mode: 'login' | 'signup';
}

export function AuthPageShell({ children, mode }: AuthPageShellProps) {
  const isSignup = mode === 'signup';

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#f7f8fc] px-4 py-6 sm:px-8 lg:px-12"
      dir="rtl"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 25%, #1A2E6E 0 2px, transparent 3px), radial-gradient(circle at 75% 70%, #00A0B8 0 2px, transparent 3px)',
          backgroundSize: '72px 72px, 96px 96px',
        }}
      />
      <div
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-secondary-100/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl"
        aria-hidden="true"
      />

      <div
        className={`relative mx-auto flex min-h-[calc(100vh-3rem)] w-full min-w-0 flex-col ${
          isSignup ? 'max-w-7xl' : 'max-w-6xl'
        }`}
      >
        <header className="flex items-center justify-between py-2 sm:py-4">
          <Link
            to="/"
            aria-label="العودة إلى الصفحة الرئيسية"
            className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <ArrowRight size={18} aria-hidden="true" />
            <span>الرئيسية</span>
          </Link>

          <Link
            to="/"
            aria-label="مشروع مطر - الصفحة الرئيسية"
            className="flex min-w-0 items-center gap-2"
          >
            <img
              src={logoMark}
              alt=""
              className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14"
            />
            <span className="hidden text-lg font-bold text-primary-700 sm:inline">
              مشروع مطر
            </span>
          </Link>
        </header>

        <section className="flex min-w-0 flex-1 items-center py-6 lg:py-10">
          <div className="w-full min-w-0">
            <div
              className={`grid w-full min-w-0 max-w-full overflow-hidden rounded-[28px] bg-white shadow-[0_25px_80px_rgba(15,26,74,0.12)] ${
                isSignup
                  ? 'lg:grid-cols-[0.72fr_1.28fr]'
                  : 'min-h-[525px] lg:grid-cols-[0.82fr_1.18fr]'
              }`}
            >
              <aside className="relative hidden overflow-hidden bg-primary-600 p-10 text-white lg:flex lg:flex-col lg:items-center lg:justify-center">
                <div
                  className="absolute inset-0 opacity-20"
                  aria-hidden="true"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 18% 20%, rgba(255,255,255,.7) 0 2px, transparent 3px), linear-gradient(135deg, transparent 35%, rgba(255,255,255,.12) 35% 37%, transparent 37% 63%, rgba(255,255,255,.08) 63% 65%, transparent 65%)',
                    backgroundSize: '62px 62px, 150px 150px',
                  }}
                />
                <Link
                  to="/"
                  aria-label="العودة إلى الصفحة الرئيسية"
                  className="absolute right-7 top-7 grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/25"
                >
                  <ArrowRight size={22} aria-hidden="true" />
                </Link>

                <div className="relative flex flex-col items-center text-center">
                  <div className="grid h-36 w-36 place-items-center rounded-[32px] bg-white shadow-2xl">
                    <img
                      src={logoMark}
                      alt=""
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                  <h2 className="mt-7 text-3xl font-bold">
                    {isSignup ? 'انضم إلى مشروع مطر' : 'مشروع مطر'}
                  </h2>
                  <p className="mt-3 max-w-xs text-sm leading-7 text-primary-100">
                    {isSignup
                      ? 'كن جزءاً من مجتمع يمنح المكفوفين فرصة تعليمية وثقافية متكافئة.'
                      : 'إعطاء المكفوفين الفرصة التعليمية والثقافية المتكافئة'}
                  </p>

                  {isSignup && (
                    <div className="mt-8 grid w-full max-w-xs gap-3 text-right text-sm">
                      <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                        <HandHeart size={20} className="text-secondary-300" />
                        <span>ساهم بوقتك ومهاراتك كمتطوع</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                        <BookOpen size={20} className="text-matar-amber" />
                        <span>اطلب المواد التعليمية بصيغة مناسبة</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex gap-2" aria-hidden="true">
                    <span className="h-1.5 w-10 rounded-full bg-secondary-400" />
                    <span className="h-1.5 w-5 rounded-full bg-matar-amber" />
                    <span className="h-1.5 w-5 rounded-full bg-matar-hotPink" />
                  </div>
                </div>
              </aside>

              {children}
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-2 text-center text-sm text-gray-500 sm:flex-row">
              <HelpCircle
                size={18}
                className="text-secondary-500"
                aria-hidden="true"
              />
              <span>
                هل تواجه مشكلة في {isSignup ? 'إنشاء الحساب' : 'تسجيل الدخول'}؟
              </span>
              <Link
                to="/contact"
                className="font-semibold text-primary-600 hover:text-primary-800 hover:underline"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-gray-200 py-5 text-center text-xs leading-6 text-gray-500">
          <p>مشروع مطر © {new Date().getFullYear()}</p>
          <Link to="/about" className="text-primary-600 hover:underline">
            عن مشروع مطر
          </Link>
        </footer>
      </div>
    </main>
  );
}
