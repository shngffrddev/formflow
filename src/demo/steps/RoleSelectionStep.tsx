import { RadioGroup } from '@components/RadioGroup'
import type { FormValues } from '@lib/types'

interface Props {
  values: FormValues
  errors: Record<string, string>
  onChange: (patch: Partial<FormValues>) => void
}

const ROLE_OPTIONS = [
  { value: 'frontend-engineer',  label: 'Frontend Engineer',  description: 'React, TypeScript, CSS' },
  { value: 'backend-engineer',   label: 'Backend Engineer',   description: 'APIs, databases, infrastructure' },
  { value: 'fullstack-engineer', label: 'Fullstack Engineer', description: 'End-to-end product work' },
  { value: 'product-manager',    label: 'Product Manager',    description: 'Strategy, roadmaps, delivery' },
  { value: 'product-designer',   label: 'Product Designer',   description: 'UI/UX, design systems' },
  { value: 'ux-researcher',      label: 'UX Researcher',      description: 'User interviews, testing, synthesis' },
]

export function RoleSelectionStep({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Role & Team</h2>
        <p className="text-sm text-slate-500 mt-1">Which position are you applying for?</p>
      </div>
      <RadioGroup
        name="role"
        label="Select a role"
        value={(values.role as string) ?? ''}
        onChange={v => onChange({ role: v })}
        options={ROLE_OPTIONS}
        error={errors.role}
        required
      />
    </div>
  )
}
