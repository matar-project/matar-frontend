import { usePublicSettingsQuery } from '../../Hooks/public/queries/usePublicSettingsQuery';

export default function Contact() {
  const { data: settings } = usePublicSettingsQuery();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">تواصل معنا</h1>
        <p className="text-lg text-gray-600">نسعد بسماعك ومساعدتك</p>
      </header>

      <div>
        <section aria-label="قنوات التواصل" className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">قنوات التواصل</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
            <li>
              <a
                href="https://web.facebook.com/matarproject"
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
            <li>
              <a
                href="https://www.instagram.com/matar_project?igsh=Zm5sb3ZmYmNvNTAy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-pink-50 border border-pink-200 rounded-xl hover:bg-pink-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                aria-label="زيارة صفحتنا على إنستغرام (يفتح في نافذة جديدة)"
              >
                <span className="text-2xl" aria-hidden="true">📸</span>
                <div>
                  <div className="font-medium text-gray-900">إنستغرام</div>
                  <div className="text-sm text-gray-500">تابعونا على إنستغرام</div>
                </div>
              </a>
            </li>
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
          </ul>
        </section>

      </div>
    </div>
  );
}
