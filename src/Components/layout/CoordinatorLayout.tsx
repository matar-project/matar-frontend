import { useState } from 'react';
import {
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../Hooks/auth/UseAuth';

const navItems = [
  { to: '/coordinator', label: 'الرئيسية', icon: LayoutDashboard, end: true },
  { to: '/coordinator/requests', label: 'الطلبات', icon: ClipboardList },
  { to: '/coordinator/reservations', label: 'حجوزات الصفحات', icon: Clock3 },
];

export function CoordinatorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-matar-tealGreen p-4">
        <img src={logo} alt="مشروع مطر" className="h-8 w-auto" />
        <span className="font-bold text-white">بوابة الموزع</span>
      </div>
      <nav className="flex-1 space-y-1 p-4" aria-label="تنقل بوابة الموزع">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isActive ? 'bg-matar-teal text-white' : 'text-secondary-100 hover:bg-secondary-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-2 border-t border-matar-tealGreen p-4">
        <p className="truncate text-xs text-secondary-200">{user?.name}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-secondary-100 hover:bg-secondary-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <LogOut size={16} aria-hidden="true" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      <aside className="hidden w-64 flex-shrink-0 bg-secondary-900 lg:block">{sidebar}</aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
          />
          <aside className="relative z-50 w-64 bg-secondary-900">{sidebar}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 bg-white px-4 shadow-sm">
          <button
            type="button"
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="فتح القائمة الجانبية"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-sm font-semibold text-gray-800">مشروع مطر - بوابة الموزع</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
