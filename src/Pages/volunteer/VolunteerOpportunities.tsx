import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  BookOpen,
  Download,
  FileText,
  Headphones,
  Users,
} from "lucide-react";
import { opportunitiesApi, type Opportunity } from "../../api/opportunities";
import { workflowApi, type AvailableRequest } from "../../api/workflow";
import { Button } from "../../Components/ui/Button";
import { InfiniteScrollTrigger } from "../../Components/InfiniteScrollTrigger";
import { ExpandableCardHeader } from "../../Components/ExpandableCardHeader";
import { useDebouncedValue } from "../../Hooks/useDebouncedValue";
import { formatArabicPageRange } from "../../lib/utils";

const requestTypeLabels = {
  PDF_TO_WORD: "PDF إلى Word",
  PDF_TO_AUDIO: "PDF إلى تسجيل صوتي",
  ACCOMPANIMENT: "طلب مرافقة",
};

// Minimum pages per request type
const MIN_PAGES: Record<string, number> = {
  PDF_TO_WORD: 3,
  PDF_TO_AUDIO: 10,
};

function mergePageRanges(
  ranges: Array<{ startPage: number; endPage: number }>,
) {
  return [...ranges]
    .sort((first, second) => first.startPage - second.startPage)
    .reduce<Array<{ startPage: number; endPage: number }>>(
      (merged, current) => {
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
      },
      [],
    );
}

