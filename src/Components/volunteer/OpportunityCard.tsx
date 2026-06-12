import { useState } from 'react';
import { BookOpen, Users } from 'lucide-react';
import type { Opportunity } from '../../api/opportunities';
import { OPPORTUNITY_STATUS_STYLES } from '../../constants/volunteerOpportunities.constants';
import { ExpandableCardHeader } from '../ExpandableCardHeader';
import { Button } from '../ui/Button';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onJoin: () => void;
  joining: boolean;
}

export function OpportunityCard({
  opportunity,
  onJoin,
  joining,
}: OpportunityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = OPPORTUNITY_STATUS_STYLES[opportunity.status];

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
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
            >
              {status.label}
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
                  {opportunity.description || 'لا توجد تفاصيل إضافية.'}
                </p>
              </section>
              {(opportunity.totalPages != null ||
                opportunity.remainingPages != null) && (
                <dl className="grid gap-3 rounded-lg border border-gray-200 p-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-gray-500">إجمالي الصفحات</dt>
                    <dd className="mt-1 font-medium">
                      {opportunity.totalPages ?? '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">الصفحات المتبقية</dt>
                    <dd className="mt-1 font-medium">
                      {opportunity.remainingPages ?? '-'}
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
