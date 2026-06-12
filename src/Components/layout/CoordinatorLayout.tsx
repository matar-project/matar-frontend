import { ClipboardList, Clock3, LayoutDashboard, Library } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const navItems = [
  { to: '/coordinator', label: 'الرئيسية', icon: LayoutDashboard, end: true },
  { to: '/coordinator/requests', label: 'الطلبات', icon: ClipboardList },
  { to: '/coordinator/reservations', label: 'حجوزات الصفحات', icon: Clock3 },
  { to: '/coordinator/library', label: 'المكتبة الصوتية', icon: Library },
];

export function CoordinatorLayout() {
  return (
    <DashboardLayout
      portalTitle="بوابة الموزع"
      navLabel="تنقل بوابة الموزع"
      navItems={navItems}
      theme={{
        sidebar: 'bg-secondary-900',
        border: 'border-matar-tealGreen',
        activeLink: 'bg-matar-teal text-white',
        inactiveLink: 'text-secondary-100 hover:bg-secondary-800 hover:text-white',
        userName: 'text-secondary-200',
        userEmail: 'text-secondary-300',
        logout: 'text-secondary-100 hover:bg-secondary-800 hover:text-white',
        menuFocusRing: 'focus-visible:ring-secondary-500',
      }}
    />
  );
}
