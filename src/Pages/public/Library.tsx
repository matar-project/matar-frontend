import { useState } from 'react';
import { Download } from 'lucide-react';
import { libraryApi } from '../../api/library';
import { InputField } from '../../Components/ui/FormField';
import { Button } from '../../Components/ui/Button';
import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';
import { useLibraryInfiniteQuery } from '../../Hooks/library/queries/useLibraryInfiniteQuery';
import { LibraryItemTypeTag } from '../../Components/library/LibraryItemTypeTag';

export default function Library() {
  const [search, setSearch] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);
  const debouncedAuthor = useDebouncedValue(author, 500);
  const debouncedSubject = useDebouncedValue(subject, 500);

  const libraryQuery = useLibraryInfiniteQuery('library', {
    search: debouncedSearch || undefined,
    author: debouncedAuthor || undefined,
    subject: debouncedSubject || undefined,
  });
  const items = libraryQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const total = libraryQuery.data?.pages[0]?.total ?? 0;

  const clearFilters = () => {
    setSearch(''); setAuthor(''); setSubject('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">المكتبة</h1>
        <p className="text-gray-600 text-lg">
          مواد تعليمية وثقافية جاهزة للتحميل — صوتية ونصية وبرايل.
        </p>
      </header>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4" role="search" aria-label="البحث في المكتبة">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField id="search" label="البحث" placeholder="عنوان الكتاب..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <InputField id="author" label="المؤلف" placeholder="اسم المؤلف..." value={author} onChange={(e) => setAuthor(e.target.value)} />
          <InputField id="subject" label="المادة / التخصص" placeholder="رياضيات..." value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={clearFilters}>مسح</Button>
        </div>
      </div>

      {/* Results */}
      {libraryQuery.isLoading && (
        <div className="flex justify-center py-16" aria-live="polite" aria-busy="true">
          <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="sr-only">جاري التحميل...</span>
        </div>
      )}

      {libraryQuery.isError && (
        <div role="alert" className="text-center py-16 text-red-600">
          حدث خطأ في تحميل المكتبة. يرجى المحاولة مجدداً.
        </div>
      )}

      {libraryQuery.data && (
        <>
          <p className="text-sm text-gray-500" aria-live="polite">
            {total} نتيجة
          </p>

          {items.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-gray-500 text-lg">لا توجد نتائج.</p>
              <Button variant="ghost" onClick={clearFilters}>مسح الفلاتر</Button>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
              {items.map((item) => (
                <li key={item.id}>
                  <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3 h-full flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base font-bold text-gray-900 leading-snug flex-1">{item.title}</h2>
                      <LibraryItemTypeTag type={item.itemType} />
                    </div>
                    {item.author && <p className="text-sm text-gray-500">{item.author}</p>}
                    {item.subject && <p className="text-xs text-primary-600 font-medium">{item.subject}</p>}
                    {item.description && (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                    <div className="mt-auto pt-2">
                      <button
                        type="button"
                        onClick={() => void libraryApi.download(item)}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
                        aria-label={`تحميل ${item.title}`}
                      >
                        <Download size={16} aria-hidden="true" />
                        تحميل
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}

          <InfiniteScrollTrigger
            hasNextPage={Boolean(libraryQuery.hasNextPage)}
            isFetchingNextPage={libraryQuery.isFetchingNextPage}
            fetchNextPage={() => void libraryQuery.fetchNextPage()}
          />
        </>
      )}
    </div>
  );
}
