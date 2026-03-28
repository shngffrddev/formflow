import { RadioGroup } from '@components/RadioGroup'
import type { FormValues } from '@lib/types'

interface Props {
  values: FormValues
  errors: Record<string, string>
  onChange: (patch: Partial<FormValues>) => void
}

const OFFICE_OPTIONS = [
  { value: 'new-york',  label: 'New York',  description: 'NYC HQ · Hudson Yards' },
  { value: 'london',    label: 'London',    description: 'UK office · Shoreditch' },
  { value: 'berlin',    label: 'Berlin',    description: 'EU office · Mitte' },
  { value: 'toronto',   label: 'Toronto',   description: 'Canada office · King West' },
  { value: 'flexible',  label: 'Flexible',  description: 'Any of the above' },
]

const RELOCATE_OPTIONS = [
  { value: 'yes', label: 'Yes, open to relocation' },
  { value: 'no',  label: 'No, would not relocate' },
]

export function LocationPreferenceStep({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Work Location</h2>
        <p className="text-sm text-slate-500 mt-1">Office and relocation preferences</p>
      </div>
      <RadioGroup
        name="preferredOffice"
        label="Preferred office location"
        value={(values.preferredOffice as string) ?? ''}
        onChange={v => onChange({ preferredOffice: v })}
        options={OFFICE_OPTIONS}
        error={errors.preferredOffice}
        required
      />
      <RadioGroup
        name="willingToRelocate"
        label="Are you willing to relocate?"
        value={(values.willingToRelocate as string) ?? ''}
        onChange={v => onChange({ willingToRelocate: v })}
        options={RELOCATE_OPTIONS}
        error={errors.willingToRelocate}
        required
      />
    </div>
  )
}
