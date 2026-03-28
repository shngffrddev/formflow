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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="5" height="5" rx="1" />
                <rect x="9" y="2" width="5" height="5" rx="1" opacity=".7" />
                <rect x="2" y="9" width="5" height="5" rx="1" opacity=".7" />
                <rect x="9" y="9" width="5" height="5" rx="1" opacity=".4" />
              </svg>
            </div>
            <span className="text-base font-bold text-slate-800 tracking-tight">FormFlow</span>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Demo</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Software Engineer Application</h1>
          <p className="text-sm text-slate-400">
            Acme Corp &middot; {state.activeStepIds.length} steps &middot; takes ~5 minutes
          </p>
        </div>

        <div className="flex gap-5">
          {/* Sidebar */}
          <aside className="hidden md:block w-52 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100 p-3 sticky top-8">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">Your progress</p>
              <StepIndicator state={state} stepDefs={stepDefs} onGoTo={actions.goTo} />
            </div>
          </aside>

          {/* Main card */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100 overflow-hidden">
              <ProgressBar currentIndex={state.currentIndex} total={state.activeStepIds.length} />
              <div className="p-8">
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
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
