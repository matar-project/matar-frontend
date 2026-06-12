import type { LucideIcon } from 'lucide-react';

export interface DashboardLayoutProps {
  portalTitle: string;
  navLabel: string;
  navItems: Array<{
    to: string;
    label: string;
    icon: LucideIcon;
    end?: boolean;
  }>;
  theme: {
    sidebar: string;
    border: string;
    activeLink: string;
    inactiveLink: string;
    userName: string;
    userEmail: string;
    logout: string;
    menuFocusRing: string;
  };
  showUserEmail?: boolean;
  mainId?: string;
}

export interface DashboardSidebarProps extends DashboardLayoutProps {
  userName?: string;
  userEmail?: string;
  onNavigate: () => void;
  onLogout: () => Promise<void>;
}
