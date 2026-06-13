import { BookOpen, CheckCircle, Clock, Library } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CoordinatorContactCard } from '../../Components/CoordinatorContactCard';
import { useAuth } from '../../Hooks/auth/UseAuth';
import { useVolunteerDashboardQuery } from '../../Hooks/volunteer/queries/useVolunteerDashboardQuery';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useVolunteerDashboardQuery();

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">
          أهلاً، {user?.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          تابع طلبات الخدمة المتاحة والمهام التي تعمل عليها.
        </p>
      </div>

      <CoordinatorContactCard />

      <Link
        to="/volunteer-dashboard/library"
        className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <div className="rounded-xl bg-purple-500 p-3">
          <Library size={22} className="text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">المكتبة</p>
          <p className="mt-0.5 text-xs text-gray-500">
            تصفح الكتب والمواد المكتملة
          </p>
        </div>
      </Link>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          to="/volunteer-dashboard/opportunities"
          className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <div className="rounded-xl bg-green-500 p-3">
            <CheckCircle size={22} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-gray-500">متاحة</p>
            <p className="text-2xl font-bold text-gray-900">
              {isLoading ? '…' : (stats?.available ?? 0)}
            </p>
          </div>
        </Link>

        {[
          {
            label: 'قيد التنفيذ',
            value: stats?.inProgress ?? 0,
            icon: Clock,
            color: 'bg-yellow-500',
          },
          {
            label: 'مكتملة',
            value: stats?.completed ?? 0,
            icon: BookOpen,
            color: 'bg-primary-500',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm"
          >
            <div className={`rounded-xl p-3 ${color}`}>
              <Icon size={22} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '…' : value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
