import { RadioGroup } from '@components/RadioGroup'
import { TextInput } from '@components/TextInput'
import type { FormValues } from '@lib/types'

interface Props {
  values: FormValues
  errors: Record<string, string>
  onChange: (patch: Partial<FormValues>) => void
}

const WORK_STYLE_OPTIONS = [
  { value: 'remote-only',  label: 'Remote only',   description: 'I work fully remotely' },
  { value: 'hybrid',       label: 'Hybrid',        description: 'Mix of remote and office' },
  { value: 'office-first', label: 'Office-first',  description: 'Prefer to be in office most days' },
]

const EMPLOYED_OPTIONS = [
  { value: 'yes', label: 'Yes, currently employed' },
  { value: 'no',  label: 'No, currently between roles' },
]

export function ExperienceLevelStep({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Your Experience</h2>
        <p className="text-sm text-slate-500 mt-1">Tell us about your background</p>
      </div>
      <TextInput
        name="yearsExperience"
        label="Years of professional experience"
        type="number"
        value={String(values.yearsExperience ?? '')}
        onChange={v => onChange({ yearsExperience: v === '' ? undefined : Number(v) })}
        error={errors.yearsExperience}
        placeholder="0"
        hint="Round to the nearest year"
        required
      />
      <RadioGroup
        name="workStyle"
        label="Preferred work style"
        value={(values.workStyle as string) ?? ''}
        onChange={v => onChange({ workStyle: v })}
        options={WORK_STYLE_OPTIONS}
        error={errors.workStyle}
        required
      />
      <RadioGroup
        name="currentlyEmployed"
        label="Are you currently employed?"
        value={(values.currentlyEmployed as string) ?? ''}
        onChange={v => onChange({ currentlyEmployed: v })}
        options={EMPLOYED_OPTIONS}
        error={errors.currentlyEmployed}
        required
      />

      {/* Hint about conditional steps */}
      {(values.yearsExperience as number) >= 5 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
          <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z"/>
          </svg>
          <span>We've added a <strong>Compensation</strong> step earlier in your flow — senior roles have budget flexibility to negotiate upfront.</span>
        </div>
      )}
      {values.workStyle === 'remote-only' && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-800">
          <svg className="w-4 h-4 mt-0.5 shrink-0 text-sky-500" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z"/>
          </svg>
          <span>Since you're fully remote, we've removed the <strong>Work Location</strong> step from your flow.</span>
        </div>
      )}
    </div>
  )
}
