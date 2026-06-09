import { useQuery } from '@tanstack/react-query';
import { opportunitiesApi, type Opportunity } from '../../api/opportunities';
import { BookOpen } from 'lucide-react';

function OpportunityRow({ opp }: { opp: Opportunity }) {
  const statusLabel =
    opp.status === 'AVAILABLE' ? 'متاحة' :
    opp.status === 'IN_PROGRESS' ? 'جارية' : 'مكتملة';

  const statusColor =
    opp.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
    opp.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
    'bg-gray-100 text-gray-500';

  return (
    <li className="py-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2 rounded-lg bg-primary-50 mt-0.5 shrink-0">
          <BookOpen size={16} className="text-primary-600" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">{opp.title}</p>
          {opp.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{opp.description}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
            {opp.subject && <span>المادة: {opp.subject}</span>}
            {opp.remainingPages != null && <span>الصفحات المتبقية: {opp.remainingPages}</span>}
          </div>
        </div>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap shrink-0 ${statusColor}`}>
        {statusLabel}
      </span>
    </li>
  );
}

export default function VolunteerOpportunities() {
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: opportunitiesApi.getAll,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">الفرص المتاحة</h1>

      <div className="bg-white rounded-xl shadow-sm">
        {isLoading && (
          <p className="text-sm text-gray-400 p-5">جاري التحميل...</p>
        )}
        {!isLoading && (!opportunities || opportunities.length === 0) && (
          <p className="text-sm text-gray-400 p-5">لا توجد فرص حالياً.</p>
        )}
        {opportunities && opportunities.length > 0 && (
          <ul className="divide-y divide-gray-100 px-5" role="list">
            {opportunities.map((opp) => (
              <OpportunityRow key={opp.id} opp={opp} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
