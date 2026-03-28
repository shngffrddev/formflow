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
        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-0 disabled:pointer-events-none transition-all"
      >
        ← Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold
          hover:bg-brand-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {isSubmitting && (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {isLastStep ? 'Submit Application' : 'Continue →'}
      </button>
    </div>
  )
}
