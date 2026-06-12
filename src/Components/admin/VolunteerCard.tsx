import { Mail, MapPin, Phone } from 'lucide-react';
import type { VolunteerUser } from '../../api/volunteers';

export function VolunteerCard({ volunteer }: { volunteer: VolunteerUser }) {
  return (
    <li className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
      <div>
        <p className="font-semibold text-gray-900">{volunteer.name}</p>
        <p className="mt-1 text-xs text-gray-400">
          انضم في{' '}
          {new Date(volunteer.createdAt).toLocaleDateString(
            'ar-JO-u-nu-latn',
          )}
        </p>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <Phone size={15} aria-hidden="true" />
          <bdi dir="ltr">{volunteer.phone ?? '-'}</bdi>
        </p>
        <p className="flex items-center gap-2">
          <Mail size={15} aria-hidden="true" />
          {volunteer.email}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={15} aria-hidden="true" />
          {[volunteer.country, volunteer.city].filter(Boolean).join('، ') ||
            '-'}
        </p>
      </div>
    </li>
  );
}
