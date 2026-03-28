import type { ZodTypeAny } from 'zod'

// ─── Identifiers ──────────────────────────────────────────────────────────────

export type StepId = string

// ─── Field Values ─────────────────────────────────────────────────────────────

export type FieldValue = string | number | boolean | string[] | null | undefined

export type FormValues = Record<string, FieldValue>

// ─── Branching Conditions ─────────────────────────────────────────────────────
//
// Conditions are plain serialisable objects — no functions, no JSX, no closures.
// This keeps step configs JSON-serialisable and inspectable in the DevPanel.

export type SimpleCondition =
  | { op: 'eq';     field: string; value: FieldValue }
  | { op: 'neq';    field: string; value: FieldValue }
  | { op: 'gt';     field: string; value: number }
  | { op: 'gte';    field: string; value: number }
  | { op: 'lt';     field: string; value: number }
  | { op: 'lte';    field: string; value: number }
  | { op: 'in';     field: string; value: FieldValue[] }
  | { op: 'notIn';  field: string; value: FieldValue[] }
  | { op: 'truthy'; field: string }
  | { op: 'falsy';  field: string }

export type CompoundCondition =
  | { op: 'and'; conditions: Condition[] }
  | { op: 'or';  conditions: Condition[] }
  | { op: 'not'; condition: Condition }

export type Condition = SimpleCondition | CompoundCondition

// ─── Step Definition ──────────────────────────────────────────────────────────

export interface StepDefinition<TSchema extends ZodTypeAny = ZodTypeAny> {
  /** Unique ID — used in branching conditions and persistence keys */
  id: StepId
  /** Shown in the step indicator sidebar */
  title: string
  /** Shown under the title on the step content area */
  subtitle?: string
  /**
   * Zod schema for this step's fields.
   * Pass null for informational/review steps with no validation.
   */
  schema: TSchema | null
  /**
   * Condition that must evaluate to true for this step to be included.
   * Evaluated against all accumulated form values.
   * Omit to always include the step.
   */
  condition?: Condition
  /**
   * Explicit sort weight. Steps are ordered ascending by this value.
   * When omitted, the array declaration order is used.
   */
  order?: number
}

// ─── Form State ───────────────────────────────────────────────────────────────

export type StepStatus = 'pending' | 'active' | 'complete' | 'skipped'

export interface StepState {
  id: StepId
  status: StepStatus
  errors: Record<string, string>
}

export interface FormFlowState {
  /** All accumulated field values across all steps */
  values: FormValues
  /** Per-step status and errors, keyed by StepId */
  steps: Record<StepId, StepState>
  /**
   * The ordered list of step IDs currently active (condition = true).
   * Recomputed on every setValues call.
   */
  activeStepIds: StepId[]
  /** Index into activeStepIds */
  currentIndex: number
  /** activeStepIds[currentIndex] */
  currentStepId: StepId
  isFirstStep: boolean
  isLastStep: boolean
  isComplete: boolean
}

// ─── Hook API ─────────────────────────────────────────────────────────────────

export interface FormFlowActions {
  /** Validate current step then advance if valid. Returns true on success. */
  next: () => Promise<boolean>
  /** Go back without validation */
  back: () => void
  /** Jump to any step by ID (no validation) */
  goTo: (stepId: StepId) => void
  /** Merge a partial values patch into form state */
  setValues: (patch: Partial<FormValues>) => void
  /** Clear persisted state and return to step 0 */
  reset: () => void
  /** Validate the current step and return any errors */
  validate: () => Promise<Record<string, string>>
}

export interface UseFormFlowReturn {
  state: FormFlowState
  actions: FormFlowActions
  /** The resolved StepDefinition for the current step */
  currentStep: StepDefinition
}

// ─── Persistence ──────────────────────────────────────────────────────────────

export interface PersistenceAdapter {
  load: (formId: string) => FormValues | null
  save: (formId: string, values: FormValues) => void
  clear: (formId: string) => void
}

// ─── Hook Options ─────────────────────────────────────────────────────────────

export interface UseFormFlowOptions {
  formId: string
  steps: StepDefinition[]
  persistence?: PersistenceAdapter | null
  onComplete?: (values: FormValues) => Promise<void> | void
  initialValues?: FormValues
}
