import { useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import type { Opportunity } from '../../api/settings';
import { useCreateOpportunityMutation } from '../../Hooks/admin/mutations/useCreateOpportunityMutation';
import { useDeleteOpportunityMutation } from '../../Hooks/admin/mutations/useDeleteOpportunityMutation';
import { useUpdateOpportunityMutation } from '../../Hooks/admin/mutations/useUpdateOpportunityMutation';
import { useAdminOpportunitiesInfiniteQuery } from '../../Hooks/admin/queries/useAdminOpportunitiesInfiniteQuery';
import { useDebouncedValue } from '../../Hooks/useDebouncedValue';
import type { OpportunityFormValues } from '../../Types/adminSettings.types';
import { EMPTY_OPPORTUNITY_FORM } from '../../constants/admin.constants';
import {
  opportunityFormToDto,
  opportunityToForm,
} from '../../utils/opportunityForm';
import { InfiniteScrollTrigger } from '../InfiniteScrollTrigger';
import { Button } from '../ui/Button';
import { InputField } from '../ui/FormField';

export function OpportunitiesPanel() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Opportunity | null>(null);
  const [form, setForm] = useState<OpportunityFormValues>(
    EMPTY_OPPORTUNITY_FORM,
  );
  const debouncedSearch = useDebouncedValue(search, 500);
  const opportunitiesQuery =
    useAdminOpportunitiesInfiniteQuery(debouncedSearch);
  const opportunities =
    opportunitiesQuery.data?.pages.flatMap((page) => page.data) ?? [];

  const resetForm = () => {
    setForm(EMPTY_OPPORTUNITY_FORM);
    setEditItem(null);
    setShowForm(false);
  };
  const createOpportunity = useCreateOpportunityMutation(resetForm);
  const updateOpportunity = useUpdateOpportunityMutation(resetForm);
  const deleteOpportunity = useDeleteOpportunityMutation();

  const startEditing = (opportunity: Opportunity) => {
    setEditItem(opportunity);
    setForm(opportunityToForm(opportunity));
    setShowForm(false);
  };

  const save = () => {
    const dto = opportunityFormToDto(form);
    if (editItem) {
      updateOpportunity.mutate({ id: editItem.id, dto });
    } else {
      createOpportunity.mutate(dto);
    }
  };

  return (
    <section
      className="space-y-5 rounded-xl bg-white p-6 shadow-sm"
      aria-label="إدارة فرص التطوع"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">فرص التطوع</h2>
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-1"
        >
          <Plus size={14} aria-hidden="true" /> إضافة
        </Button>
      </div>

      {(showForm || editItem) && (
        <div className="space-y-3 rounded-xl bg-gray-50 p-4">
          <h3 className="text-sm font-medium text-gray-700">
            {editItem ? 'تعديل الفرصة' : 'فرصة جديدة'}
          </h3>
          <InputField
            id="opp-title"
            label="العنوان"
            required
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />
          <InputField
            id="opp-subject"
            label="المادة"
            hint="اختياري"
            value={form.subject}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                subject: event.target.value,
              }))
            }
          />
          <InputField
            id="opp-desc"
            label="الوصف"
            hint="اختياري"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <InputField
              id="opp-total"
              label="إجمالي الصفحات"
              type="number"
              hint="اختياري"
              value={form.totalPages}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  totalPages: event.target.value,
                }))
              }
            />
            <InputField
              id="opp-remaining"
              label="الصفحات المتبقية"
              type="number"
              hint="اختياري"
              value={form.remainingPages}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  remainingPages: event.target.value,
                }))
              }
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              loading={
                createOpportunity.isPending || updateOpportunity.isPending
              }
              onClick={save}
            >
              {editItem ? 'حفظ' : 'إضافة'}
            </Button>
            <Button size="sm" variant="ghost" onClick={resetForm}>
              إلغاء
            </Button>
          </div>
        </div>
      )}

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="ابحث في جميع الحقول..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      <ul className="space-y-2" role="list">
        {opportunities.map((opportunity) => (
          <li
            key={opportunity.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {opportunity.title}
              </p>
              {opportunity.subject && (
                <p className="text-xs text-gray-500">
                  {opportunity.subject}
                </p>
              )}
              {opportunity.totalPages != null && (
                <p className="text-xs text-gray-400">
                  {opportunity.totalPages} صفحة ·{' '}
                  {opportunity.remainingPages ?? 0} متبقية
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => startEditing(opportunity)}
                aria-label={`تعديل ${opportunity.title}`}
              >
                <Edit2 size={14} aria-hidden="true" />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  if (window.confirm(`حذف "${opportunity.title}"؟`)) {
                    deleteOpportunity.mutate(opportunity.id);
                  }
                }}
                aria-label={`حذف ${opportunity.title}`}
              >
                <Trash2 size={14} aria-hidden="true" />
              </Button>
            </div>
          </li>
        ))}
        {!opportunitiesQuery.isLoading && opportunities.length === 0 && (
          <li className="py-4 text-center text-sm text-gray-400">
            لا توجد فرص بعد
          </li>
        )}
      </ul>
      <InfiniteScrollTrigger
        hasNextPage={Boolean(opportunitiesQuery.hasNextPage)}
        isFetchingNextPage={opportunitiesQuery.isFetchingNextPage}
        fetchNextPage={() => void opportunitiesQuery.fetchNextPage()}
      />
    </section>
  );
}
