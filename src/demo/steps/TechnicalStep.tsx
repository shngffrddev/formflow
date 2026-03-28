import { CheckboxGroup } from '@components/CheckboxGroup'
import { RadioGroup } from '@components/RadioGroup'
import { TextInput } from '@components/TextInput'
import type { FormValues } from '@lib/types'

interface Props {
  values: FormValues
  errors: Record<string, string>
  onChange: (patch: Partial<FormValues>) => void
}

const LANGUAGE_OPTIONS = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python',     label: 'Python' },
  { value: 'go',         label: 'Go' },
  { value: 'rust',       label: 'Rust' },
  { value: 'java',       label: 'Java' },
  { value: 'csharp',     label: 'C#' },
  { value: 'ruby',       label: 'Ruby' },
  { value: 'swift',      label: 'Swift' },
  { value: 'kotlin',     label: 'Kotlin' },
]

const OPEN_SOURCE_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no',  label: 'No' },
]

export function TechnicalStep({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Technical Background</h2>
        <p className="text-sm text-slate-500 mt-1">Languages, tools, and open source</p>
      </div>
      <CheckboxGroup
        name="languages"
        label="Languages you're comfortable with"
        value={(values.languages as string[]) ?? []}
        onChange={v => onChange({ languages: v })}
        options={LANGUAGE_OPTIONS}
        error={errors.languages}
        required
      />
      <RadioGroup
        name="hasOpenSource"
        label="Do you have open source contributions?"
        value={(values.hasOpenSource as string) ?? ''}
        onChange={v => onChange({ hasOpenSource: v })}
        options={OPEN_SOURCE_OPTIONS}
        error={errors.hasOpenSource}
        required
      />
      {values.hasOpenSource === 'yes' && (
        <TextInput
          name="githubUrl"
          label="GitHub profile or notable repo"
          type="url"
          value={(values.githubUrl as string) ?? ''}
          onChange={v => onChange({ githubUrl: v })}
          error={errors.githubUrl}
          placeholder="https://github.com/username"
          hint="Optional — share your most relevant work"
        />
      )}
    </div>
  )
}
