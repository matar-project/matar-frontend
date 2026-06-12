import { VISUALLY_IMPAIRED_DASHBOARD_CONFIG } from '../../constants/dashboard.constants';
import { DashboardLayout } from './DashboardLayout';

export function VisuallyImpairedLayout() {
  return <DashboardLayout {...VISUALLY_IMPAIRED_DASHBOARD_CONFIG} />;
}
