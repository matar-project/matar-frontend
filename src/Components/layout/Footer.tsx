import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings';

export function Footer() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
    staleTime: 5 * 60_000,
  });

  return (
    <footer className="bg-primary-900 text-primary-200 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-white text-xl font-bold mb-3">مشروع مطر</h2>
            <p className="text-primary-300 text-sm leading-relaxed">
              إعطاء المكفوفين الفرصة التعليمية والثقافية المتكافئة
            </p>
          </div>

          {/* Links */}
          <nav aria-label="روابط التذييل">
            <h3 className="text-white font-semibold mb-3">روابط سريعة</h3>
            <ul className="space-y-2 text-sm" role="list">
              {[
                { to: '/about', label: 'عن مطر' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-3">تواصل معنا</h3>
            <ul className="space-y-2 text-sm" role="list">
              {settings?.whatsappLink && (
                <li>
                  <a
                    href={settings.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                    aria-label="تواصل عبر واتساب (يفتح في نافذة جديدة)"
                  >
                    واتساب
                  </a>
                </li>
              )}
              {settings?.facebookLink && (
                <li>
                  <a
                    href={settings.facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                    aria-label="تواصل عبر فيسبوك (يفتح في نافذة جديدة)"
                  >
                    فيسبوك
                  </a>
                </li>
              )}
              {settings?.messengerLink && (
                <li>
                  <a
                    href={settings.messengerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                    aria-label="تواصل عبر ماسنجر (يفتح في نافذة جديدة)"
                  >
                    ماسنجر
                  </a>
                </li>
              )}
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  نموذج التواصل
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-700 text-center text-sm text-primary-400">
          <p>© {new Date().getFullYear()} مشروع مطر. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
