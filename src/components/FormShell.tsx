import type { ReactNode } from 'react'
import type { TrekActions, TrekState, StepDefinition } from '@lib/types'
import { ProgressBar } from './ProgressBar'
import { StepIndicator } from './StepIndicator'
import { NavigationButtons } from './NavigationButtons'
import { Logo } from './Logo'

interface FormShellProps {
  state: TrekState
  stepDefs: StepDefinition[]
  actions: TrekActions
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
            <Logo size={28} />
            <span className="text-base font-bold text-slate-800 tracking-tight">FormTrek</span>
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
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2">Your progress</p>
              <StepIndicator state={state} stepDefs={stepDefs} onGoTo={actions.goTo} />
            </div>
          </aside>

          {/* Main card */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-200/60 overflow-hidden">
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
