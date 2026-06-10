import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { BookOpen, FileText, Headphones } from 'lucide-react';
import { libraryApi } from '../../api/library';
import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';

export default function VILibrary() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);

  const booksQuery = useInfiniteQuery({
    queryKey: ['system-library-books', debouncedSearch],
    queryFn: ({ pageParam }) =>
      libraryApi.getSystemBooks({
        search: debouncedSearch || undefined,
        page: pageParam,
        limit: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  const books = booksQuery.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المكتبة الصوتية</h1>
        <p className="mt-1 text-sm text-gray-500">
          الكتب التي اكتمل تحويلها إلى Word أو تسجيل صوتي واعتمدها المنسق.
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <label htmlFor="library-search" className="sr-only">
          ابحث باسم الكتاب
        </label>
        <input
          id="library-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ابحث باسم الكتاب..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {booksQuery.isLoading && <p className="text-sm text-gray-500">جاري التحميل...</p>}

      {!booksQuery.isLoading && books.length === 0 && (
        <p className="rounded-xl bg-white p-5 text-sm text-gray-500 shadow-sm">
          لا توجد كتب مكتملة حتى الآن.
        </p>
      )}

      {books.length > 0 && (
        <ul className="grid gap-3 md:grid-cols-2" role="list">
          {books.map((book) => (
            <li
              key={book.id}
              className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="mt-0.5 shrink-0 rounded-lg bg-purple-100 p-2">
                <BookOpen
                  size={18}
                  className="text-purple-600"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">{book.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {book.wordCompleted && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      <FileText size={14} aria-hidden="true" />
                      Word مكتمل
                    </span>
                  )}
                  {book.audioCompleted && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                      <Headphones size={14} aria-hidden="true" />
                      صوتي مكتمل
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <InfiniteScrollTrigger
        hasNextPage={Boolean(booksQuery.hasNextPage)}
        isFetchingNextPage={booksQuery.isFetchingNextPage}
        fetchNextPage={() => void booksQuery.fetchNextPage()}
      />
    </div>
  );
}
