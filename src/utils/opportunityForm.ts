import type { Opportunity, OpportunityInput } from '../api/settings';
import type { OpportunityFormValues } from '../Types/adminSettings.types';

export function opportunityToForm(
  opportunity: Opportunity,
): OpportunityFormValues {
  return {
    title: opportunity.title,
    description: opportunity.description ?? '',
    subject: opportunity.subject ?? '',
    totalPages: opportunity.totalPages?.toString() ?? '',
    remainingPages: opportunity.remainingPages?.toString() ?? '',
  };
}

export function opportunityFormToDto(
  form: OpportunityFormValues,
): OpportunityInput {
  return {
    ...form,
    totalPages: form.totalPages ? Number(form.totalPages) : undefined,
    remainingPages: form.remainingPages
      ? Number(form.remainingPages)
      : undefined,
  };
}
