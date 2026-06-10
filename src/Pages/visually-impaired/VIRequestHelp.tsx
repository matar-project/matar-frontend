import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { requestsApi, type CreateRequestDto } from '../../api/requests';
import { Button } from '../../Components/ui/Button';
import { InputField, SelectField, TextareaField } from '../../Components/ui/FormField';
import { useAuth } from '../../Hooks/auth/UseAuth';

const schema = z
  .object({
    requestType: z.enum(['PDF_TO_WORD', 'PDF_TO_AUDIO', 'ACCOMPANIMENT']),
    title: z.string().min(1, 'عنوان الطلب مطلوب').max(200),
    details: z.string().min(10, 'يرجى كتابة 10 أحرف على الأقل'),
    pdfFile: z.custom<FileList>().optional(),
    totalPages: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.requestType === 'ACCOMPANIMENT') return;
    const totalPages = Number(value.totalPages);
    if (!Number.isInteger(totalPages) || totalPages < 1) {
      context.addIssue({
        code: 'custom',
        path: ['totalPages'],
        message: 'عدد الصفحات مطلوب ويجب أن يكون رقما موجبا',
      });
    }
    const file = value.pdfFile?.[0];
    if (!file) {
      context.addIssue({
        code: 'custom',
        path: ['pdfFile'],
        message: 'ملف PDF مطلوب',
      });
      return;
    }
    if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
      context.addIssue({
        code: 'custom',
        path: ['pdfFile'],
        message: 'يسمح بملفات PDF فقط',
      });
    }
    if (file.size > 25 * 1024 * 1024) {
      context.addIssue({
        code: 'custom',
        path: ['pdfFile'],
        message: 'حجم الملف يجب ألا يتجاوز 25 ميجابايت',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function VIRequestHelp() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      requestType: 'PDF_TO_WORD',
      title: '',
      details: '',
      totalPages: '',
    },
  });
  const requestType = useWatch({ control, name: 'requestType' });
  const isPdfRequest = requestType !== 'ACCOMPANIMENT';

  const mutation = useMutation({
    mutationFn: ({ data, file }: { data: CreateRequestDto; file?: File }) =>
      requestsApi.createRequest(data, file),
    onSuccess: () => setSubmitted(true),
  });

  const submit = (values: FormValues) => {
    mutation.mutate({
      data: {
        requestType: values.requestType,
        title: values.title.trim(),
        details: values.details.trim(),
        ...(isPdfRequest ? { totalPages: Number(values.totalPages) } : {}),
      },
      file: isPdfRequest ? values.pdfFile?.[0] : undefined,
    });
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl space-y-5 py-20 text-center" role="status">
        <h1 className="text-2xl font-bold text-gray-900">تم إرسال طلبك بنجاح</h1>
        <p className="text-gray-600">أصبح الطلب بانتظار مراجعة الموزع.</p>
        <Button
          variant="outline"
          onClick={() => {
            reset();
            setSubmitted(false);
          }}
        >
          إرسال طلب آخر
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">طلب خدمة جديدة</h1>
        <p className="mt-2 text-gray-600">سيصل طلبك إلى الموزع أولا للمراجعة.</p>
      </div>
      <form
        onSubmit={handleSubmit(submit)}
        className="space-y-6 rounded-2xl bg-white p-6 shadow-sm md:p-8"
        noValidate
      >
        <div className="space-y-1 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
          <p>الاسم: {user?.name}</p>
          <p>الهاتف: <span dir="ltr">{user?.phone}</span></p>
          <p>الموقع: {user?.country}، {user?.city}</p>
        </div>
        <SelectField
          id="requestType"
          label="نوع الطلب"
          required
          error={errors.requestType?.message}
          {...register('requestType')}
        >
          <option value="PDF_TO_WORD">تحويل PDF إلى Word</option>
          <option value="PDF_TO_AUDIO">تحويل PDF إلى تسجيل صوتي</option>
          <option value="ACCOMPANIMENT">طلب مرافقة</option>
        </SelectField>
        <InputField
          id="title"
          label="عنوان الطلب"
          required
          error={errors.title?.message}
          {...register('title')}
        />
        <TextareaField
          id="details"
          label="تفاصيل الطلب"
          required
          error={errors.details?.message}
          {...register('details')}
        />
        {isPdfRequest && (
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              id="pdfFile"
              label="ملف PDF"
              type="file"
              accept="application/pdf,.pdf"
              required
              error={errors.pdfFile?.message}
              {...register('pdfFile')}
            />
            <InputField
              id="totalPages"
              label="عدد الصفحات"
              type="number"
              min={1}
              required
              error={errors.totalPages?.message}
              {...register('totalPages')}
            />
          </div>
        )}
        {mutation.isError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            تعذر إرسال الطلب. تحقق من البيانات وحاول مجددا.
          </p>
        )}
        <Button type="submit" size="lg" loading={mutation.isPending} className="w-full">
          إرسال الطلب
        </Button>
      </form>
    </div>
  );
}
