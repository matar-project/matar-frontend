import { cn } from '../../lib/utils';

const statusMap: Record<string, { label: string; className: string }> = {
  NEW: { label: 'جديد', className: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { label: 'قيد التنفيذ', className: 'bg-yellow-100 text-yellow-800' },
  COMPLETED: { label: 'مكتمل', className: 'bg-green-100 text-green-800' },
  AVAILABLE: { label: 'متاح', className: 'bg-emerald-100 text-emerald-800' },
};

export function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] ?? { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', s.className)}>
      {s.label}
    </span>
  );
}
