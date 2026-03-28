interface ProgressBarProps {
  currentIndex: number
  total: number
}

export function ProgressBar({ currentIndex, total }: ProgressBarProps) {
  const pct = total <= 1 ? 100 : Math.round((currentIndex / (total - 1)) * 100)
  return (
    <div className="px-8 pt-5 pb-1">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          Step {currentIndex + 1} of {total}
        </span>
        <span className="text-[11px] font-semibold text-brand-600">{pct}%</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
