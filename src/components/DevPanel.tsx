import { useState } from 'react'
import { evaluateCondition } from '@lib/engine'
import type { FormFlowState, StepDefinition } from '@lib/types'

interface DevPanelProps {
  state: FormFlowState
  stepDefs: StepDefinition[]
}

export function DevPanel({ state, stepDefs }: DevPanelProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'state' | 'conditions'>('conditions')

  if (!import.meta.env.DEV) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs">
      {open ? (
        <div className="bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-700 w-96 max-h-[70vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 shrink-0">
            <span className="text-slate-400 font-semibold tracking-wide">FormFlow DevPanel</span>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-white text-base leading-none"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700 shrink-0">
            {(['conditions', 'state'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-medium transition-colors
                  ${tab === t ? 'text-white border-b-2 border-brand-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t === 'conditions' ? 'Branching' : 'State'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-3">
            {tab === 'conditions' && (
              <div className="space-y-1">
                {stepDefs.map(step => {
                  const isActive = state.activeStepIds.includes(step.id)
                  const isCurrent = step.id === state.currentStepId
                  const condResult = step.condition
                    ? evaluateCondition(step.condition, state.values)
                    : null

                  return (
                    <div
                      key={step.id}
                      className={`rounded p-2 border ${
                        isCurrent
                          ? 'border-brand-500 bg-brand-500/10'
                          : isActive
                            ? 'border-emerald-700 bg-emerald-900/20'
                            : 'border-slate-700 bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold ${isCurrent ? 'text-brand-400' : isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {step.title}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isCurrent ? 'bg-brand-500 text-white' :
                          isActive ? 'bg-emerald-700 text-emerald-100' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {isCurrent ? 'active' : isActive ? 'visible' : 'hidden'}
                        </span>
                      </div>
                      {step.condition ? (
                        <div className="text-slate-400 leading-relaxed">
                          <span className="text-slate-500">condition: </span>
                          <code className="text-slate-300">
                            {JSON.stringify(step.condition)}
                          </code>
                          <span className={`ml-2 font-bold ${condResult ? 'text-emerald-400' : 'text-red-400'}`}>
                            → {condResult ? 'true' : 'false'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600">always shown</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {tab === 'state' && (
              <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap break-all">
                {JSON.stringify(
                  {
                    currentStepId: state.currentStepId,
                    currentIndex: state.currentIndex,
                    activeStepIds: state.activeStepIds,
                    isComplete: state.isComplete,
                    values: state.values,
                  },
                  null,
                  2,
                )}
              </pre>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-slate-900 text-slate-300 hover:text-white border border-slate-700 rounded-lg px-3 py-2 shadow-xl flex items-center gap-2 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4.75a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm.75 6.5a1 1 0 110-2 1 1 0 010 2z"/>
          </svg>
          DevPanel
        </button>
      )}
    </div>
  )
}
