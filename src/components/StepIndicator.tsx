import type { FormFlowState, StepDefinition, StepId } from '@lib/types'

interface StepIndicatorProps {
  state: FormFlowState
  stepDefs: StepDefinition[]
  onGoTo: (id: StepId) => void
}

export function StepIndicator({ state, stepDefs, onGoTo }: StepIndicatorProps) {
  const activeSteps = state.activeStepIds
    .map(id => stepDefs.find(s => s.id === id))
    .filter(Boolean) as StepDefinition[]

  return (
    <nav aria-label="Form steps">
      <ul className="space-y-1">
        {activeSteps.map((step, idx) => {
          const stepState = state.steps[step.id]
          const status = stepState?.status ?? 'pending'
          const isCurrent = step.id === state.currentStepId
          const isComplete = status === 'complete'
          const canClick = isComplete

          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={!canClick}
                onClick={() => canClick && onGoTo(step.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                  ${isCurrent ? 'bg-brand-50 text-brand-700' : ''}
                  ${isComplete ? 'cursor-pointer hover:bg-slate-100' : 'cursor-default'}
                  ${!isCurrent && !isComplete ? 'text-slate-400' : ''}`}
              >
                {/* Badge */}
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                  ${isCurrent ? 'bg-brand-500 text-white' : ''}
                  ${isComplete && !isCurrent ? 'bg-emerald-500 text-white' : ''}
                  ${!isCurrent && !isComplete ? 'bg-slate-200 text-slate-500' : ''}`}
                >
                  {isComplete && !isCurrent ? (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1.5,6 4.5,9 10.5,3" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </span>

                {/* Label */}
                <span className={`text-sm truncate ${isCurrent ? 'font-semibold' : 'font-normal'}`}>
                  {step.title}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
