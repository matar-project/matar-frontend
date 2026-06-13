import { Phone } from 'lucide-react';
import { usePublicSettingsQuery } from '../Hooks/public/queries/usePublicSettingsQuery';

export function CoordinatorContactCard() {
  const { data } = usePublicSettingsQuery();

  if (!data?.coordinatorPhone) return null;

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
      <div className="rounded-xl bg-cyan-600 p-3">
        <Phone size={22} className="text-white" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">
          للتواصل مع الموزع {data.coordinatorName ? `- ${data.coordinatorName}` : ''}
        </p>
        <a
          href={`tel:${data.coordinatorPhone}`}
          dir="ltr"
          className="mt-1 inline-block text-sm font-medium text-cyan-700 underline"
        >
          {data.coordinatorPhone}
        </a>
      </div>
    </div>
  );
}
