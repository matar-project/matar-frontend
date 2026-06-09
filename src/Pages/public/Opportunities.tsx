import { useQuery } from '@tanstack/react-query';
import { opportunitiesApi } from '../../api/settings';
import { Link } from 'react-router-dom';

function ProgressBar({ total, remaining }: { total: number; remaining: number }) {
  const done = total - remaining;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{done} صفحة منجزة</span>
        <span>{remaining} متبقية</span>
      </div>
      <div
        className="h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% منجز`}
      >
        <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-500 text-center">{pct}% منجز</p>
    </div>
  );
}

export default function Opportunities() {
  const { data: opportunities, isLoading, isError } = useQuery({
    queryKey: ['opportunities'],
    queryFn: opportunitiesApi.getAll,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">فرص التطوع</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          اختر مشروعاً وابدأ في المساهمة. كل صفحة تحوّلها هي خطوة نحو تعليم متكافئ.
        </p>
      </header>

      {isLoading && (
        <div className="flex justify-center py-16" aria-live="polite" aria-busy="true">
          <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="sr-only">جاري التحميل...</span>
        </div>
      )}

      {isError && (
        <div role="alert" className="text-center py-16 text-red-600">
          حدث خطأ في تحميل الفرص. يرجى تحديث الصفحة.
        </div>
      )}

      {!isLoading && !isError && opportunities?.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <p className="text-gray-500 text-lg">لا توجد فرص متاحة حالياً.</p>
          <p className="text-gray-400 text-sm">تابعنا لأننا نضيف فرصاً جديدة باستمرار.</p>
        </div>
      )}

      {opportunities && opportunities.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {opportunities.map((opp: any) => (
            <li key={opp.id}>
              <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 h-full flex flex-col">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">{opp.title}</h2>
                  {opp.subject && <p className="text-sm text-primary-600 mt-1">{opp.subject}</p>}
                  {opp.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{opp.description}</p>}
                </div>

                {opp.totalPages && opp.remainingPages != null && (
                  <ProgressBar total={opp.totalPages} remaining={opp.remainingPages} />
                )}

                {opp.totalPages && (
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <dt className="text-gray-500 text-xs">إجمالي الصفحات</dt>
                      <dd className="font-bold text-gray-900">{opp.totalPages}</dd>
                    </div>
                    {opp.remainingPages != null && (
                      <div className="bg-primary-50 rounded-lg p-2 text-center">
                        <dt className="text-primary-600 text-xs">الصفحات المتبقية</dt>
                        <dd className="font-bold text-primary-700">{opp.remainingPages}</dd>
                      </div>
                    )}
                  </dl>
                )}

                <div className="mt-auto pt-2">
                  <Link
                    to="/volunteer"
                    className="block w-full text-center px-4 py-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
                    aria-label={`تطوع لمشروع: ${opp.title}`}
                  >
                    أريد المساهمة
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <div className="text-center pt-4">
        <Link
          to="/volunteer"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 font-medium rounded-xl hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
        >
          سجّل كمتطوع الآن
        </Link>
      </div>
    </div>
  );
}
