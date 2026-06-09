import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { volunteersApi } from '../../api/volunteers';
import { Button } from '../../Components/ui/Button';
import { Phone, MessageCircle } from 'lucide-react';

const INTEREST_LABELS: Record<string, string> = {
  AUDIO_RECORDING: 'تسجيل صوتي',
  WORD_CONVERSION: 'تحويل Word',
  BOOK_TYPING: 'كتابة كتب',
  ACCOMPANIMENT: 'مرافقة',
  GENERAL: 'عام',
};

const CONTACT_LABELS: Record<string, string> = {
  WHATSAPP: 'واتساب',
  FACEBOOK: 'فيسبوك',
  MESSENGER: 'ماسنجر',
};

export default function AdminVolunteers() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-volunteers-list', page],
    queryFn: () => volunteersApi.getAll(page, 20),
  });

  const mutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: any }) => volunteersApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-volunteers-list'] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">المتطوعون</h1>

      {isLoading && (
        <div className="flex justify-center py-12" aria-live="polite" aria-busy="true">
          <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="sr-only">جاري التحميل...</span>
        </div>
      )}

      {data && (
        <>
          <p className="text-sm text-gray-500">{data.total} متطوع</p>
          <ul className="space-y-3" role="list">
            {data.data.map((v: any) => (
              <li key={v.id} className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">{v.name}</p>
                    <p className="text-sm text-gray-500">{v.city}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone size={12} aria-hidden="true" />
                      {v.phone}
                    </p>
                    {v.email && <p className="text-sm text-gray-500">{v.email}</p>}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                    v.contacted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {v.contacted ? 'تم التواصل' : 'لم يُتواصل بعد'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {v.interests?.map((interest: string) => (
                    <span key={interest} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-md">
                      {INTEREST_LABELS[interest] ?? interest}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <MessageCircle size={12} aria-hidden="true" />
                    يفضّل: {CONTACT_LABELS[v.preferredContact] ?? v.preferredContact}
                  </span>
                  <Button
                    size="sm"
                    variant={v.contacted ? 'ghost' : 'secondary'}
                    onClick={() => mutation.mutate({ id: v.id, dto: { contacted: !v.contacted } })}
                    loading={mutation.isPending}
                    aria-label={v.contacted ? `إلغاء تأكيد التواصل مع ${v.name}` : `تأكيد التواصل مع ${v.name}`}
                  >
                    {v.contacted ? 'إلغاء التواصل' : 'تأكيد التواصل'}
                  </Button>
                </div>

                {v.notes && (
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">ملاحظة: {v.notes}</p>
                )}
              </li>
            ))}
          </ul>

          {data.total > 20 && (
            <nav className="flex justify-center gap-2" aria-label="التنقل بين الصفحات">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>السابق</Button>
              <span className="flex items-center px-3 text-sm text-gray-600">صفحة {page}</span>
              <Button variant="outline" size="sm" disabled={page >= Math.ceil(data.total / 20)} onClick={() => setPage((p) => p + 1)}>التالي</Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
