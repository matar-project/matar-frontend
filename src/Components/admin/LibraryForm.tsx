import { X } from 'lucide-react';
import type { LibraryItem } from '../../api/library';
import { LIBRARY_ITEM_TYPES } from '../../constants/library.constants';
import { useAdminLibraryForm } from '../../Hooks/admin/useAdminLibraryForm';
import { Button } from '../ui/Button';
import { InputField, SelectField, TextareaField } from '../ui/FormField';

interface LibraryFormProps {
  item?: LibraryItem;
  onClose: () => void;
}

export function LibraryForm({ item, onClose }: LibraryFormProps) {
  const {
    register,
    onSubmit,
    formState: { errors },
    mutation,
  } = useAdminLibraryForm(item, onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item ? 'تعديل عنصر المكتبة' : 'إضافة عنصر جديد'}
    >
      <div className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {item ? 'تعديل العنصر' : 'إضافة عنصر جديد'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <InputField
            id="l-title"
            label="العنوان"
            required
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="grid grid-cols-2 gap-3">
            <InputField
              id="l-author"
              label="المؤلف"
              hint="اختياري"
              {...register('author')}
            />
            <InputField
              id="l-subject"
              label="المادة"
              hint="اختياري"
              {...register('subject')}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField
              id="l-curriculum"
              label="المنهج"
              hint="اختياري"
              {...register('curriculum')}
            />
            <InputField
              id="l-country"
              label="الدولة"
              hint="اختياري"
              {...register('country')}
            />
          </div>
          <TextareaField
            id="l-desc"
            label="الوصف"
            hint="اختياري"
            {...register('description')}
          />
          <SelectField
            id="l-type"
            label="نوع الملف"
            required
            error={errors.itemType?.message}
            {...register('itemType')}
          >
            {LIBRARY_ITEM_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </SelectField>
          <InputField
            id="l-fileUrl"
            label="رابط الملف"
            required
            type="url"
            placeholder="https://..."
            error={errors.fileUrl?.message}
            {...register('fileUrl')}
          />
          <InputField
            id="l-fileName"
            label="اسم الملف"
            required
            placeholder="كتاب-رياضيات.mp3"
            error={errors.fileName?.message}
            {...register('fileName')}
          />

          {mutation.isError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              حدث خطأ. يرجى المحاولة مجدداً.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              loading={mutation.isPending}
              className="flex-1"
            >
              {item ? 'حفظ التعديلات' : 'إضافة'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
