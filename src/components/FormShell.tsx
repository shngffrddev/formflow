import type { ReactNode } from 'react'
import type { FormFlowActions, FormFlowState, StepDefinition } from '@lib/types'
import { ProgressBar } from './ProgressBar'
import { StepIndicator } from './StepIndicator'
import { NavigationButtons } from './NavigationButtons'

interface FormShellProps {
  state: FormFlowState
  stepDefs: StepDefinition[]
  actions: FormFlowActions
  children: ReactNode
  isSubmitting?: boolean
}

export function FormShell({ state, stepDefs, actions, children, isSubmitting }: FormShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3h12a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v6h10V5H3zm1 1h3v1H4V6zm0 2h5v1H4V8zm0 2h4v1H4v-1z"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">FormFlow</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Software Engineer Application</h1>
          <p className="text-sm text-slate-500 mt-1">Acme Corp · {state.activeStepIds.length} steps · takes ~5 minutes</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-52 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 sticky top-8">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Progress</p>
              <StepIndicator state={state} stepDefs={stepDefs} onGoTo={actions.goTo} />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <ProgressBar currentIndex={state.currentIndex} total={state.activeStepIds.length} />
              {children}
              {!state.isComplete && (
                <NavigationButtons
                  isFirstStep={state.isFirstStep}
                  isLastStep={state.isLastStep}
                  onBack={actions.back}
                  onNext={actions.next}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
