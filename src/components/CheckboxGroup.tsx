import { FieldError } from './FieldError'

interface Option {
  value: string
  label: string
}

interface CheckboxGroupProps {
  name: string
  label: string
  value: string[]
  onChange: (value: string[]) => void
  options: Option[]
  error?: string
  hint?: string
  required?: boolean
}

export function CheckboxGroup({
  name, label, value, onChange, options, error, hint, required,
}: CheckboxGroupProps) {
  function toggle(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter(v => v !== optValue))
    } else {
      onChange([...value, optValue])
    }
  }

  return (
    <div>
      <fieldset>
        <legend className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>
        {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
        <div className="grid grid-cols-2 gap-2">
          {options.map(opt => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm
                ${value.includes(opt.value)
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'}`}
            >
              <input
                type="checkbox"
                name={name}
                value={opt.value}
                checked={value.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="accent-brand-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
      <FieldError message={error} />
    </div>
  )
}
