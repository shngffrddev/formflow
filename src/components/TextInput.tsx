import { FieldError } from './FieldError'

interface TextInputProps {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'date' | 'number'
  placeholder?: string
  hint?: string
  required?: boolean
}

export function TextInput({
  name, label, value, onChange, error, type = 'text',
  placeholder, hint, required,
}: TextInputProps) {
  const errorId = error ? `${name}-error` : undefined

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-500 mb-1">{hint}</p>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-required={required ? true : undefined}
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors
          focus:ring-2 focus:ring-brand-500 focus:border-brand-500
          ${error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}
      />
      <FieldError message={error} id={errorId} />
    </div>
  )
}
