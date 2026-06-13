import { useState } from 'react';
import type { AvailableRequest } from '../../api/workflow';
import {
  MAXIMUM_PAGE_COUNT_OPTIONS,
  MINIMUM_PAGES_BY_REQUEST_TYPE,
} from '../../constants/volunteerOpportunities.constants';
import {
  allocatePageRanges,
  getPageCountOptions,
  mergePageRanges,
} from '../../utils/pageRanges';

export function usePageRangeSelection(request: AvailableRequest) {
  const [pageCount, setPageCount] = useState('');
  const totalAvailablePages = request.totalAvailablePages;
  const minimumPages =
    MINIMUM_PAGES_BY_REQUEST_TYPE[request.requestType] ?? 1;
  const pageCountOptions = getPageCountOptions(
    totalAvailablePages,
    minimumPages,
    MAXIMUM_PAGE_COUNT_OPTIONS,
  );
  const requestedPageCount = Number(pageCount);
  const selectedPageCount = pageCountOptions.includes(requestedPageCount)
    ? requestedPageCount
    : (pageCountOptions[0] ?? 0);
  const validPageCount =
    Number.isInteger(selectedPageCount) &&
    selectedPageCount >= 1 &&
    selectedPageCount <= totalAvailablePages;

  return {
    selectedPageCount,
    pageCountOptions,
    setPageCount: (pages: number) => setPageCount(String(pages)),
    validPageCount,
    allPagesReserved: totalAvailablePages <= 0,
    pagesRemainingAfterReservation: validPageCount
      ? totalAvailablePages - selectedPageCount
      : totalAvailablePages,
    allocatedRanges: validPageCount
      ? allocatePageRanges(request.availableRanges, selectedPageCount)
      : [],
    mergedReservedRanges: mergePageRanges(request.reservedRanges),
  };
}
