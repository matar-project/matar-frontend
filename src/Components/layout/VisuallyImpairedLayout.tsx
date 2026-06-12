import { FileText, LayoutDashboard, Library } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const navItems = [
  { to: '/vi', label: 'الرئيسية', icon: LayoutDashboard, end: true },
  { to: '/vi/library', label: 'المكتبة الصوتية', icon: Library },
  { to: '/vi/requests', label: 'طلباتي', icon: FileText },
];

export function VisuallyImpairedLayout() {
  return (
    <DashboardLayout
      portalTitle="بوابة المستفيد"
      navLabel="تنقل بوابة المستفيد"
      navItems={navItems}
      showUserEmail
      theme={{
        sidebar: 'bg-secondary-900',
        border: 'border-secondary-700',
        activeLink: 'bg-secondary-500 text-white',
        inactiveLink: 'text-secondary-100 hover:bg-secondary-700 hover:text-white',
        userName: 'text-secondary-200',
        userEmail: 'text-secondary-300',
        logout: 'text-secondary-100 hover:bg-secondary-700 hover:text-white',
        menuFocusRing: 'focus-visible:ring-secondary-500',
      }}
    />
  );
}
