import { SelectInput } from '@components/SelectInput'
import { TextInput } from '@components/TextInput'
import type { FormValues } from '@lib/types'

interface Props {
  values: FormValues
  errors: Record<string, string>
  onChange: (patch: Partial<FormValues>) => void
}

const REFERRAL_OPTIONS = [
  { value: 'linkedin',        label: 'LinkedIn' },
  { value: 'job-board',       label: 'Job board (Indeed, Glassdoor, etc.)' },
  { value: 'referral',        label: 'Employee referral' },
  { value: 'company-website', label: 'Acme Corp website' },
  { value: 'other',           label: 'Other' },
]

export function AvailabilityStep({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Availability</h2>
        <p className="text-sm text-slate-500 mt-1">When can you start?</p>
      </div>
      <TextInput
        name="noticePeriodWeeks"
        label="Notice period (weeks)"
        type="number"
        value={String(values.noticePeriodWeeks ?? '')}
        onChange={v => onChange({ noticePeriodWeeks: v === '' ? undefined : Number(v) })}
        error={errors.noticePeriodWeeks}
        placeholder="4"
        hint="Enter 0 if you can start immediately"
        required
      />
      <TextInput
        name="startDate"
        label="Earliest start date"
        type="date"
        value={(values.startDate as string) ?? ''}
        onChange={v => onChange({ startDate: v })}
        error={errors.startDate}
        required
      />
      <SelectInput
        name="referralSource"
        label="How did you hear about this role?"
        value={(values.referralSource as string) ?? ''}
        onChange={v => onChange({ referralSource: v })}
        options={REFERRAL_OPTIONS}
        error={errors.referralSource}
        required
      />
    </div>
  )
}
