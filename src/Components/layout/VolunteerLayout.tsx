import { BookOpen, ClipboardList, LayoutDashboard, Library } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const navItems = [
  { to: '/volunteer-dashboard', label: 'الرئيسية', icon: LayoutDashboard, end: true },
  { to: '/volunteer-dashboard/library', label: 'المكتبة الصوتية', icon: Library },
  { to: '/volunteer-dashboard/opportunities', label: 'الفرص المتاحة', icon: BookOpen },
  { to: '/volunteer-dashboard/work-requests', label: 'حجوزاتي', icon: ClipboardList },
];

export function VolunteerLayout() {
  return (
    <DashboardLayout
      portalTitle="بوابة المتطوع"
      navLabel="تنقل بوابة المتطوع"
      navItems={navItems}
      showUserEmail
      theme={{
        sidebar: 'bg-primary-700',
        border: 'border-primary-500',
        activeLink: 'bg-matar-green text-white',
        inactiveLink: 'text-primary-200 hover:bg-primary-500 hover:text-white',
        userName: 'text-primary-300',
        userEmail: 'text-primary-400',
        logout: 'text-primary-200 hover:bg-primary-500 hover:text-white',
        menuFocusRing: 'focus-visible:ring-primary-500',
      }}
    />
  );
}
