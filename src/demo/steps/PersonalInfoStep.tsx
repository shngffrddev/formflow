import { TextInput } from '@components/TextInput'
import type { FormValues } from '@lib/types'

interface Props {
  values: FormValues
  errors: Record<string, string>
  onChange: (patch: Partial<FormValues>) => void
}

export function PersonalInfoStep({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">About You</h2>
        <p className="text-sm text-slate-500 mt-1">Basic contact information</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextInput
          name="firstName"
          label="First name"
          value={(values.firstName as string) ?? ''}
          onChange={v => onChange({ firstName: v })}
          error={errors.firstName}
          required
        />
        <TextInput
          name="lastName"
          label="Last name"
          value={(values.lastName as string) ?? ''}
          onChange={v => onChange({ lastName: v })}
          error={errors.lastName}
          required
        />
      </div>
      <TextInput
        name="email"
        label="Email address"
        type="email"
        value={(values.email as string) ?? ''}
        onChange={v => onChange({ email: v })}
        error={errors.email}
        placeholder="you@example.com"
        required
      />
      <TextInput
        name="phone"
        label="Phone number"
        type="tel"
        value={(values.phone as string) ?? ''}
        onChange={v => onChange({ phone: v })}
        error={errors.phone}
        placeholder="+1 555 000 0000"
        hint="Optional"
      />
    </div>
  )
}
