import { InfiniteScrollTrigger } from '../../Components/InfiniteScrollTrigger';
import { OpportunityCard } from '../../Components/volunteer/OpportunityCard';
import { ServiceRequestCard } from '../../Components/volunteer/ServiceRequestCard';
import { useVolunteerOpportunities } from '../../Hooks/volunteer/useVolunteerOpportunities';

export default function VolunteerOpportunities() {
  const {
    search,
    setSearch,
    opportunitiesQuery,
    requestsQuery,
    opportunities,
    requests,
    joinOpportunity,
    reservePages,
    claimAccompaniment,
    isJoining,
    isRequestPending,
    getRequestError,
  } = useVolunteerOpportunities();

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
        {opportunitiesQuery.isLoading && (
          <p className="text-sm text-gray-500">جاري التحميل...</p>
        )}
        {!opportunitiesQuery.isLoading && opportunities.length === 0 && (
          <p className="rounded-xl bg-white p-5 text-sm text-gray-400 shadow-sm">
            لا توجد فرص مرافقة حالياً.
          </p>
        )}
        {opportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onJoin={() => joinOpportunity(opportunity.id)}
            joining={isJoining(opportunity.id)}
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
          <ServiceRequestCard
            key={request.id}
            request={request}
            onReserve={(pageCount) => reservePages(request.id, pageCount)}
            onClaim={() => claimAccompaniment(request.id)}
            pending={isRequestPending(request.id)}
            error={getRequestError(request.id)}
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
