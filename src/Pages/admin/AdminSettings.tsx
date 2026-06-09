import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi, opportunitiesApi } from '../../api/settings';
import { InputField } from '../../Components/ui/FormField';
import { Button } from '../../Components/ui/Button';
import { Plus, Trash2, Edit2 } from 'lucide-react';

function SettingsPanel() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['settings'], queryFn: settingsApi.get });
  const [form, setForm] = useState({ whatsappLink: '', facebookLink: '', messengerLink: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setForm({ whatsappLink: data.whatsappLink ?? '', facebookLink: data.facebookLink ?? '', messengerLink: data.messengerLink ?? '' });
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => settingsApi.update(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['settings'] }); setSaved(true); setTimeout(() => setSaved(false), 3000); },
  });

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 space-y-5" aria-label="إعدادات روابط التواصل">
      <h2 className="text-lg font-semibold text-gray-900">روابط التواصل</h2>
      <InputField
        id="whatsapp"
        label="رابط واتساب"
        type="url"
        placeholder="https://wa.me/..."
        value={form.whatsappLink}
        onChange={(e) => setForm((f) => ({ ...f, whatsappLink: e.target.value }))}
      />
      <InputField
        id="facebook"
        label="رابط فيسبوك"
        type="url"
        placeholder="https://facebook.com/..."
        value={form.facebookLink}
        onChange={(e) => setForm((f) => ({ ...f, facebookLink: e.target.value }))}
      />
      <InputField
        id="messenger"
        label="رابط ماسنجر"
        type="url"
        placeholder="https://m.me/..."
        value={form.messengerLink}
        onChange={(e) => setForm((f) => ({ ...f, messengerLink: e.target.value }))}
      />
      {saved && (
        <div role="status" aria-live="polite" className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
          تم حفظ الإعدادات بنجاح ✓
        </div>
      )}
      <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>حفظ الإعدادات</Button>
    </section>
  );
}

function OpportunitiesPanel() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-opportunities'], queryFn: opportunitiesApi.getAll });
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', subject: '', totalPages: '', remainingPages: '' });

  const resetForm = () => { setForm({ title: '', description: '', subject: '', totalPages: '', remainingPages: '' }); setEditItem(null); setShowForm(false); };

  useEffect(() => {
    if (editItem) setForm({
      title: editItem.title,
      description: editItem.description ?? '',
      subject: editItem.subject ?? '',
      totalPages: editItem.totalPages?.toString() ?? '',
      remainingPages: editItem.remainingPages?.toString() ?? '',
    });
  }, [editItem]);

  const createMutation = useMutation({
    mutationFn: () => opportunitiesApi.create({ ...form, totalPages: form.totalPages ? +form.totalPages : undefined, remainingPages: form.remainingPages ? +form.remainingPages : undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-opportunities'] }); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: () => opportunitiesApi.update(editItem.id, { ...form, totalPages: form.totalPages ? +form.totalPages : undefined, remainingPages: form.remainingPages ? +form.remainingPages : undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-opportunities'] }); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => opportunitiesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-opportunities'] }),
  });

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 space-y-5" aria-label="إدارة فرص التطوع">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">فرص التطوع</h2>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1">
          <Plus size={14} aria-hidden="true" /> إضافة
        </Button>
      </div>

      {(showForm || editItem) && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-700">{editItem ? 'تعديل الفرصة' : 'فرصة جديدة'}</h3>
          <InputField id="opp-title" label="العنوان" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <InputField id="opp-subject" label="المادة" hint="اختياري" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
          <InputField id="opp-desc" label="الوصف" hint="اختياري" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <InputField id="opp-total" label="إجمالي الصفحات" type="number" hint="اختياري" value={form.totalPages} onChange={(e) => setForm((f) => ({ ...f, totalPages: e.target.value }))} />
            <InputField id="opp-remaining" label="الصفحات المتبقية" type="number" hint="اختياري" value={form.remainingPages} onChange={(e) => setForm((f) => ({ ...f, remainingPages: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" loading={createMutation.isPending || updateMutation.isPending} onClick={() => editItem ? updateMutation.mutate() : createMutation.mutate()}>
              {editItem ? 'حفظ' : 'إضافة'}
            </Button>
            <Button size="sm" variant="ghost" onClick={resetForm}>إلغاء</Button>
          </div>
        </div>
      )}

      <ul className="space-y-2" role="list">
        {data?.map((opp: any) => (
          <li key={opp.id} className="flex items-center justify-between gap-3 p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">{opp.title}</p>
              {opp.subject && <p className="text-xs text-gray-500">{opp.subject}</p>}
              {opp.totalPages && <p className="text-xs text-gray-400">{opp.totalPages} صفحة · {opp.remainingPages} متبقية</p>}
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => { setEditItem(opp); setShowForm(false); }} aria-label={`تعديل ${opp.title}`}><Edit2 size={14} /></Button>
              <Button size="sm" variant="danger" onClick={() => { if (confirm(`حذف "${opp.title}"؟`)) deleteMutation.mutate(opp.id); }} aria-label={`حذف ${opp.title}`}><Trash2 size={14} /></Button>
            </div>
          </li>
        ))}
        {data?.length === 0 && <li className="text-sm text-gray-400 text-center py-4">لا توجد فرص بعد</li>}
      </ul>
    </section>
  );
}

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
      <SettingsPanel />
      <OpportunitiesPanel />
    </div>
  );
}
