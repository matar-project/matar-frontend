import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  id: string;
}

type InputFieldProps = FieldProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaFieldProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;
type SelectFieldProps = FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode };

const baseInput = 'w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-base min-h-[48px]';

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, required, hint, id, className, ...props }, ref) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 mr-1" aria-hidden="true">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-500" id={`${id}-hint`}>{hint}</p>}
      <input
        ref={ref}
        id={id}
        aria-required={required}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={error ? 'true' : undefined}
        className={cn(baseInput, error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white', className)}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 flex items-center gap-1" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  ),
);
InputField.displayName = 'InputField';

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, required, hint, id, className, ...props }, ref) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 mr-1" aria-hidden="true">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-500" id={`${id}-hint`}>{hint}</p>}
      <textarea
        ref={ref}
        id={id}
        aria-required={required}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={error ? 'true' : undefined}
        rows={4}
        className={cn(baseInput, 'resize-y min-h-[100px]', error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white', className)}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  ),
);
TextareaField.displayName = 'TextareaField';

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, required, hint, id, className, children, ...props }, ref) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 mr-1" aria-hidden="true">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-500" id={`${id}-hint`}>{hint}</p>}
      <select
        ref={ref}
        id={id}
        aria-required={required}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={error ? 'true' : undefined}
        className={cn(baseInput, 'cursor-pointer', error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white', className)}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  ),
);
SelectField.displayName = 'SelectField';
