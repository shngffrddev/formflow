import { RadioGroup } from '@components/RadioGroup'
import { TextInput } from '@components/TextInput'
import { TextareaInput } from '@components/TextareaInput'
import type { FormValues } from '@lib/types'

interface Props {
  values: FormValues
  errors: Record<string, string>
  onChange: (patch: Partial<FormValues>) => void
}

const TOOL_OPTIONS = [
  { value: 'figma',    label: 'Figma' },
  { value: 'sketch',   label: 'Sketch' },
  { value: 'adobe-xd', label: 'Adobe XD' },
  { value: 'other',    label: 'Other' },
]

export function PortfolioStep({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Your Portfolio</h2>
        <p className="text-sm text-slate-500 mt-1">Share examples of your work</p>
      </div>
      <TextInput
        name="portfolioUrl"
        label="Portfolio URL"
        type="url"
        value={(values.portfolioUrl as string) ?? ''}
        onChange={v => onChange({ portfolioUrl: v })}
        error={errors.portfolioUrl}
        placeholder="https://yourportfolio.com"
        required
      />
      <RadioGroup
        name="preferredTool"
        label="Primary design tool"
        value={(values.preferredTool as string) ?? ''}
        onChange={v => onChange({ preferredTool: v })}
        options={TOOL_OPTIONS}
        error={errors.preferredTool}
        required
      />
      <TextareaInput
        name="caseStudyDescription"
        label="Describe a case study"
        value={(values.caseStudyDescription as string) ?? ''}
        onChange={v => onChange({ caseStudyDescription: v })}
        error={errors.caseStudyDescription}
        placeholder="Walk us through a design problem you solved — the brief, your process, and the outcome..."
        hint="Minimum 50 characters"
        rows={5}
        required
      />
    </div>
  )
}
