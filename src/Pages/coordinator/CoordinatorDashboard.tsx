import { Link } from 'react-router-dom';
import { useCoordinatorStatsQuery } from '../../Hooks/coordinator/queries/useCoordinatorStatsQuery';
import { COORDINATOR_DASHBOARD_CARDS } from '../../constants/coordinator.constants';

export default function CoordinatorDashboard() {
  const { data: stats } = useCoordinatorStatsQuery();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">لوحة الموزع</h2>
        <p className="mt-1 text-sm text-gray-500">متابعة الطلبات وحجوزات المتطوعين</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {COORDINATOR_DASHBOARD_CARDS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div className={`rounded-xl p-3 ${color}`}>
              <Icon className="text-white" size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.[key] ?? 0}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full">
        <Link
          to="/coordinator/requests"
          className="block w-full rounded-xl bg-cyan-700 p-6 text-white shadow-sm transition-colors hover:bg-cyan-800"
        >
          <h3 className="font-bold">مراجعة الطلبات</h3>
          <p className="mt-2 text-sm text-cyan-100">قبول أو رفض الطلبات الجديدة وإضافة الملاحظات.</p>
        </Link>
      </div>
    </div>
  );
}
