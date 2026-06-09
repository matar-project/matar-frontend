import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings';

export default function Contact() {
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: settingsApi.get });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">تواصل معنا</h1>
        <p className="text-lg text-gray-600">نسعد بسماعك ومساعدتك</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact channels */}
        <section aria-label="قنوات التواصل" className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">قنوات التواصل</h2>
          <ul className="space-y-4" role="list">
            {settings?.whatsappLink && (
              <li>
                <a
                  href={settings.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  aria-label="تواصل معنا عبر واتساب (يفتح في نافذة جديدة)"
                >
                  <span className="text-2xl" aria-hidden="true">💬</span>
                  <div>
                    <div className="font-medium text-gray-900">واتساب</div>
                    <div className="text-sm text-gray-500">تواصل معنا مباشرة</div>
                  </div>
                </a>
              </li>
            )}
            {settings?.facebookLink && (
              <li>
                <a
                  href={settings.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="زيارة صفحتنا على فيسبوك (يفتح في نافذة جديدة)"
                >
                  <span className="text-2xl" aria-hidden="true">👥</span>
                  <div>
                    <div className="font-medium text-gray-900">فيسبوك</div>
                    <div className="text-sm text-gray-500">صفحتنا على فيسبوك</div>
                  </div>
                </a>
              </li>
            )}
            {settings?.messengerLink && (
              <li>
                <a
                  href={settings.messengerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  aria-label="تواصل معنا عبر ماسنجر (يفتح في نافذة جديدة)"
                >
                  <span className="text-2xl" aria-hidden="true">✉️</span>
                  <div>
                    <div className="font-medium text-gray-900">ماسنجر</div>
                    <div className="text-sm text-gray-500">راسلنا عبر ماسنجر</div>
                  </div>
                </a>
              </li>
            )}
            {!settings?.whatsappLink && !settings?.facebookLink && !settings?.messengerLink && (
              <li className="text-gray-500 text-sm p-4 bg-gray-50 rounded-xl">
                ستظهر قنوات التواصل هنا بمجرد إضافتها من قِبل الإدارة.
              </li>
            )}
          </ul>
        </section>

        {/* Quick actions */}
        <section aria-label="روابط سريعة" className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">هل تبحث عن؟</h2>
          <div className="space-y-3">
            {[
              { to: '/request-help', label: 'طلب مساعدة', desc: 'اطلب كتاباً أو دعماً تعليمياً' },
              { to: '/book-request', label: 'طلب كتاب بعينه', desc: 'أطلب تحويل كتاب محدد' },
              { to: '/volunteer', label: 'التطوع', desc: 'انضم كمتطوع في مطر' },
              { to: '/library', label: 'المكتبة', desc: 'تصفح المواد المتاحة' },
            ].map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="block p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
