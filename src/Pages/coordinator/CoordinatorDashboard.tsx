import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, FileCheck, FileX, Hourglass, TimerOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { workflowApi } from '../../api/workflow';

const cards = [
  { key: 'pendingRequests', label: 'طلبات بانتظار الموزع', icon: Clock, color: 'bg-blue-500' },
  { key: 'acceptedRequests', label: 'طلبات مقبولة', icon: FileCheck, color: 'bg-emerald-500' },
  { key: 'rejectedRequests', label: 'طلبات مرفوضة', icon: FileX, color: 'bg-red-500' },
  { key: 'inProgressReservations', label: 'قيد التنفيذ', icon: Hourglass, color: 'bg-amber-500' },
  { key: 'doneReservations', label: 'تمت', icon: CheckCircle, color: 'bg-green-600' },
  { key: 'lateReservations', label: 'منتهية', icon: TimerOff, color: 'bg-orange-600' },
] as const;

export default function CoordinatorDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['coordinator-stats'],
    queryFn: workflowApi.getCoordinatorStats,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">لوحة الموزع</h2>
        <p className="mt-1 text-sm text-gray-500">متابعة الطلبات وحجوزات المتطوعين</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ key, label, icon: Icon, color }) => (
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
