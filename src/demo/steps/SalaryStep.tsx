import { SelectInput } from '@components/SelectInput'
import { TextInput } from '@components/TextInput'
import type { FormValues } from '@lib/types'

interface Props {
  values: FormValues
  errors: Record<string, string>
  onChange: (patch: Partial<FormValues>) => void
}

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
]

export function SalaryStep({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Compensation</h2>
        <p className="text-sm text-slate-500 mt-1">Your salary expectations</p>
      </div>
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
        This step appears early because you have 5+ years of experience — we discuss compensation upfront to avoid wasting your time.
      </div>
      <SelectInput
        name="currency"
        label="Currency"
        value={(values.currency as string) ?? ''}
        onChange={v => onChange({ currency: v })}
        options={CURRENCY_OPTIONS}
        error={errors.currency}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <TextInput
          name="salaryMin"
          label="Minimum expectation"
          type="number"
          value={String(values.salaryMin ?? '')}
          onChange={v => onChange({ salaryMin: v === '' ? undefined : Number(v) })}
          error={errors.salaryMin}
          placeholder="80000"
          required
        />
        <TextInput
          name="salaryMax"
          label="Maximum expectation"
          type="number"
          value={String(values.salaryMax ?? '')}
          onChange={v => onChange({ salaryMax: v === '' ? undefined : Number(v) })}
          error={errors.salaryMax}
          placeholder="120000"
          required
        />
      </div>
    </div>
  )
}
