import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { requestsApi, type CreateRequestDto } from '../../api/requests';
import { InputField, TextareaField, SelectField } from '../../Components/ui/FormField';
import { Button } from '../../Components/ui/Button';

const schema = z.object({
  fullName: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(7, 'رقم الهاتف مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  city: z.string().min(2, 'المدينة مطلوبة'),
  requestType: z.string().min(1, 'نوع الطلب مطلوب'),
  details: z.string().min(10, 'يرجى تفصيل طلبك (10 أحرف على الأقل)'),
});

type FormValues = z.infer<typeof schema>;

const REQUEST_TYPES = [
  { value: 'BOOK_CONVERSION', label: 'تحويل كتاب' },
  { value: 'AUDIO_RECORDING', label: 'تسجيل صوتي' },
  { value: 'EDUCATIONAL_SUPPORT', label: 'دعم تعليمي' },
  { value: 'ACCOMPANIMENT', label: 'خدمة المرافقة' },
  { value: 'OTHER', label: 'أخرى' },
];

export default function RequestHelp() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: CreateRequestDto) => requestsApi.createRequest(data),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6" role="status" aria-live="polite">
        <div className="text-6xl" aria-hidden="true">✅</div>
        <h2 className="text-2xl font-bold text-gray-900">تم إرسال طلبك بنجاح</h2>
        <p className="text-gray-600">
          سيتواصل معك فريق مطر في أقرب وقت ممكن. شكراً لثقتك بنا.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          إرسال طلب آخر
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">اطلب مساعدة</h1>
        <p className="text-gray-600">أخبرنا بما تحتاج وسنسعى لمساعدتك</p>
      </header>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data as CreateRequestDto))}
        className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6"
        noValidate
        aria-label="نموذج طلب المساعدة"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="fullName"
            label="الاسم الكامل"
            required
            placeholder="محمد أحمد"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <InputField
            id="phone"
            label="رقم الهاتف"
            required
            type="tel"
            placeholder="07xxxxxxxx"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="email"
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@email.com"
            error={errors.email?.message}
            hint="اختياري"
            {...register('email')}
          />
          <InputField
            id="city"
            label="المدينة"
            required
            placeholder="عمّان"
            error={errors.city?.message}
            {...register('city')}
          />
        </div>

        <SelectField
          id="requestType"
          label="نوع الطلب"
          required
          error={errors.requestType?.message}
          {...register('requestType')}
        >
          <option value="">-- اختر نوع الطلب --</option>
          {REQUEST_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </SelectField>

        <TextareaField
          id="details"
          label="تفاصيل الطلب"
          required
          placeholder="اشرح طلبك بالتفصيل..."
          error={errors.details?.message}
          {...register('details')}
        />

        {mutation.isError && (
          <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مجدداً.
          </div>
        )}

        <Button type="submit" size="lg" loading={mutation.isPending} className="w-full">
          إرسال الطلب
        </Button>
      </form>
    </div>
  );
}
