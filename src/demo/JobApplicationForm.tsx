import { useState } from 'react'
import { useFormFlow } from '@lib/useFormFlow'
import { FormShell } from '@components/FormShell'
import { DevPanel } from '@components/DevPanel'
import { steps } from './config/steps'
import { PersonalInfoStep }       from './steps/PersonalInfoStep'
import { RoleSelectionStep }      from './steps/RoleSelectionStep'
import { ExperienceLevelStep }    from './steps/ExperienceLevelStep'
import { TechnicalStep }          from './steps/TechnicalStep'
import { PortfolioStep }          from './steps/PortfolioStep'
import { SalaryStep }             from './steps/SalaryStep'
import { LocationPreferenceStep } from './steps/LocationPreferenceStep'
import { AvailabilityStep }       from './steps/AvailabilityStep'
import { ReviewStep }             from './steps/ReviewStep'

export function JobApplicationForm() {
  const [submitting, setSubmitting] = useState(false)

  const { state, actions, currentStep } = useFormFlow({
    formId: 'job-application',
    steps,
    onComplete: async () => {
      setSubmitting(true)
      // Simulate a network request
      await new Promise(r => setTimeout(r, 1200))
      setSubmitting(false)
    },
  })

  const stepErrors = state.steps[currentStep.id]?.errors ?? {}

  function renderStep() {
    const props = {
      values: state.values,
      errors: stepErrors,
      onChange: actions.setValues,
    }

    switch (currentStep.id) {
      case 'personal-info':      return <PersonalInfoStep {...props} />
      case 'role-selection':     return <RoleSelectionStep {...props} />
      case 'experience-level':   return <ExperienceLevelStep {...props} />
      case 'technical':          return <TechnicalStep {...props} />
      case 'portfolio':          return <PortfolioStep {...props} />
      case 'salary':             return <SalaryStep {...props} />
      case 'location-preference':return <LocationPreferenceStep {...props} />
      case 'availability':       return <AvailabilityStep {...props} />
      case 'review':
        return <ReviewStep state={state} stepDefs={steps} onGoTo={actions.goTo} />
      default:
        return <p className="text-slate-500">Unknown step: {currentStep.id}</p>
    }
  }

  if (state.isComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application submitted!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Thanks for applying to Acme Corp. We'll review your application and get back to you within 5 business days.
          </p>
          <button
            onClick={actions.reset}
            className="px-5 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            Start a new application
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <FormShell state={state} stepDefs={steps} actions={actions} isSubmitting={submitting}>
        <div key={currentStep.id}>
          {renderStep()}
        </div>
      </FormShell>
      <DevPanel state={state} stepDefs={steps} />
    </>
  )
}
