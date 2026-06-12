import { FileText, LayoutDashboard, Library, Settings, Users } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const navItems = [
  { to: '/admin', label: 'الرئيسية', icon: LayoutDashboard, end: true },
  { to: '/admin/requests', label: 'الطلبات', icon: FileText },
  { to: '/admin/volunteers', label: 'المتطوعون', icon: Users },
  { to: '/admin/library', label: 'المكتبة', icon: Library },
  { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export function AdminLayout() {
  return (
    <DashboardLayout
      portalTitle="لوحة التحكم"
      navLabel="تنقل لوحة التحكم"
      navItems={navItems}
      mainId="admin-main"
      theme={{
        sidebar: 'bg-primary-700',
        border: 'border-primary-500',
        activeLink: 'bg-secondary-500 text-white',
        inactiveLink: 'text-primary-200 hover:bg-primary-500 hover:text-white',
        userName: 'text-primary-300',
        userEmail: 'text-primary-400',
        logout: 'text-primary-200 hover:bg-primary-500 hover:text-white',
        menuFocusRing: 'focus-visible:ring-primary-600',
      }}
    />
  );
}
