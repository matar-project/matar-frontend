import { VOLUNTEER_DASHBOARD_CONFIG } from '../../constants/dashboard.constants';
import { DashboardLayout } from './DashboardLayout';

export function VolunteerLayout() {
  return <DashboardLayout {...VOLUNTEER_DASHBOARD_CONFIG} />;
}
