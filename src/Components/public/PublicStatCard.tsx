import type { LucideIcon } from 'lucide-react';

interface PublicStatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
}

export function PublicStatCard({
  icon: Icon,
  value,
  label,
}: PublicStatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
      <Icon
        className="mx-auto mb-3 text-secondary-500"
        size={32}
        aria-hidden="true"
      />
      <div className="mb-1 text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
