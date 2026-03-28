interface ProgressBarProps {
  currentIndex: number
  total: number
}

export function ProgressBar({ currentIndex, total }: ProgressBarProps) {
  const pct = total <= 1 ? 100 : Math.round((currentIndex / (total - 1)) * 100)
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
        Step {currentIndex + 1} of {total}
      </span>
    </div>
  )
}
