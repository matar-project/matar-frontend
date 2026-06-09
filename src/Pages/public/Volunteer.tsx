import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { volunteersApi, type CreateVolunteerDto } from '../../api/volunteers';
import { InputField, SelectField } from '../../Components/ui/FormField';
import { Button } from '../../Components/ui/Button';
import { cn } from '../../lib/utils';

const INTERESTS = [
  { value: 'AUDIO_RECORDING', label: 'التسجيل الصوتي' },
  { value: 'WORD_CONVERSION', label: 'التحويل لملف Word' },
  { value: 'BOOK_TYPING', label: 'كتابة الكتب' },
  { value: 'ACCOMPANIMENT', label: 'خدمة المرافقة' },
  { value: 'GENERAL', label: 'تطوع عام' },
];

const CONTACTS = [
  { value: 'WHATSAPP', label: 'واتساب' },
  { value: 'FACEBOOK', label: 'فيسبوك' },
  { value: 'MESSENGER', label: 'ماسنجر' },
];

const schema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(7, 'رقم الهاتف مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  city: z.string().min(2, 'المدينة مطلوبة'),
  interests: z.array(z.string()).min(1, 'اختر مجال تطوع واحداً على الأقل'),
  preferredContact: z.string().min(1, 'اختر طريقة التواصل'),
});

type FormValues = z.infer<typeof schema>;

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { interests: [] },
  });

  const toggleInterest = (value: string) => {
    const next = selectedInterests.includes(value)
      ? selectedInterests.filter((v) => v !== value)
      : [...selectedInterests, value];
    setSelectedInterests(next);
    setValue('interests', next, { shouldValidate: true });
  };

  const mutation = useMutation({
    mutationFn: (data: CreateVolunteerDto) => volunteersApi.register(data),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6" role="status" aria-live="polite">
        <div className="text-6xl" aria-hidden="true">🌟</div>
        <h2 className="text-2xl font-bold text-gray-900">شكراً لانضمامك إلى مطر!</h2>
        <p className="text-gray-600">سيتواصل معك الفريق قريباً لتنسيق بدء التطوع.</p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>تسجيل متطوع آخر</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">تطوع معنا</h1>
        <p className="text-gray-600">انضم إلى مجتمع المتطوعين وأحدث فرقاً حقيقياً</p>
      </header>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data as CreateVolunteerDto))}
        className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6"
        noValidate
        aria-label="نموذج تسجيل المتطوع"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField id="name" label="الاسم" required placeholder="اسمك الكامل" error={errors.name?.message} {...register('name')} />
          <InputField id="phone" label="رقم الهاتف" required type="tel" placeholder="07xxxxxxxx" error={errors.phone?.message} {...register('phone')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField id="email" label="البريد الإلكتروني" type="email" placeholder="example@email.com" hint="اختياري" error={errors.email?.message} {...register('email')} />
          <InputField id="city" label="المدينة" required placeholder="عمّان" error={errors.city?.message} {...register('city')} />
        </div>

        {/* Interests multi-select */}
        <div className="space-y-2">
          <span className="block text-sm font-medium text-gray-700">
            مجالات التطوع <span className="text-red-500 mr-1" aria-hidden="true">*</span>
          </span>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="مجالات التطوع"
            aria-describedby={errors.interests ? 'interests-error' : undefined}
          >
            {INTERESTS.map((i) => {
              const selected = selectedInterests.includes(i.value);
              return (
                <button
                  key={i.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleInterest(i.value)}
                  className={cn(
                    'px-4 py-2 rounded-full border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]',
                    selected
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400',
                  )}
                >
                  {i.label}
                </button>
              );
            })}
          </div>
          {errors.interests && (
            <p id="interests-error" className="text-sm text-red-600" role="alert">
              <span aria-hidden="true">⚠</span> {errors.interests.message}
            </p>
          )}
        </div>

        <SelectField
          id="preferredContact"
          label="طريقة التواصل المفضلة"
          required
          error={errors.preferredContact?.message}
          {...register('preferredContact')}
        >
          <option value="">-- اختر طريقة التواصل --</option>
          {CONTACTS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </SelectField>

        {mutation.isError && (
          <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مجدداً.
          </div>
        )}

        <Button type="submit" size="lg" loading={mutation.isPending} className="w-full">
          سجّل كمتطوع
        </Button>
      </form>
    </div>
  );
}
