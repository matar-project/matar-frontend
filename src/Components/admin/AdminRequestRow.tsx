import { useState } from 'react';
import type {
  AdminRequest,
  UpdateAdminRequestDto,
} from '../../api/requests';
import { REQUEST_STATUS_OPTIONS } from '../../constants/admin.constants';
import { Button } from '../ui/Button';
import { SelectField } from '../ui/FormField';
import { StatusBadge } from '../ui/StatusBadge';

interface AdminRequestRowProps {
  request: AdminRequest;
  onUpdate: (id: number, dto: UpdateAdminRequestDto) => void;
}

export function AdminRequestRow({
  request,
  onUpdate,
}: AdminRequestRowProps) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(request.status);
  const [notes, setNotes] = useState(request.notes ?? '');

  const save = () => {
    onUpdate(request.id, { status, notes });
    setEditing(false);
  };

  return (
    <li className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="font-semibold text-gray-900">{request.fullName}</p>
          <p className="text-sm text-gray-500">
            <bdi dir="ltr">{request.phone}</bdi>
            {request.email ? ` · ${request.email}` : ''} · {request.city}
          </p>
          <p className="text-xs text-primary-600">{request.requestType}</p>
          {request.bookName && (
            <p className="text-sm text-gray-700">
              اسم الكتاب: {request.bookName}
            </p>
          )}
        </div>
        <StatusBadge status={request.status} />
      </div>

      <p className="text-sm leading-relaxed text-gray-700">
        {request.details}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {new Date(request.createdAt).toLocaleDateString('ar-JO-u-nu-latn')}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditing((current) => !current)}
        >
          {editing ? 'إلغاء' : 'تعديل'}
        </Button>
      </div>

      {editing && (
        <div className="space-y-3 border-t border-gray-100 pt-3">
          <SelectField
            id={`status-${request.id}`}
            label="الحالة"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {REQUEST_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <div className="space-y-1">
            <label
              htmlFor={`notes-${request.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              الملاحظات
            </label>
            <textarea
              id={`notes-${request.id}`}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <Button size="sm" onClick={save}>
            حفظ
          </Button>
        </div>
      )}
    </li>
  );
}
