interface ProgressBarProps {
  currentIndex: number
  total: number
}

export function ProgressBar({ currentIndex, total }: ProgressBarProps) {
  const pct = total <= 1 ? 100 : Math.round(((currentIndex + 1) / total) * 100)
  return (
    <div className="px-8 pt-5 pb-1">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider" aria-hidden="true">
          Step {currentIndex + 1} of {total}
        </span>
        <span className="text-[11px] font-semibold text-brand-600" aria-hidden="true">{pct}%</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${currentIndex + 1} of ${total}, ${pct}% complete`}
          className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
