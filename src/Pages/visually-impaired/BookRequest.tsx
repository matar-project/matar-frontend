import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { requestsApi, type CreateBookRequestDto } from '../../api/requests';
import { InputField, TextareaField } from '../../Components/ui/FormField';
import { Button } from '../../Components/ui/Button';
import { useAuth } from '../../Hooks/auth/UseAuth';

const schema = z.object({
  bookTitle: z.string().min(1, 'عنوان الكتاب مطلوب'),
  author: z.string().optional(),
  subject: z.string().min(1, 'المادة / التخصص مطلوب'),
  curriculum: z.string().optional(),
  academicYear: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function BookRequest() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bookTitle: '',
      author: '',
      subject: '',
      curriculum: '',
      academicYear: '',
      notes: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateBookRequestDto) => requestsApi.createBookRequest(data),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6" role="status" aria-live="polite">
        <div className="text-6xl" aria-hidden="true">✓</div>
        <h2 className="text-2xl font-bold text-gray-900">تم إرسال طلب الكتاب بنجاح</h2>
        <p className="text-gray-600">سيتواصل معك فريق مطر بمجرد توفر الكتاب.</p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>طلب كتاب آخر</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">طلب كتاب مسموع</h1>
        <p className="text-gray-600">أخبرنا بالكتاب الذي تحتاجه وسنعمل على توفيره</p>
      </header>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6"
        noValidate
        aria-label="نموذج طلب الكتاب"
      >
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 space-y-1">
          <p><span className="font-medium">الاسم:</span> {user?.name}</p>
          <p><span className="font-medium">الهاتف:</span> <span dir="ltr">{user?.phone}</span></p>
          <p><span className="font-medium">الدولة والمدينة:</span> {user?.country}، {user?.city}</p>
          <p className="text-gray-500">سنستخدم هذه البيانات للتواصل معك بشأن الطلب.</p>
        </div>

        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-gray-800 border-b pb-2 w-full">بيانات الكتاب</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="bookTitle" label="عنوان الكتاب" required placeholder="اسم الكتاب" error={errors.bookTitle?.message} {...register('bookTitle')} />
            <InputField id="author" label="المؤلف" placeholder="اسم المؤلف" hint="اختياري" {...register('author')} />
          </div>
          <InputField id="subject" label="المادة / التخصص" required placeholder="رياضيات، أدب..." error={errors.subject?.message} {...register('subject')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="curriculum" label="المنهج" placeholder="المنهج الأردني..." hint="اختياري" {...register('curriculum')} />
            <InputField id="academicYear" label="الصف / السنة الدراسية" placeholder="الصف العاشر..." hint="اختياري" {...register('academicYear')} />
          </div>
          <TextareaField id="notes" label="ملاحظات" placeholder="أي معلومات إضافية..." hint="اختياري" {...register('notes')} />
        </fieldset>

        {mutation.isError && (
          <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            تعذر إرسال الطلب. تأكد من اكتمال بيانات الاتصال في حسابك ثم حاول مجدداً.
          </div>
        )}

        <Button type="submit" size="lg" loading={mutation.isPending} className="w-full">
          إرسال الطلب
        </Button>
      </form>
    </div>
  );
}
