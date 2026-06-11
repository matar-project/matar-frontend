import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { BookOpen, FileText, Headphones, File, Download } from 'lucide-react';
import { libraryApi, type LibraryItem } from '../../api/library';
import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';

const typeIcon: Record<LibraryItem['itemType'], React.ElementType> = {
  AUDIO: Headphones,
  WORD_DOC: FileText,
  PDF: FileText,
  BRAILLE: BookOpen,
  OTHER: File,
};

const typeLabel: Record<LibraryItem['itemType'], string> = {
  AUDIO: 'تسجيل صوتي',
  WORD_DOC: 'ملف Word',
  PDF: 'PDF',
  BRAILLE: 'برايل',
  OTHER: 'أخرى',
};

const typeColor: Record<LibraryItem['itemType'], string> = {
  AUDIO: 'bg-teal-100 text-teal-600',
  WORD_DOC: 'bg-blue-100 text-blue-600',
  PDF: 'bg-red-100 text-red-600',
  BRAILLE: 'bg-purple-100 text-purple-600',
  OTHER: 'bg-gray-100 text-gray-600',
};

export default function VILibrary() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);

  const booksQuery = useInfiniteQuery({
    queryKey: ['vi-library-items', debouncedSearch],
    queryFn: ({ pageParam }) =>
      libraryApi.getAll({
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
          placeholder="ابحث باسم الكتاب أو المؤلف..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {booksQuery.isLoading && (
        <p className="text-sm text-gray-500">جاري التحميل...</p>
      )}

      {!booksQuery.isLoading && books.length === 0 && (
        <p className="rounded-xl bg-white p-5 text-sm text-gray-500 shadow-sm">
          لا توجد كتب متاحة حتى الآن.
        </p>
      )}

      {books.length > 0 && (
        <ul className="space-y-3" role="list">
          {books.map((book) => {
            const Icon = typeIcon[book.itemType] ?? File;
            return (
              <li
                key={book.id}
                className="rounded-xl bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 shrink-0 rounded-lg p-2 ${typeColor[book.itemType] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {typeLabel[book.itemType]}
                    </p>
                  </div>
                </div>

                {(book.author || book.subject || book.description) && (
                  <dl className="space-y-1 text-sm text-gray-600">
                    {book.author && (
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-gray-400">المؤلف:</dt>
                        <dd>{book.author}</dd>
                      </div>
                    )}
                    {book.subject && (
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-gray-400">الموضوع:</dt>
                        <dd>{book.subject}</dd>
                      </div>
                    )}
                    {book.description && (
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-gray-400">الوصف:</dt>
                        <dd className="line-clamp-2">{book.description}</dd>
                      </div>
                    )}
                  </dl>
                )}

                <a
                  href={book.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={book.fileName}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100 transition-colors"
                >
                  <Download size={13} aria-hidden="true" />
                  تنزيل الملف
                </a>
              </li>
            );
          })}
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
