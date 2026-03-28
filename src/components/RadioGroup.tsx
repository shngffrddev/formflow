import { FieldError } from './FieldError'

interface Option {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  error?: string
  hint?: string
  required?: boolean
}

export function RadioGroup({
  name, label, value, onChange, options, error, hint, required,
}: RadioGroupProps) {
  return (
    <div>
      <fieldset>
        <legend className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>
        {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
        <div className="space-y-2">
          {options.map(opt => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${value === opt.value
                  ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                  : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="mt-0.5 accent-brand-600"
              />
              <span>
                <span className="text-sm font-medium text-slate-800 block">{opt.label}</span>
                {opt.description && (
                  <span className="text-xs text-slate-500 block mt-0.5">{opt.description}</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <FieldError message={error} />
    </div>
  )
}
