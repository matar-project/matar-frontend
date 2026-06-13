import { ADMIN_DASHBOARD_CONFIG } from '../../constants/dashboard.constants';
import { DashboardLayout } from './DashboardLayout';

export function AdminLayout() {
  return <DashboardLayout {...ADMIN_DASHBOARD_CONFIG} />;
}
