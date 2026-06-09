import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { requestsApi, type CreateBookRequestDto } from '../../api/requests';
import { InputField, TextareaField } from '../../Components/ui/FormField';
import { Button } from '../../Components/ui/Button';

const schema = z.object({
  fullName: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(7, 'رقم الهاتف مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  city: z.string().min(2, 'المدينة مطلوبة'),
  bookTitle: z.string().min(1, 'عنوان الكتاب مطلوب'),
  author: z.string().optional(),
  subject: z.string().min(1, 'المادة / التخصص مطلوب'),
  country: z.string().optional(),
  curriculum: z.string().optional(),
  academicYear: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function BookRequest() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: CreateBookRequestDto) => requestsApi.createBookRequest(data),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6" role="status" aria-live="polite">
        <div className="text-6xl" aria-hidden="true">📚</div>
        <h2 className="text-2xl font-bold text-gray-900">تم إرسال طلب الكتاب بنجاح</h2>
        <p className="text-gray-600">سيتواصل معك فريق مطر بمجرد توفر الكتاب.</p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>طلب كتاب آخر</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">طلب كتاب</h1>
        <p className="text-gray-600">أخبرنا بالكتاب الذي تحتاجه وسنعمل على توفيره</p>
      </header>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data as CreateBookRequestDto))}
        className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6"
        noValidate
        aria-label="نموذج طلب الكتاب"
      >
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-gray-800 border-b pb-2 w-full">بياناتك</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="fullName" label="الاسم الكامل" required placeholder="محمد أحمد" error={errors.fullName?.message} {...register('fullName')} />
            <InputField id="phone" label="رقم الهاتف" required type="tel" placeholder="07xxxxxxxx" error={errors.phone?.message} {...register('phone')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="email" label="البريد الإلكتروني" type="email" placeholder="example@email.com" hint="اختياري" error={errors.email?.message} {...register('email')} />
            <InputField id="city" label="المدينة" required placeholder="عمّان" error={errors.city?.message} {...register('city')} />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-gray-800 border-b pb-2 w-full">بيانات الكتاب</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="bookTitle" label="عنوان الكتاب" required placeholder="اسم الكتاب" error={errors.bookTitle?.message} {...register('bookTitle')} />
            <InputField id="author" label="المؤلف" placeholder="اسم المؤلف" hint="اختياري" {...register('author')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="subject" label="المادة / التخصص" required placeholder="رياضيات، أدب..." error={errors.subject?.message} {...register('subject')} />
            <InputField id="country" label="الدولة" placeholder="الأردن" hint="اختياري" {...register('country')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="curriculum" label="المنهج" placeholder="المنهج الأردني..." hint="اختياري" {...register('curriculum')} />
            <InputField id="academicYear" label="الصف / السنة الدراسية" placeholder="الصف العاشر..." hint="اختياري" {...register('academicYear')} />
          </div>
          <TextareaField id="notes" label="ملاحظات" placeholder="أي معلومات إضافية..." hint="اختياري" {...register('notes')} />
        </fieldset>

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
