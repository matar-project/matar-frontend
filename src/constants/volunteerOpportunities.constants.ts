import type { RequestType } from '../api/workflow';
import type { Opportunity } from '../api/opportunities';

export const VOLUNTEER_OPPORTUNITY_QUERY_KEYS = {
  opportunities: ['volunteer-opportunities'] as const,
  availableRequests: ['volunteer-available-requests'] as const,
  reservations: ['volunteer-my-reservations'] as const,
  accompanimentRequests: ['volunteer-accompaniment-requests'] as const,
};

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  PDF_TO_WORD: 'PDF إلى Word',
  PDF_TO_AUDIO: 'PDF إلى تسجيل صوتي',
  ACCOMPANIMENT: 'طلب مرافقة',
};

export const MINIMUM_PAGES_BY_REQUEST_TYPE: Partial<
  Record<RequestType, number>
> = {
  PDF_TO_WORD: 3,
  PDF_TO_AUDIO: 10,
};

export const MAXIMUM_PAGE_COUNT_OPTIONS = 8;

export const RESERVATION_ERROR_MESSAGE =
  'تعذر حجز الصفحات. ربما حجز متطوع آخر هذا النطاق للتو.';

export const ACCOMPANIMENT_ERROR_MESSAGE =
  'تعذر قبول الطلب. ربما قبله متطوع آخر.';

export const OPPORTUNITY_STATUS_STYLES: Record<
  Opportunity['status'],
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: 'متاحة',
    className: 'bg-green-100 text-green-700',
  },
  IN_PROGRESS: {
    label: 'جارية',
    className: 'bg-yellow-100 text-yellow-700',
  },
  COMPLETED: {
    label: 'مكتملة',
    className: 'bg-gray-100 text-gray-600',
  },
};
