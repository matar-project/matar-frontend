import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '../../api/library';
import { BookOpen } from 'lucide-react';

export default function VILibrary() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['vi-library-full', search, page],
    queryFn: () => libraryApi.getAll({ search: search || undefined, page, limit: 20 }),
  });

  const books = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">المكتبة الصوتية</h1>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="ابحث باسم الكتاب..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {isLoading && <p className="text-sm text-gray-400">جاري التحميل...</p>}

      {!isLoading && books.length === 0 && (
        <p className="text-sm text-gray-400 bg-white rounded-xl shadow-sm p-5">
          لم يتم العثور على كتب.
        </p>
      )}

      {books.length > 0 && (
        <ul className="space-y-3" role="list">
          {books.map((book: any) => (
            <li key={book.id} className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-100 mt-0.5 shrink-0">
                <BookOpen size={18} className="text-purple-600" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">{book.title}</p>
                {book.author && <p className="text-xs text-gray-600 mt-0.5">{book.author}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                  {book.subject && <span>{book.subject}</span>}
                  {book.curriculum && <span>{book.curriculum}</span>}
                  {book.country && <span>{book.country}</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
          >
            السابق
          </button>
          <span className="text-sm text-gray-600">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
