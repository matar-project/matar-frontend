import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { LogOut, Menu, X } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../Hooks/auth/UseAuth';

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

type DashboardTheme = {
  sidebar: string;
  border: string;
  activeLink: string;
  inactiveLink: string;
  userName: string;
  userEmail: string;
  logout: string;
  menuFocusRing: string;
};

type DashboardLayoutProps = {
  portalTitle: string;
  navLabel: string;
  navItems: DashboardNavItem[];
  theme: DashboardTheme;
  showUserEmail?: boolean;
  mainId?: string;
};

type DashboardSidebarProps = {
  portalTitle: string;
  navLabel: string;
  navItems: DashboardNavItem[];
  theme: DashboardTheme;
  userName?: string;
  userEmail?: string;
  showUserEmail: boolean;
  onNavigate: () => void;
  onLogout: () => Promise<void>;
};

function DashboardSidebar({
  portalTitle,
  navLabel,
  navItems,
  theme,
  userName,
  userEmail,
  showUserEmail,
  onNavigate,
  onLogout,
}: DashboardSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className={`flex items-center gap-3 border-b p-4 ${theme.border}`}>
        <img src={logo} alt="مشروع مطر" className="h-8 w-auto" />
        <span className="font-bold text-white">{portalTitle}</span>
      </div>

      <nav className="flex-1 space-y-1 p-4" aria-label={navLabel}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isActive ? theme.activeLink : theme.inactiveLink
              }`
            }
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={`space-y-2 border-t p-4 ${theme.border}`}>
        <p className={`truncate text-xs ${theme.userName}`}>{userName}</p>
        {showUserEmail && <p className={`truncate text-xs ${theme.userEmail}`}>{userEmail}</p>}
        <button
          type="button"
          onClick={onLogout}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${theme.logout}`}
          aria-label="تسجيل الخروج"
        >
          <LogOut size={16} aria-hidden="true" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

export function DashboardLayout({
  portalTitle,
  navLabel,
  navItems,
  theme,
  showUserEmail = false,
  mainId,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarProps: DashboardSidebarProps = {
    portalTitle,
    navLabel,
    navItems,
    theme,
    userName: user?.name,
    userEmail: user?.email,
    showUserEmail,
    onNavigate: () => setSidebarOpen(false),
    onLogout: handleLogout,
  };

  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      <aside
        className={`hidden h-screen w-64 flex-shrink-0 overflow-y-auto lg:sticky lg:top-0 lg:block ${theme.sidebar}`}
        aria-label="الشريط الجانبي"
      >
        <DashboardSidebar {...sidebarProps} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
          />
          <aside className={`relative z-50 w-64 ${theme.sidebar}`} aria-label="الشريط الجانبي">
            <DashboardSidebar {...sidebarProps} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 bg-white px-4 shadow-sm">
          <button
            type="button"
            className={`rounded-md p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 lg:hidden ${theme.menuFocusRing}`}
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="فتح القائمة الجانبية"
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-sm font-semibold text-gray-800">مشروع مطر — {portalTitle}</h1>
        </header>

        <main id={mainId} className="flex-1 overflow-auto p-4 md:p-6" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
