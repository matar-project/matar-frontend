import { cn } from '../../lib/utils';

const statusMap: Record<string, { label: string; className: string }> = {
  NEW: { label: 'جديد', className: 'bg-blue-100 text-blue-800' },
  PENDING_COORDINATOR: {
    label: 'بانتظار المنسق للموافقة على الطلب',
    className: 'bg-blue-100 text-blue-800',
  },
  COORDINATOR_ACCEPTED: {
    label: 'قيد التنفيذ',
    className: 'bg-yellow-100 text-yellow-800',
  },
  AWAITING_COMPLETION_APPROVAL: {
    label: 'بانتظار المنسق لاعتماد التحويل',
    className: 'bg-purple-100 text-purple-800',
  },
  COORDINATOR_REJECTED: { label: 'مرفوض', className: 'bg-red-100 text-red-800' },
  IN_PROGRESS: { label: 'قيد التنفيذ', className: 'bg-yellow-100 text-yellow-800' },
  COMPLETED: { label: 'مكتمل', className: 'bg-green-100 text-green-800' },
  DONE: { label: 'مكتمل', className: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'مرفوض', className: 'bg-red-100 text-red-800' },
  LATE: { label: 'متأخر', className: 'bg-orange-100 text-orange-800' },
  AVAILABLE: { label: 'متاح', className: 'bg-emerald-100 text-emerald-800' },
};

export function StatusBadge({ status }: { status: string }) {
  const value = statusMap[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-700',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        value.className,
      )}
    >
      {value.label}
    </span>
  );
}
