import { OpportunitiesPanel } from '../../Components/admin/OpportunitiesPanel';
import { SettingsPanel } from '../../Components/admin/SettingsPanel';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
      <SettingsPanel />
      <OpportunitiesPanel />
    </div>
  );
}
