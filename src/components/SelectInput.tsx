import { FieldError } from './FieldError'

interface Option {
  value: string
  label: string
}

interface SelectInputProps {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  error?: string
  hint?: string
  required?: boolean
  placeholder?: string
}

export function SelectInput({
  name, label, value, onChange, options, error, hint, required, placeholder = 'Select an option',
}: SelectInputProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-1">{hint}</p>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors bg-white
          focus:ring-2 focus:ring-brand-500 focus:border-brand-500
          ${!value ? 'text-slate-400' : 'text-slate-900'}
          ${error ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400'}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  )
}
