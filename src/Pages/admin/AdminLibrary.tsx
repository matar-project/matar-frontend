import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { libraryApi } from '../../api/library';
import { InputField, TextareaField, SelectField } from '../../Components/ui/FormField';
import { Button } from '../../Components/ui/Button';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

const ITEM_TYPES = [
  { value: 'AUDIO', label: 'صوتي' },
  { value: 'WORD_DOC', label: 'Word' },
  { value: 'PDF', label: 'PDF' },
  { value: 'BRAILLE', label: 'برايل' },
  { value: 'OTHER', label: 'أخرى' },
];

const schema = z.object({
  title: z.string().min(1, 'العنوان مطلوب'),
  author: z.string().optional(),
  subject: z.string().optional(),
  curriculum: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
  itemType: z.string().min(1, 'نوع الملف مطلوب'),
  fileUrl: z.string().url('رابط غير صالح').min(1, 'رابط الملف مطلوب'),
  fileName: z.string().min(1, 'اسم الملف مطلوب'),
});

type FormValues = z.infer<typeof schema>;

function LibraryForm({ item, onClose }: { item?: any; onClose: () => void }) {
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: item ?? {},
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      item ? libraryApi.update(item.id, data) : libraryApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-library-list'] }); onClose(); },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label={item ? 'تعديل عنصر المكتبة' : 'إضافة عنصر جديد'}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{item ? 'تعديل العنصر' : 'إضافة عنصر جديد'}</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" aria-label="إغلاق">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4" noValidate>
          <InputField id="l-title" label="العنوان" required error={errors.title?.message} {...register('title')} />
          <div className="grid grid-cols-2 gap-3">
            <InputField id="l-author" label="المؤلف" hint="اختياري" {...register('author')} />
            <InputField id="l-subject" label="المادة" hint="اختياري" {...register('subject')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField id="l-curriculum" label="المنهج" hint="اختياري" {...register('curriculum')} />
            <InputField id="l-country" label="الدولة" hint="اختياري" {...register('country')} />
          </div>
          <TextareaField id="l-desc" label="الوصف" hint="اختياري" {...register('description')} />
          <SelectField id="l-type" label="نوع الملف" required error={errors.itemType?.message} {...register('itemType')}>
            <option value="">-- اختر --</option>
            {ITEM_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </SelectField>
          <InputField id="l-fileUrl" label="رابط الملف" required type="url" placeholder="https://..." error={errors.fileUrl?.message} {...register('fileUrl')} />
          <InputField id="l-fileName" label="اسم الملف" required placeholder="كتاب-رياضيات.mp3" error={errors.fileName?.message} {...register('fileName')} />

          {mutation.isError && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              حدث خطأ. يرجى المحاولة مجدداً.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={mutation.isPending} className="flex-1">{item ? 'حفظ التعديلات' : 'إضافة'}</Button>
            <Button type="button" variant="ghost" onClick={onClose}>إلغاء</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminLibrary() {
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-library-list', page],
    queryFn: () => libraryApi.getAllAdmin(page, 20),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => libraryApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-library-list'] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">المكتبة</h1>
        <Button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2">
          <Plus size={16} aria-hidden="true" /> إضافة مادة
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12" aria-busy="true">
          <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="sr-only">جاري التحميل...</span>
        </div>
      )}

      {data && (
        <>
          <p className="text-sm text-gray-500">{data.total} عنصر</p>
          <ul className="space-y-3" role="list">
            {data.data.map((item: any) => (
              <li key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-sm text-gray-500 truncate">{item.author} {item.subject ? `· ${item.subject}` : ''}</p>
                  <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded">{item.itemType}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setEditItem(item); setFormOpen(true); }}
                    aria-label={`تعديل ${item.title}`}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (confirm(`حذف "${item.title}"؟`)) deleteMutation.mutate(item.id);
                    }}
                    aria-label={`حذف ${item.title}`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {data.total > 20 && (
            <nav className="flex justify-center gap-2" aria-label="التنقل بين الصفحات">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>السابق</Button>
              <span className="flex items-center px-3 text-sm">صفحة {page}</span>
              <Button variant="outline" size="sm" disabled={page >= Math.ceil(data.total / 20)} onClick={() => setPage((p) => p + 1)}>التالي</Button>
            </nav>
          )}
        </>
      )}

      {formOpen && (
        <LibraryForm
          item={editItem}
          onClose={() => { setFormOpen(false); setEditItem(null); }}
        />
      )}
    </div>
  );
}
