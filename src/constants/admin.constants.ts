export const ADMIN_QUERY_KEYS = {
  stats: ['stats'] as const,
  recentVolunteers: ['admin-volunteers'] as const,
  volunteers: ['admin-volunteers-list'] as const,
  requests: ['admin-requests'] as const,
  settings: ['settings'] as const,
  opportunities: ['admin-opportunities'] as const,
};

export const ADMIN_PAGE_SIZE = 10;

export const EMPTY_OPPORTUNITY_FORM: OpportunityFormValues = {
  title: '',
  description: '',
  subject: '',
  totalPages: '',
  remainingPages: '',
};

export const REQUEST_STATUS_OPTIONS = [
  { value: 'PENDING_COORDINATOR', label: 'بانتظار المنسق' },
  { value: 'COORDINATOR_ACCEPTED', label: 'مقبول' },
  { value: 'COORDINATOR_REJECTED', label: 'مرفوض' },
  { value: 'DONE', label: 'مكتمل' },
] as const;
import type { OpportunityFormValues } from '../Types/adminSettings.types';
