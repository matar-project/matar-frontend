import axios from 'axios';
import type { UpdateReservationVariables } from '../Hooks/volunteer/mutations/useUpdateReservationMutation';

export function getReservationUpdateError(
  error: unknown,
  variables: UpdateReservationVariables | undefined,
) {
  if (!variables) return undefined;

  const fallback =
    variables.action === 'reject'
      ? 'تعذر رفض المهمة. ربما انتهت المهلة وتمت إعادة الصفحات إلى الفرص المتاحة.'
      : variables.file
        ? 'تعذر إكمال المهمة. تأكد من اختيار ملف Word بصيغة .docx صالح.'
        : 'تعذر إكمال المهمة.';

  if (!axios.isAxiosError(error)) return fallback;
  if (error.response?.data?.message === 'Reservation is no longer in progress') {
    return 'هذه المهمة لم تعد قيد التنفيذ. ربما انتهت المهلة وتمت إعادة الصفحات إلى الفرص المتاحة.';
  }
  return fallback;
}
