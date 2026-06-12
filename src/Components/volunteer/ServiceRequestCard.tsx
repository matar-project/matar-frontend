import { useState } from 'react';
import { BookOpen, Download, FileText, Headphones, Users } from 'lucide-react';
import { workflowApi, type AvailableRequest } from '../../api/workflow';
import { REQUEST_TYPE_LABELS } from '../../constants/volunteerOpportunities.constants';
import { usePageRangeSelection } from '../../Hooks/volunteer/usePageRangeSelection';
import { formatArabicPageRange } from '../../lib/utils';
import { ExpandableCardHeader } from '../ExpandableCardHeader';
import { Button } from '../ui/Button';

interface ServiceRequestCardProps {
  request: AvailableRequest;
  onReserve: (pageCount: number) => void;
  onClaim: () => void;
  pending: boolean;
  error?: string;
}

export function ServiceRequestCard({
  request,
  onReserve,
  onClaim,
  pending,
  error,
}: ServiceRequestCardProps) {
  const [expanded, setExpanded] = useState(false);
  const selection = usePageRangeSelection(request);
  const displayName =
    request.bookName ??
    request.title ??
    (request.requestType === 'ACCOMPANIMENT'
      ? 'طلب مرافقة'
      : 'طلب تحويل كتاب');
  const TypeIcon =
    request.requestType === 'PDF_TO_AUDIO'
      ? Headphones
      : request.requestType === 'ACCOMPANIMENT'
        ? Users
        : FileText;

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
              {REQUEST_TYPE_LABELS[request.requestType]}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <TypeIcon size={16} aria-hidden="true" />
              طلب خدمة
            </span>
            {request.requestType !== 'ACCOMPANIMENT' && (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen size={16} aria-hidden="true" />
                  {request.totalPages ?? '-'} صفحة
                </span>
                <span>
                  الصفحة التالية المتاحة: {request.nextAvailablePage ?? '-'}
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

              {request.requestType !== 'ACCOMPANIMENT' && (
                <section>
                  <h4 className="mb-2 text-sm font-semibold text-gray-900">
                    الصفحات المحجوزة
                  </h4>
                  <div className="flex min-h-10 flex-wrap gap-2 rounded-lg border border-gray-200 p-3">
                    {selection.mergedReservedRanges.length === 0 && (
                      <span className="text-sm text-gray-400">
                        لا توجد صفحات محجوزة.
                      </span>
                    )}
                    {selection.mergedReservedRanges.map((range) => (
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
              {request.requestType === 'ACCOMPANIMENT' ? (
                <Button
                  size="sm"
                  className="w-full"
                  loading={pending}
                  onClick={onClaim}
                >
                  قبول طلب المرافقة
                </Button>
              ) : selection.allPagesReserved ? (
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
                      {selection.pageCountOptions.map((pages) => (
                        <button
                          key={pages}
                          type="button"
                          onClick={() => selection.setPageCount(pages)}
                          className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                            selection.selectedPageCount === pages
                              ? 'border-primary-600 bg-primary-50 font-medium text-primary-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pages} صفحة
                        </button>
                      ))}
                    </div>
                  </div>

                  {selection.validPageCount && (
                    <div className="space-y-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
                      <div>
                        <p className="font-medium">ستعمل على الصفحات:</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selection.allocatedRanges.map((range) => (
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
                        الصفحات المتبقية بعد الحجز:{' '}
                        <strong>
                          {selection.pagesRemainingAfterReservation}
                        </strong>
                      </p>
                    </div>
                  )}

                  <Button
                    size="sm"
                    className="w-full"
                    loading={pending}
                    disabled={!selection.validPageCount}
                    onClick={() => onReserve(selection.selectedPageCount)}
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
