import { FieldError } from './FieldError'

interface TextareaInputProps {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  placeholder?: string
  required?: boolean
  rows?: number
}

export function TextareaInput({
  name, label, value, onChange, error, hint, placeholder, required, rows = 4,
}: TextareaInputProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-1">{hint}</p>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors resize-none
          focus:ring-2 focus:ring-brand-500 focus:border-brand-500
          ${error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}
      />
      <FieldError message={error} />
    </div>
  )
}
