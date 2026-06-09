import { useQuery } from '@tanstack/react-query';
import { requestsApi } from '../../api/requests';
import { volunteersApi } from '../../api/volunteers';
import { libraryApi } from '../../api/library';
import { Users, BookOpen, Library, CheckCircle } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} aria-hidden="true" className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: requestsApi.getStats });
  const { data: volunteers } = useQuery({ queryKey: ['admin-volunteers'], queryFn: () => volunteersApi.getAll(1, 5) });
  const { data: library } = useQuery({ queryKey: ['admin-library'], queryFn: () => libraryApi.findAllAdmin ? libraryApi.findAllAdmin(1, 5) : libraryApi.getAllAdmin(1, 5) });
  const { data: requests } = useQuery({ queryKey: ['admin-requests'], queryFn: () => requestsApi.getRequests(1, 5) });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="المتطوعون" value={stats?.totalVolunteers ?? 0} color="bg-primary-500" />
        <StatCard icon={BookOpen} label="الطلبات" value={stats?.totalRequests ?? 0} color="bg-amber-500" />
        <StatCard icon={CheckCircle} label="طلبات مكتملة" value={stats?.completedRequests ?? 0} color="bg-secondary-500" />
        <StatCard icon={Library} label="المكتبة" value={stats?.libraryItems ?? 0} color="bg-purple-500" />
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent requests */}
        <section className="bg-white rounded-xl shadow-sm p-5 space-y-4" aria-label="آخر الطلبات">
          <h2 className="font-semibold text-gray-900">آخر الطلبات</h2>
          {requests?.data?.length === 0 && <p className="text-gray-400 text-sm">لا توجد طلبات</p>}
          <ul className="divide-y divide-gray-100" role="list">
            {requests?.data?.map((r: any) => (
              <li key={r.id} className="py-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.fullName}</p>
                  <p className="text-xs text-gray-500">{r.city} · {new Date(r.createdAt).toLocaleDateString('ar-JO')}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  r.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                  r.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {r.status === 'NEW' ? 'جديد' : r.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : 'مكتمل'}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent volunteers */}
        <section className="bg-white rounded-xl shadow-sm p-5 space-y-4" aria-label="آخر المتطوعين">
          <h2 className="font-semibold text-gray-900">آخر المتطوعين</h2>
          {volunteers?.data?.length === 0 && <p className="text-gray-400 text-sm">لا يوجد متطوعون</p>}
          <ul className="divide-y divide-gray-100" role="list">
            {volunteers?.data?.map((v: any) => (
              <li key={v.id} className="py-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">{v.name}</p>
                  <p className="text-xs text-gray-500">{v.city} · {v.phone}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  v.contacted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {v.contacted ? 'تم التواصل' : 'جديد'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
