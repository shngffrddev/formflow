import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { resolveActiveSteps, validateStep } from './engine'
import { localStorageAdapter } from './persistence'
import type {
  TrekActions,
  TrekState,
  FormValues,
  StepId,
  UseTrekOptions,
  UseTrekReturn,
} from './types'

// ─── Reducer ──────────────────────────────────────────────────────────────────

type InternalState = {
  values: FormValues
  currentIndex: number
  stepErrors: Record<StepId, Record<string, string>>
  completedSteps: Set<StepId>
  isComplete: boolean
}

type Action =
  | { type: 'SET_VALUES'; patch: Partial<FormValues> }
  | { type: 'SET_INDEX'; index: number }
  | { type: 'SET_STEP_ERRORS'; stepId: StepId; errors: Record<string, string> }
  | { type: 'MARK_STEP_COMPLETE'; stepId: StepId }
  | { type: 'COMPLETE_FORM' }
  | { type: 'RESET'; initialValues: FormValues }

function reducer(state: InternalState, action: Action): InternalState {
  switch (action.type) {
    case 'SET_VALUES':
      return { ...state, values: { ...state.values, ...action.patch } }
    case 'SET_INDEX':
      return { ...state, currentIndex: action.index }
    case 'SET_STEP_ERRORS':
      return {
        ...state,
        stepErrors: { ...state.stepErrors, [action.stepId]: action.errors },
      }
    case 'MARK_STEP_COMPLETE': {
      const next = new Set(state.completedSteps)
      next.add(action.stepId)
      return { ...state, completedSteps: next }
    }
    case 'COMPLETE_FORM':
      return { ...state, isComplete: true }
    case 'RESET':
      return {
        values: action.initialValues,
        currentIndex: 0,
        stepErrors: {},
        completedSteps: new Set(),
        isComplete: false,
      }
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTrek(options: UseTrekOptions): UseTrekReturn {
  const {
    formId,
    steps: stepDefs,
    persistence = localStorageAdapter,
    onComplete,
    initialValues = {},
  } = options

  const adapter = persistence ?? localStorageAdapter

  // Load persisted values once on mount
  const hydratedInitial = useMemo(() => {
    const saved = adapter.load(formId)
    return saved ? { ...initialValues, ...saved } : initialValues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [internal, dispatch] = useReducer(reducer, null, () => ({
    values: hydratedInitial,
    currentIndex: 0,
    stepErrors: {},
    completedSteps: new Set<StepId>(),
    isComplete: false,
  }))

  // Persist on every values change
  useEffect(() => {
    if (persistence !== null) {
      adapter.save(formId, internal.values)
    }
  }, [internal.values, formId, adapter, persistence])

  // Derive active steps from current values
  const activeStepIds = useMemo(
    () => resolveActiveSteps(stepDefs, internal.values),
    [stepDefs, internal.values],
  )

  // Clamp index if branching removed the current step
  const currentIndex = Math.min(internal.currentIndex, Math.max(0, activeStepIds.length - 1))

  const currentStepId = activeStepIds[currentIndex] ?? activeStepIds[0] ?? ''

  const currentStepDef = stepDefs.find(s => s.id === currentStepId)
  if (!currentStepDef) {
    throw new Error(`[FormTrek] No step definition found for id "${currentStepId}"`)
  }

  // Build the public TrekState
  const state: TrekState = useMemo(() => {
    const steps = Object.fromEntries(
      stepDefs.map(s => {
        const isActive = s.id === currentStepId
        const isComplete = internal.completedSteps.has(s.id)
        const isSkipped = !activeStepIds.includes(s.id)
        const status = isSkipped
          ? 'skipped' as const
          : isActive
            ? 'active' as const
            : isComplete
              ? 'complete' as const
              : 'pending' as const
        return [
          s.id,
          { id: s.id, status, errors: internal.stepErrors[s.id] ?? {} },
        ]
      }),
    )

    return {
      values: internal.values,
      steps,
      activeStepIds,
      currentIndex,
      currentStepId,
      isFirstStep: currentIndex === 0,
      isLastStep: currentIndex === activeStepIds.length - 1,
      isComplete: internal.isComplete,
    }
  }, [internal, activeStepIds, currentIndex, currentStepId, stepDefs])

  // ─── Actions ───────────────────────────────────────────────────────────────

  const setValues = useCallback((patch: Partial<FormValues>) => {
    dispatch({ type: 'SET_VALUES', patch })
  }, [])

  const validate = useCallback(async (): Promise<Record<string, string>> => {
    const errors = await validateStep(currentStepDef, internal.values)
    dispatch({ type: 'SET_STEP_ERRORS', stepId: currentStepId, errors })
    return errors
  }, [currentStepDef, currentStepId, internal.values])

  const next = useCallback(async (): Promise<boolean> => {
    const errors = await validateStep(currentStepDef, internal.values)

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_STEP_ERRORS', stepId: currentStepId, errors })
      return false
    }

    dispatch({ type: 'SET_STEP_ERRORS', stepId: currentStepId, errors: {} })
    dispatch({ type: 'MARK_STEP_COMPLETE', stepId: currentStepId })

    const nextIndex = currentIndex + 1

    if (nextIndex >= activeStepIds.length) {
      dispatch({ type: 'COMPLETE_FORM' })
      if (persistence !== null) adapter.clear(formId)
      await onComplete?.(internal.values)
      return true
    }

    dispatch({ type: 'SET_INDEX', index: nextIndex })
    return true
  }, [
    currentStepDef, currentStepId, currentIndex,
    activeStepIds.length, internal.values,
    adapter, formId, onComplete, persistence,
  ])

  const back = useCallback(() => {
    if (currentIndex > 0) {
      dispatch({ type: 'SET_INDEX', index: currentIndex - 1 })
    }
  }, [currentIndex])

  const goTo = useCallback((stepId: StepId) => {
    const idx = activeStepIds.indexOf(stepId)
    if (idx !== -1) dispatch({ type: 'SET_INDEX', index: idx })
  }, [activeStepIds])

  const reset = useCallback(() => {
    if (persistence !== null) adapter.clear(formId)
    dispatch({ type: 'RESET', initialValues })
  }, [adapter, formId, initialValues, persistence])

  const actions: TrekActions = useMemo(
    () => ({ next, back, goTo, setValues, reset, validate }),
    [next, back, goTo, setValues, reset, validate],
  )

  return { state, actions, currentStep: currentStepDef }
}
