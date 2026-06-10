import { useEffect, useRef } from 'react';

export function InfiniteScrollTrigger({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = triggerRef.current;
    if (!element || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '240px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div ref={triggerRef} className="py-3 text-center text-sm text-gray-500">
      {isFetchingNextPage
        ? 'جاري تحميل المزيد...'
        : hasNextPage
          ? 'مرر لعرض المزيد'
          : ''}
    </div>
  );
}
