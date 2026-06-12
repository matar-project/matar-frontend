import type { CoordinatorRequestFilter } from '../api/workflow';
import {
  CheckCircle,
  Clock,
  FileCheck,
  FileX,
  Hourglass,
  TimerOff,
} from 'lucide-react';

export const COORDINATOR_QUERY_KEYS = {
  requests: ['coordinator-requests'] as const,
  books: ['coordinator-books'] as const,
  stats: ['coordinator-stats'] as const,
  reservations: ['request-reservations'] as const,
  libraryBooks: ['system-library-books'] as const,
};

export const COORDINATOR_REQUEST_TYPE_LABELS = {
  PDF_TO_WORD: 'PDF إلى Word',
  PDF_TO_AUDIO: 'PDF إلى تسجيل صوتي',
  ACCOMPANIMENT: 'طلب مرافقة',
} as const;

export const COORDINATOR_STATUS_OPTIONS: Array<{
  value: CoordinatorRequestFilter;
  label: string;
}> = [
  { value: 'ALL', label: 'الكل' },
  { value: 'COORDINATOR_REJECTED', label: 'مرفوض' },
  { value: 'IN_PROGRESS', label: 'قيد التنفيذ' },
  { value: 'DONE', label: 'مكتمل' },
  { value: 'PENDING_COORDINATOR', label: 'بانتظار موافقة المنسق' },
  {
    value: 'AWAITING_COMPLETION_APPROVAL',
    label: 'بانتظار اعتماد التحويل',
  },
];

export const COORDINATOR_DASHBOARD_CARDS = [
  {
    key: 'pendingRequests',
    label: 'طلبات بانتظار الموزع',
    icon: Clock,
    color: 'bg-blue-500',
  },
  {
    key: 'acceptedRequests',
    label: 'طلبات مقبولة',
    icon: FileCheck,
    color: 'bg-emerald-500',
  },
  {
    key: 'rejectedRequests',
    label: 'طلبات مرفوضة',
    icon: FileX,
    color: 'bg-red-500',
  },
  {
    key: 'inProgressReservations',
    label: 'قيد التنفيذ',
    icon: Hourglass,
    color: 'bg-amber-500',
  },
  {
    key: 'doneReservations',
    label: 'تمت',
    icon: CheckCircle,
    color: 'bg-green-600',
  },
  {
    key: 'lateReservations',
    label: 'منتهية',
    icon: TimerOff,
    color: 'bg-orange-600',
  },
] as const;
