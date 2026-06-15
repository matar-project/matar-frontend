import {
  BookOpen,
  ClipboardList,
  Clock3,
  FileText,
  LayoutDashboard,
  Library,
  Settings,
  Users,
} from 'lucide-react';
import type { DashboardLayoutProps } from '../Types/dashboard.types';

export const ADMIN_DASHBOARD_CONFIG: DashboardLayoutProps = {
  portalTitle: 'لوحة التحكم',
  navLabel: 'تنقل لوحة التحكم',
  mainId: 'admin-main',
  navItems: [
    { to: '/admin', label: 'الرئيسية', icon: LayoutDashboard, end: true },
    { to: '/admin/requests', label: 'الطلبات', icon: FileText },
    { to: '/admin/volunteers', label: 'المتطوعون', icon: Users },
    { to: '/admin/verifications', label: 'طلبات التحقق', icon: ClipboardList },
    { to: '/admin/library', label: 'المكتبة', icon: Library },
    { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
  ],
  theme: {
    sidebar: 'bg-primary-700',
    border: 'border-primary-500',
    activeLink: 'bg-secondary-500 text-white',
    inactiveLink: 'text-primary-200 hover:bg-primary-500 hover:text-white',
    userName: 'text-primary-300',
    userEmail: 'text-primary-400',
    logout: 'text-primary-200 hover:bg-primary-500 hover:text-white',
    menuFocusRing: 'focus-visible:ring-primary-600',
  },
};

export const COORDINATOR_DASHBOARD_CONFIG: DashboardLayoutProps = {
  portalTitle: 'بوابة الموزع',
  navLabel: 'تنقل بوابة الموزع',
  navItems: [
    { to: '/coordinator', label: 'الرئيسية', icon: LayoutDashboard, end: true },
    { to: '/coordinator/requests', label: 'الطلبات', icon: ClipboardList },
    { to: '/coordinator/reservations', label: 'حجوزات الصفحات', icon: Clock3 },
    { to: '/coordinator/library', label: 'المكتبة الصوتية', icon: Library },
  ],
  theme: {
    sidebar: 'bg-secondary-900',
    border: 'border-matar-tealGreen',
    activeLink: 'bg-matar-teal text-white',
    inactiveLink:
      'text-secondary-100 hover:bg-secondary-800 hover:text-white',
    userName: 'text-secondary-200',
    userEmail: 'text-secondary-300',
    logout: 'text-secondary-100 hover:bg-secondary-800 hover:text-white',
    menuFocusRing: 'focus-visible:ring-secondary-500',
  },
};

export const VOLUNTEER_DASHBOARD_CONFIG: DashboardLayoutProps = {
  portalTitle: 'بوابة المتطوع',
  navLabel: 'تنقل بوابة المتطوع',
  showUserEmail: true,
  navItems: [
    {
      to: '/volunteer-dashboard',
      label: 'الرئيسية',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/volunteer-dashboard/library',
      label: 'المكتبة الصوتية',
      icon: Library,
    },
    {
      to: '/volunteer-dashboard/opportunities',
      label: 'الفرص المتاحة',
      icon: BookOpen,
    },
    {
      to: '/volunteer-dashboard/work-requests',
      label: 'حجوزاتي',
      icon: ClipboardList,
    },
  ],
  theme: {
    sidebar: 'bg-primary-700',
    border: 'border-primary-500',
    activeLink: 'bg-matar-green text-white',
    inactiveLink: 'text-primary-200 hover:bg-primary-500 hover:text-white',
    userName: 'text-primary-300',
    userEmail: 'text-primary-400',
    logout: 'text-primary-200 hover:bg-primary-500 hover:text-white',
    menuFocusRing: 'focus-visible:ring-primary-500',
  },
};

export const VISUALLY_IMPAIRED_DASHBOARD_CONFIG: DashboardLayoutProps = {
  portalTitle: 'بوابة المستفيد',
  navLabel: 'تنقل بوابة المستفيد',
  showUserEmail: true,
  navItems: [
    { to: '/vi', label: 'الرئيسية', icon: LayoutDashboard, end: true },
    { to: '/vi/library', label: 'المكتبة الصوتية', icon: Library },
    { to: '/vi/requests', label: 'طلباتي', icon: FileText },
  ],
  theme: {
    sidebar: 'bg-secondary-900',
    border: 'border-secondary-700',
    activeLink: 'bg-secondary-500 text-white',
    inactiveLink:
      'text-secondary-100 hover:bg-secondary-700 hover:text-white',
    userName: 'text-secondary-200',
    userEmail: 'text-secondary-300',
    logout: 'text-secondary-100 hover:bg-secondary-700 hover:text-white',
    menuFocusRing: 'focus-visible:ring-secondary-500',
  },
};
