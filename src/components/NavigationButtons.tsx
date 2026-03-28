interface NavigationButtonsProps {
  isFirstStep: boolean
  isLastStep: boolean
  onBack: () => void
  onNext: () => Promise<boolean>
  isSubmitting?: boolean
}

export function NavigationButtons({
  isFirstStep, isLastStep, onBack, onNext, isSubmitting,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-8">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-500
          rounded-lg hover:text-slate-800 hover:bg-slate-100
          disabled:opacity-0 disabled:pointer-events-none transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold
          hover:bg-brand-700 active:scale-[0.97] transition-all disabled:opacity-60 disabled:cursor-not-allowed
          shadow-sm shadow-brand-200"
      >
        {isSubmitting ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : null}
        {isLastStep ? 'Submit Application' : 'Continue'}
        {!isSubmitting && !isLastStep && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        )}
      </button>
    </div>
  )
}