function allocatePageRanges(
  ranges: Array<{ startPage: number; endPage: number }>,
  pageCount: number,
) {
  const allocation: Array<{ startPage: number; endPage: number }> = [];
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

function OpportunityRow({
  opportunity,
  onJoin,
  joining,
}: {
  opportunity: Opportunity;
  onJoin: () => void;
  joining: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusLabel =
    opportunity.status === "AVAILABLE"
      ? "متاحة"
      : opportunity.status === "IN_PROGRESS"
        ? "جارية"
        : "مكتملة";
  const statusColor =
    opportunity.status === "AVAILABLE"
      ? "bg-green-100 text-green-700"
      : opportunity.status === "IN_PROGRESS"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-600";

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <ExpandableCardHeader
        expanded={expanded}
        onToggle={() => setExpanded((current) => !current)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-gray-900">{opportunity.title}</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
            >
              {statusLabel}
            </span>
            {opportunity.subject && (
              <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                {opportunity.subject}
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <Users size={16} aria-hidden="true" />
              فرصة تطوع
            </span>
            {opportunity.remainingPages != null && (
              <span className="inline-flex items-center gap-1.5">
                <BookOpen size={16} aria-hidden="true" />
                {opportunity.remainingPages} صفحة متبقية
              </span>
            )}
          </div>
        </div>
      </ExpandableCardHeader>

      {expanded && (
        <div className="border-t border-gray-100 p-5">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="space-y-4">
              <section>
                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                  تفاصيل الفرصة
                </h4>
                <p className="rounded-lg bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                  {opportunity.description || "لا توجد تفاصيل إضافية."}
                </p>
              </section>
              {(opportunity.totalPages != null ||
                opportunity.remainingPages != null) && (
                <dl className="grid gap-3 rounded-lg border border-gray-200 p-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-gray-500">إجمالي الصفحات</dt>
                    <dd className="mt-1 font-medium">
                      {opportunity.totalPages ?? "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">الصفحات المتبقية</dt>
                    <dd className="mt-1 font-medium">
                      {opportunity.remainingPages ?? "-"}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
            <aside>
              <Button
                size="sm"
                className="w-full"
                onClick={onJoin}
                loading={joining}
              >
                انضمام إلى الفرصة
              </Button>
            </aside>
          </div>
        </div>
      )}
    </article>
  );
}

function ServiceRequestRow({
  request,
  onReserve,
  onClaim,
  pending,
  error,
}: {
  request: AvailableRequest;
  onReserve: (pageCount: number) => void;
  onClaim: () => void;
  pending: boolean;
  error?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [pageCount, setPageCount] = useState("");

  const remaining = request.totalAvailablePages;
  const allPagesReserved = remaining <= 0;
  const minPages = MIN_PAGES[request.requestType] ?? 3;

  const pageCountOptions: number[] = [];
  const maximumListedPageCount = Math.min(remaining, minPages * 8);
  for (
    let pages = minPages;
    pages <= maximumListedPageCount;
    pages += minPages
  ) {
    pageCountOptions.push(pages);
  }
  if (remaining > 0 && !pageCountOptions.includes(remaining)) {
    pageCountOptions.push(remaining);
  }

  const requestedPageCount = Number(pageCount);
  const selectedPageCount = pageCountOptions.includes(requestedPageCount)
    ? requestedPageCount
    : (pageCountOptions[0] ?? 0);
  const validPageCount =
    Number.isInteger(selectedPageCount) &&
    selectedPageCount >= 1 &&
    selectedPageCount <= remaining;
  const pagesRemainingAfterReservation = validPageCount
    ? remaining - selectedPageCount
    : remaining;
  const allocatedRanges = validPageCount
    ? allocatePageRanges(request.availableRanges, selectedPageCount)
    : [];

  const displayName =
    request.bookName ??
    request.title ??
    (request.requestType === "ACCOMPANIMENT" ? "طلب مرافقة" : "طلب تحويل كتاب");
  const TypeIcon =
    request.requestType === "PDF_TO_AUDIO"
      ? Headphones
      : request.requestType === "ACCOMPANIMENT"
        ? Users
        : FileText;
  const mergedReservedRanges = mergePageRanges(request.reservedRanges);

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <ExpandableCardHeader
        expanded={expanded}
        onToggle={() => setExpanded((current) => !current)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-gray-900">{displayName}</h3>
            <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700">
              {requestTypeLabels[request.requestType]}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <TypeIcon size={16} aria-hidden="true" />
              طلب خدمة
            </span>
            {request.requestType !== "ACCOMPANIMENT" && (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen size={16} aria-hidden="true" />
                  {request.totalPages ?? "-"} صفحة
                </span>
                <span>
                  الصفحة التالية المتاحة: {request.nextAvailablePage ?? "-"}
                </span>
              </>
            )}
          </div>
        </div>
      </ExpandableCardHeader>

      {expanded && (
        <div className="border-t border-gray-100 p-5">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-4">
              <section>
                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                  تفاصيل الطلب
                </h4>
                <p className="rounded-lg bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                  {request.details}
                </p>
              </section>

              {request.requestType !== "ACCOMPANIMENT" && (
                <section>
                  <h4 className="mb-2 text-sm font-semibold text-gray-900">
                    الصفحات المحجوزة
                  </h4>
                  <div className="flex min-h-10 flex-wrap gap-2 rounded-lg border border-gray-200 p-3">
                    {mergedReservedRanges.length === 0 && (
                      <span className="text-sm text-gray-400">
                        لا توجد صفحات محجوزة.
                      </span>
                    )}
                    {mergedReservedRanges.map((range) => (
                      <span
                        key={`${range.startPage}-${range.endPage}`}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                      >
                        {formatArabicPageRange(
                          range.startPage,
                          range.endPage,
                        )}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-3">
              {request.requestType === "ACCOMPANIMENT" ? (
                <Button
                  size="sm"
                  className="w-full"
                  loading={pending}
                  onClick={onClaim}
                >
                  قبول طلب المرافقة
                </Button>
              ) : allPagesReserved ? (
                <p className="text-xs text-gray-500">
                  تم حجز جميع صفحات هذا الطلب.
                </p>
              ) : (
                <>
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      اختر حجم المهمة
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pageCountOptions.map((pages) => (
                        <button
                          key={pages}
                          type="button"
                          onClick={() => setPageCount(String(pages))}
                          className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                            selectedPageCount === pages
                              ? "border-primary-600 bg-primary-50 font-medium text-primary-700"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pages} صفحة
                        </button>
                      ))}
                    </div>
                  </div>

                  {validPageCount && (
                    <div className="space-y-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
                      <div>
                        <p className="font-medium">ستعمل على الصفحات:</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {allocatedRanges.map((range) => (
                            <span
                              key={`${range.startPage}-${range.endPage}`}
                              className="rounded-full bg-white px-3 py-1"
                            >
                              {formatArabicPageRange(
                                range.startPage,
                                range.endPage,
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p>
                        الصفحات المتبقية بعد الحجز:{" "}
                        <strong>{pagesRemainingAfterReservation}</strong>
                      </p>
                    </div>
                  )}

                  <Button
                    size="sm"
                    className="w-full"
                    loading={pending}
                    disabled={!validPageCount}
                    onClick={() => onReserve(selectedPageCount)}
                  >
                    حجز الصفحات
                  </Button>

                  {request.pdfOriginalName && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="w-full bg-white"
                      onClick={() =>
                        void workflowApi.downloadRequestPdf(
                          request.id,
                          request.pdfOriginalName!,
                        )
                      }
                    >
                      <Download size={15} aria-hidden="true" />
                      تنزيل ملف PDF
                    </Button>
                  )}
                </>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </aside>
          </div>
        </div>
      )}
    </article>
  );
}

export default function VolunteerOpportunities() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [requestErrors, setRequestErrors] = useState<Record<number, string>>(
    {},
  );

  const opportunitiesQuery = useInfiniteQuery({
    queryKey: ["volunteer-opportunities", debouncedSearch],
    queryFn: ({ pageParam }) =>
      opportunitiesApi.getAvailableForVolunteer({
        page: pageParam,
        limit: 10,
        search: debouncedSearch || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
  const requestsQuery = useInfiniteQuery({
    queryKey: ["volunteer-available-requests", debouncedSearch],
    queryFn: ({ pageParam }) =>
      workflowApi.getAvailableRequests({
        page: pageParam,
        limit: 10,
        search: debouncedSearch || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
  const opportunities =
    opportunitiesQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const requests =
    requestsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  const joinMutation = useMutation({
    mutationFn: opportunitiesApi.join,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["volunteer-opportunities"] }),
  });

  const reserve = useMutation({
    mutationFn: ({
      requestId,
      pageCount,
    }: {
      requestId: number;
      pageCount: number;
    }) => workflowApi.reservePages(requestId, pageCount),
    onSuccess: (_, variables) => {
      setRequestErrors((current) => ({
        ...current,
        [variables.requestId]: "",
      }));
      void queryClient.invalidateQueries({
        queryKey: ["volunteer-available-requests"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["volunteer-my-reservations"],
      });
    },
    onError: (_, variables) => {
      setRequestErrors((current) => ({
        ...current,
        [variables.requestId]:
          "تعذر حجز الصفحات. ربما حجز متطوع آخر هذا النطاق للتو.",
      }));
      void queryClient.invalidateQueries({
        queryKey: ["volunteer-available-requests"],
      });
    },
  });

  const claimAccompaniment = useMutation({
    mutationFn: workflowApi.claimAccompaniment,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["volunteer-available-requests"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["volunteer-accompaniment-requests"],
      });
    },
    onError: (_, requestId) => {
      setRequestErrors((current) => ({
        ...current,
        [requestId]: "تعذر قبول الطلب. ربما قبله متطوع آخر.",
      }));
      void queryClient.invalidateQueries({
        queryKey: ["volunteer-available-requests"],
      });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الفرص المتاحة</h1>
        <p className="mt-1 text-sm text-gray-500">
          اضغط على أي فرصة أو طلب لعرض التفاصيل والانضمام.
        </p>
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="ابحث في جميع الحقول..."
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">فرص المرافقة</h2>
        {opportunitiesQuery.isLoading && <p className="text-sm text-gray-500">جاري التحميل...</p>}
        {!opportunitiesQuery.isLoading && opportunities.length === 0 && (
          <p className="rounded-xl bg-white p-5 text-sm text-gray-400 shadow-sm">
            لا توجد فرص مرافقة حالياً.
          </p>
        )}
        {opportunities.map((opportunity) => (
          <OpportunityRow
            key={opportunity.id}
            opportunity={opportunity}
            onJoin={() => joinMutation.mutate(opportunity.id)}
            joining={
              joinMutation.isPending &&
              joinMutation.variables === opportunity.id
            }
          />
        ))}
        <InfiniteScrollTrigger
          hasNextPage={Boolean(opportunitiesQuery.hasNextPage)}
          isFetchingNextPage={opportunitiesQuery.isFetchingNextPage}
          fetchNextPage={() => void opportunitiesQuery.fetchNextPage()}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">
          طلبات الخدمة المتاحة
        </h2>
        {requestsQuery.isLoading && (
          <p className="text-sm text-gray-500">جاري التحميل...</p>
        )}
        {!requestsQuery.isLoading && requests.length === 0 && (
          <p className="rounded-xl bg-white p-5 text-sm text-gray-400 shadow-sm">
            لا توجد طلبات خدمة متاحة حالياً.
          </p>
        )}
        {requests.map((request) => (
          <ServiceRequestRow
            key={request.id}
            request={request}
            onReserve={(pageCount) =>
              reserve.mutate({ requestId: request.id, pageCount })
            }
            onClaim={() => claimAccompaniment.mutate(request.id)}
            pending={
              (reserve.isPending &&
                reserve.variables?.requestId === request.id) ||
              (claimAccompaniment.isPending &&
                claimAccompaniment.variables === request.id)
            }
            error={requestErrors[request.id]}
          />
        ))}
        <InfiniteScrollTrigger
          hasNextPage={Boolean(requestsQuery.hasNextPage)}
          isFetchingNextPage={requestsQuery.isFetchingNextPage}
          fetchNextPage={() => void requestsQuery.fetchNextPage()}
        />
      </section>
    </div>
  );
}
