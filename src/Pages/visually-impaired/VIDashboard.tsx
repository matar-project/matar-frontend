import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Hooks/auth/UseAuth';
import { libraryApi } from '../../api/library';
import { Library, FileText, BookOpen, Phone } from 'lucide-react';

export default function VIDashboard() {
  const { user } = useAuth();
  const { data: library } = useQuery({
    queryKey: ['vi-library'],
    queryFn: () => libraryApi.getAll({ limit: 5 }),
  });

  const recentBooks = library?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h1 className="text-xl font-bold text-gray-900">
          أهلاً، {user?.name} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          مرحباً بك في بوابة مشروع مطر. يمكنك تصفح المكتبة أو تقديم طلب مساعدة.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/book-request"
          className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <div className="p-3 rounded-xl bg-teal-500">
            <BookOpen size={22} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">طلب كتاب مسموع</p>
            <p className="text-xs text-gray-500 mt-0.5">اطلب تحويل كتاب إلى صيغة صوتية</p>
          </div>
        </Link>

        <Link
          to="/request-help"
          className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <div className="p-3 rounded-xl bg-primary-500">
            <FileText size={22} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">طلب مساعدة</p>
            <p className="text-xs text-gray-500 mt-0.5">تقديم طلب خدمة أو دعم</p>
          </div>
        </Link>

        <Link
          to="/vi/library"
          className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <div className="p-3 rounded-xl bg-purple-500">
            <Library size={22} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">تصفح المكتبة</p>
            <p className="text-xs text-gray-500 mt-0.5">اطلع على الكتب المتاحة</p>
          </div>
        </Link>

        <Link
          to="/contact"
          className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <div className="p-3 rounded-xl bg-amber-500">
            <Phone size={22} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">تواصل معنا</p>
            <p className="text-xs text-gray-500 mt-0.5">للاستفسارات والدعم</p>
          </div>
        </Link>
      </div>

      {recentBooks.length > 0 && (
        <section aria-label="أحدث الكتب في المكتبة">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">أحدث الكتب المتاحة</h2>
          <ul className="space-y-3">
            {recentBooks.map((book: any) => (
              <li key={book.id} className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-100 mt-0.5">
                  <BookOpen size={16} className="text-purple-600" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                  {book.author && (
                    <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                  )}
                  {book.subject && (
                    <p className="text-xs text-gray-400">{book.subject}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
