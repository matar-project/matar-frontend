import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/auth/UseAuth';
import { Menu, X, LayoutDashboard, BookOpen, ClipboardList, Library, LogOut } from 'lucide-react';
import logo from '../../assets/logo.png';

const navItems = [
  { to: '/volunteer-dashboard', label: 'الرئيسية', icon: LayoutDashboard, end: true },
  { to: '/volunteer-dashboard/library', label: 'المكتبة الصوتية', icon: Library },
  { to: '/volunteer-dashboard/opportunities', label: 'الفرص المتاحة', icon: BookOpen },
  { to: '/volunteer-dashboard/work-requests', label: 'حجوزاتي', icon: ClipboardList },
];

export function VolunteerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <img src={logo} alt="مشروع مطر" className="h-8 w-auto" />
        <span className="text-white font-bold">بوابة المتطوع</span>
      </div>
      <nav className="flex-1 p-4 space-y-1" aria-label="تنقل بوابة المتطوع">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isActive ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 space-y-2">
        <p className="text-xs text-gray-400 truncate">{user?.name}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="تسجيل الخروج"
        >
          <LogOut size={16} aria-hidden="true" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex" dir="rtl">
      <aside className="hidden lg:block w-64 bg-gray-800 flex-shrink-0" aria-label="الشريط الجانبي">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <aside className="relative z-50 w-64 bg-gray-800">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm h-14 flex items-center px-4 gap-3">
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
            aria-label="فتح القائمة الجانبية"
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-gray-800 font-semibold text-sm">مشروع مطر — بوابة المتطوع</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
