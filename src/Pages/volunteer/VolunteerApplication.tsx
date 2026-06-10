import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { volunteersApi, type CreateVolunteerDto } from '../../api/volunteers';
import { Button } from '../../Components/ui/Button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../Hooks/auth/UseAuth';

const INTERESTS = [
  { value: 'AUDIO_RECORDING', label: 'التسجيل الصوتي' },
  { value: 'WORD_CONVERSION', label: 'التحويل لملف Word' },
  { value: 'BOOK_TYPING', label: 'كتابة الكتب' },
  { value: 'ACCOMPANIMENT', label: 'خدمة المرافقة' },
  { value: 'GENERAL', label: 'تطوع عام' },
];

const schema = z.object({
  interests: z.array(z.string()).min(1, 'اختر مجال تطوع واحداً على الأقل'),
});

type FormValues = z.infer<typeof schema>;

export default function VolunteerApplication() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { interests: [] },
  });

  const toggleInterest = (value: string) => {
    const next = selectedInterests.includes(value)
      ? selectedInterests.filter((interest) => interest !== value)
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
        <div className="text-6xl" aria-hidden="true">✓</div>
        <h2 className="text-2xl font-bold text-gray-900">شكراً لانضمامك إلى مطر!</h2>
        <p className="text-gray-600">سيتواصل معك الفريق قريباً عبر واتساب لتنسيق بدء التطوع.</p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>تحديث مجالات التطوع</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">تطوع معنا</h1>
        <p className="text-gray-600">اختر المجالات التي ترغب بالمساهمة فيها</p>
      </header>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6"
        noValidate
        aria-label="نموذج تسجيل المتطوع"
      >
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 space-y-1">
          <p><span className="font-medium">الاسم:</span> {user?.name}</p>
          <p><span className="font-medium">الهاتف:</span> <span dir="ltr">{user?.phone}</span></p>
          <p><span className="font-medium">الدولة والمدينة:</span> {user?.country}، {user?.city}</p>
          <p className="text-gray-500">سنستخدم هذه البيانات للتواصل معك عبر واتساب.</p>
        </div>

        <div className="space-y-2">
          <span className="block text-sm font-medium text-gray-700">
            مجالات التطوع <span className="text-red-500 mr-1" aria-hidden="true">*</span>
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="مجالات التطوع">
            {INTERESTS.map((interest) => {
              const selected = selectedInterests.includes(interest.value);
              return (
                <button
                  key={interest.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleInterest(interest.value)}
                  className={cn(
                    'px-4 py-2 rounded-full border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]',
                    selected
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400',
                  )}
                >
                  {interest.label}
                </button>
              );
            })}
          </div>
          {errors.interests && (
            <p className="text-sm text-red-600" role="alert">{errors.interests.message}</p>
          )}
        </div>

        {mutation.isError && (
          <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            تعذر إرسال النموذج. تأكد من اكتمال بيانات الاتصال في حسابك ثم حاول مجدداً.
          </div>
        )}

        <Button type="submit" size="lg" loading={mutation.isPending} className="w-full">
          سجّل كمتطوع
        </Button>
      </form>
    </div>
  );
}
