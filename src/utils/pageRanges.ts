export interface PageRange {
  startPage: number;
  endPage: number;
}

export function mergePageRanges(ranges: PageRange[]) {
  return [...ranges]
    .sort((first, second) => first.startPage - second.startPage)
    .reduce<PageRange[]>((merged, current) => {
      const previous = merged.at(-1);
      if (!previous || current.startPage > previous.endPage + 1) {
        merged.push({
          startPage: current.startPage,
          endPage: current.endPage,
        });
      } else {
        previous.endPage = Math.max(previous.endPage, current.endPage);
      }
      return merged;
    }, []);
}

export function allocatePageRanges(ranges: PageRange[], pageCount: number) {
  const allocation: PageRange[] = [];
  let pagesNeeded = pageCount;

  for (const range of ranges) {
    const rangePageCount = range.endPage - range.startPage + 1;
    const allocatedPageCount = Math.min(rangePageCount, pagesNeeded);
    allocation.push({
      startPage: range.startPage,
      endPage: range.startPage + allocatedPageCount - 1,
    });
    pagesNeeded -= allocatedPageCount;
    if (pagesNeeded === 0) return allocation;
  }

  return [];
}

export function getPageCountOptions(
  totalAvailablePages: number,
  minimumPages: number,
  maximumOptions: number,
) {
  const options: number[] = [];
  const maximumListedPageCount = Math.min(
    totalAvailablePages,
    minimumPages * maximumOptions,
  );

  for (
    let pages = minimumPages;
    pages <= maximumListedPageCount;
    pages += minimumPages
  ) {
    options.push(pages);
  }

  if (
    totalAvailablePages > 0 &&
    !options.includes(totalAvailablePages)
  ) {
    options.push(totalAvailablePages);
  }

  return options;
}
