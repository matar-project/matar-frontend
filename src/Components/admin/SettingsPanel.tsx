import { useState } from 'react';
import type { PublicSettings } from '../../api/settings';
import { useUpdateSettingsMutation } from '../../Hooks/admin/mutations/useUpdateSettingsMutation';
import { useAdminSettingsQuery } from '../../Hooks/admin/queries/useAdminSettingsQuery';
import { Button } from '../ui/Button';
import { InputField } from '../ui/FormField';

function SettingsForm({ settings }: { settings: PublicSettings }) {
  const [form, setForm] = useState({
    whatsappLink: settings.whatsappLink ?? '',
    facebookLink: settings.facebookLink ?? '',
    messengerLink: settings.messengerLink ?? '',
  });
  const [saved, setSaved] = useState(false);
  const updateSettings = useUpdateSettingsMutation(() => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  });

  return (
    <section
      className="space-y-5 rounded-xl bg-white p-6 shadow-sm"
      aria-label="إعدادات روابط التواصل"
    >
      <h2 className="text-lg font-semibold text-gray-900">روابط التواصل</h2>
      <InputField
        id="whatsapp"
        label="رابط واتساب"
        type="url"
        placeholder="https://wa.me/..."
        value={form.whatsappLink}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            whatsappLink: event.target.value,
          }))
        }
      />
      <InputField
        id="facebook"
        label="رابط فيسبوك"
        type="url"
        placeholder="https://facebook.com/..."
        value={form.facebookLink}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            facebookLink: event.target.value,
          }))
        }
      />
      <InputField
        id="messenger"
        label="رابط ماسنجر"
        type="url"
        placeholder="https://m.me/..."
        value={form.messengerLink}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            messengerLink: event.target.value,
          }))
        }
      />
      {saved && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          تم حفظ الإعدادات بنجاح
        </div>
      )}
      <Button
        onClick={() => updateSettings.mutate(form)}
        loading={updateSettings.isPending}
      >
        حفظ الإعدادات
      </Button>
    </section>
  );
}

export function SettingsPanel() {
  const { data, isLoading } = useAdminSettingsQuery();

  if (isLoading || !data) {
    return (
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">جاري التحميل...</p>
      </section>
    );
  }

  return <SettingsForm settings={data} />;
}
