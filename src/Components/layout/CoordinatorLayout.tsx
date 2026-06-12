import { COORDINATOR_DASHBOARD_CONFIG } from '../../constants/dashboard.constants';
import { DashboardLayout } from './DashboardLayout';

export function CoordinatorLayout() {
  return <DashboardLayout {...COORDINATOR_DASHBOARD_CONFIG} />;
}
