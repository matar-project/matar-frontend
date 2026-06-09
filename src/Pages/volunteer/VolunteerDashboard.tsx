import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Hooks/auth/UseAuth';
import { opportunitiesApi, type Opportunity } from '../../api/opportunities';
import { BookOpen, Clock, CheckCircle, Library } from 'lucide-react';

function OpportunityCard({ opp }: { opp: Opportunity }) {
  const statusLabel =
    opp.status === 'AVAILABLE' ? 'متاحة' :
    opp.status === 'IN_PROGRESS' ? 'جارية' : 'مكتملة';

  const statusColor =
    opp.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
    opp.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
    'bg-gray-100 text-gray-500';

  return (
    <li className="bg-white rounded-xl shadow-sm p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{opp.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusColor}`}>
          {statusLabel}
        </span>
      </div>
      {opp.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{opp.description}</p>
      )}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        {opp.subject && <span>المادة: {opp.subject}</span>}
        {opp.remainingPages != null && (
          <span>الصفحات المتبقية: {opp.remainingPages}</span>
        )}
      </div>
    </li>
  );
}

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: opportunitiesApi.getAll,
  });

  const available = opportunities?.filter((o) => o.status === 'AVAILABLE') ?? [];
  const inProgress = opportunities?.filter((o) => o.status === 'IN_PROGRESS') ?? [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h1 className="text-xl font-bold text-gray-900">
          أهلاً، {user?.name} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          شكراً لتطوعك مع مشروع مطر. إليك الفرص المتاحة حالياً.
        </p>
      </div>

      <Link
        to="/volunteer-dashboard/library"
        className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <div className="p-3 rounded-xl bg-purple-500">
          <Library size={22} className="text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">المكتبة</p>
          <p className="text-xs text-gray-500 mt-0.5">تصفح الكتب والمواد المتاحة</p>
        </div>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-500">
            <CheckCircle size={22} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-gray-500">متاحة</p>
            <p className="text-2xl font-bold text-gray-900">{available.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-yellow-500">
            <Clock size={22} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-gray-500">جارية</p>
            <p className="text-2xl font-bold text-gray-900">{inProgress.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-500">
            <BookOpen size={22} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-gray-500">إجمالي الفرص</p>
            <p className="text-2xl font-bold text-gray-900">{opportunities?.length ?? 0}</p>
          </div>
        </div>
      </div>

      <section aria-label="الفرص المتاحة">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">الفرص المتاحة</h2>
        {isLoading && (
          <p className="text-sm text-gray-400">جاري التحميل...</p>
        )}
        {!isLoading && available.length === 0 && (
          <p className="text-sm text-gray-400 bg-white rounded-xl shadow-sm p-5">
            لا توجد فرص متاحة حالياً. تحقق لاحقاً.
          </p>
        )}
        <ul className="space-y-3">
          {available.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </ul>
      </section>

      {inProgress.length > 0 && (
        <section aria-label="الفرص الجارية">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">الفرص الجارية</h2>
          <ul className="space-y-3">
            {inProgress.map((opp) => (
              <OpportunityCard key={opp.id} opp={opp} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
