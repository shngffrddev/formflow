import type { TrekState, FormValues, StepDefinition, StepId } from '@lib/types'

interface Props {
  state: TrekState
  stepDefs: StepDefinition[]
  onGoTo: (id: StepId) => void
}

const FIELD_LABELS: Record<string, string> = {
  firstName:            'First name',
  lastName:             'Last name',
  email:                'Email',
  phone:                'Phone',
  role:                 'Role',
  yearsExperience:      'Years of experience',
  workStyle:            'Work style',
  currentlyEmployed:    'Currently employed',
  languages:            'Languages',
  hasOpenSource:        'Open source contributions',
  githubUrl:            'GitHub URL',
  portfolioUrl:         'Portfolio URL',
  preferredTool:        'Preferred tool',
  caseStudyDescription: 'Case study',
  currency:             'Currency',
  salaryMin:            'Min salary',
  salaryMax:            'Max salary',
  preferredOffice:      'Preferred office',
  willingToRelocate:    'Willing to relocate',
  noticePeriodWeeks:    'Notice period (weeks)',
  startDate:            'Start date',
  referralSource:       'How you heard about us',
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

export function ReviewStep({ state, stepDefs, onGoTo }: Props) {
  const completedSteps = state.activeStepIds
    .map(id => stepDefs.find(s => s.id === id))
    .filter(Boolean)
    .filter(s => s!.id !== 'review') as StepDefinition[]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Review & Submit</h2>
        <p className="text-sm text-slate-500 mt-1">Check everything before you apply</p>
      </div>

      {completedSteps.map(step => {
        const stepSchema = step.schema
        if (!stepSchema) return null

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawSchema = (stepSchema as any)._def?.schema ?? stepSchema
        const shape: Record<string, unknown> = rawSchema.shape ?? {}
        const fields = Object.keys(shape)

        const hasContent = fields.some(f => {
          const v = state.values[f]
          return v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)
        })

        if (!hasContent) return null

        return (
          <div key={step.id} className="rounded-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-700">{step.title}</span>
              <button
                type="button"
                onClick={() => onGoTo(step.id)}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                Edit
              </button>
            </div>
            <dl className="divide-y divide-slate-100">
              {fields.map(field => {
                const value = state.values[field] as FormValues[string]
                const label = FIELD_LABELS[field] ?? field
                const formatted = formatValue(value)
                if (formatted === '—' && !value) return null
                return (
                  <div key={field} className="flex gap-4 px-4 py-2.5">
                    <dt className="text-xs text-slate-500 w-40 shrink-0 pt-0.5">{label}</dt>
                    <dd className="text-sm text-slate-800 break-words min-w-0">{formatted}</dd>
                  </div>
                )
              })}
            </dl>
          </div>
        )
      })}
    </div>
  )
}
