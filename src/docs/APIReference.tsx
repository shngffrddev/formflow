import { useEffect } from 'react'
import { useTOC } from './DocsTOCContext'
import {
  H1, H2, H3, Lead, P, Code, CodeBlock, PropTable, PropTable3, MethodTable,
} from './DocComponents'

export function APIReference() {
  const { setItems } = useTOC()
  useEffect(() => {
    setItems([
      { id: 'use-form-flow', label: 'useTrek()' },
      { id: 'step-definition', label: 'StepDefinition' },
      { id: 'form-flow-state', label: 'TrekState' },
      { id: 'step-state', label: 'StepState' },
      { id: 'form-flow-actions', label: 'TrekActions' },
      { id: 'condition', label: 'Condition' },
      { id: 'persistence-adapter', label: 'PersistenceAdapter' },
      { id: 'all-exports', label: 'All exports' },
    ])
    return () => setItems([])
  }, [setItems])

  return (
    <article>
      <H1 badge="API">API Reference</H1>
      <Lead>
        Complete reference for <Code>useTrek</Code>, its options, return values, and all
        exported TypeScript types.
      </Lead>

      {/* useTrek */}
      <H2 id="use-form-flow">useTrek(options)</H2>
      <P>The main hook. Call it once per form. Returns <Code>{'{ state, actions, currentStep }'}</Code>.</P>
      <CodeBlock language="ts">{`import { useTrek } from 'formtrek'

const { state, actions, currentStep } = useTrek(options)`}</CodeBlock>

      <H3>Options</H3>
      <PropTable rows={[
        {
          name: 'formId',
          type: 'string',
          required: true,
          desc: 'Unique ID used as the persistence namespace. Must be stable across renders.',
        },
        {
          name: 'steps',
          type: 'StepDefinition[]',
          required: true,
          desc: 'Ordered array of step definitions. See StepDefinition below.',
        },
        {
          name: 'persistence',
          type: 'PersistenceAdapter | null',
          defaultVal: 'null',
          desc: <>Adapter for saving and restoring form state. Pass <Code>null</Code> to disable.</>,
        },
        {
          name: 'onComplete',
          type: '(values) => void | Promise',
          defaultVal: 'undefined',
          desc: 'Called when the user submits the final step. Receives all accumulated values.',
        },
        {
          name: 'initialValues',
          type: 'FormValues',
          defaultVal: '{}',
          desc: 'Default field values. Merged with persisted values on mount — persisted values win.',
        },
      ]} />

      <H3>Return value</H3>
      <PropTable3 rows={[
        { prop: 'state', type: 'TrekState', desc: 'Complete snapshot of form state. See TrekState.' },
        { prop: 'actions', type: 'TrekActions', desc: 'All mutation methods. See TrekActions.' },
        { prop: 'currentStep', type: 'StepDefinition', desc: 'The full step definition object for the current step.' },
      ]} />

      {/* StepDefinition */}
      <H2 id="step-definition">StepDefinition</H2>
      <P>A plain object describing a single step.</P>
      <CodeBlock language="ts">{`interface StepDefinition {
  id: StepId          // unique string identifier
  title: string       // display title
  subtitle?: string   // optional subtitle
  schema: ZodTypeAny | null  // null disables validation
  condition?: Condition       // if false, step is hidden
  order?: number              // sort weight (array index used when omitted)
}`}</CodeBlock>
      <PropTable3 rows={[
        { prop: 'id', type: 'string', desc: 'Unique step identifier. Used as the persistence key and in error maps.' },
        { prop: 'title', type: 'string', desc: 'Human-readable step title.' },
        { prop: 'subtitle', type: 'string?', desc: 'Optional subtitle rendered below the title.' },
        { prop: 'schema', type: 'ZodTypeAny | null', desc: <>Zod schema for validation. Pass <Code>null</Code> to skip validation entirely.</> },
        { prop: 'condition', type: 'Condition?', desc: <>Evaluated on every value change. Step is hidden when <Code>false</Code>.</> },
        { prop: 'order', type: 'number?', desc: 'Sort weight for step ordering. Defaults to array index.' },
      ]} />

      {/* TrekState */}
      <H2 id="form-flow-state">TrekState</H2>
      <P>The complete form state snapshot returned as <Code>state</Code>.</P>
      <CodeBlock language="ts">{`interface TrekState {
  values: FormValues                    // all accumulated field values
  steps: Record<StepId, StepState>      // per-step status + errors
  activeStepIds: StepId[]               // ordered IDs of visible steps
  currentIndex: number                  // 0-based index in activeStepIds
  currentStepId: StepId                 // ID of the currently shown step
  isFirstStep: boolean
  isLastStep: boolean
  isComplete: boolean                   // true after onComplete resolves
}`}</CodeBlock>
      <PropTable3 rows={[
        { prop: 'values', type: 'FormValues', desc: 'All accumulated field values across all steps.' },
        { prop: 'steps', type: 'Record<StepId, StepState>', desc: 'Per-step tracking including status and validation errors.' },
        { prop: 'activeStepIds', type: 'StepId[]', desc: 'Ordered list of step IDs with conditions evaluated to true.' },
        { prop: 'currentIndex', type: 'number', desc: 'Zero-based index of the current step within activeStepIds.' },
        { prop: 'currentStepId', type: 'StepId', desc: 'The id of the step currently being displayed.' },
        { prop: 'isFirstStep', type: 'boolean', desc: 'True when the user is on the first active step.' },
        { prop: 'isLastStep', type: 'boolean', desc: 'True when the user is on the final active step.' },
        { prop: 'isComplete', type: 'boolean', desc: <>True after <Code>onComplete</Code> resolves. Use to show a success screen.</> },
      ]} />

      {/* StepState */}
      <H2 id="step-state">StepState</H2>
      <CodeBlock language="ts">{`interface StepState {
  id: StepId
  status: 'pending' | 'active' | 'complete' | 'skipped'
  errors: Record<string, string>   // empty when valid
}`}</CodeBlock>
      <PropTable3 rows={[
        { prop: 'id', type: 'StepId', desc: 'The step ID.' },
        { prop: 'status', type: "'pending' | 'active' | 'complete' | 'skipped'", desc: 'Current lifecycle status of this step.' },
        { prop: 'errors', type: 'Record<string, string>', desc: 'Field-level validation errors. Empty object when the step is valid.' },
      ]} />

      {/* TrekActions */}
      <H2 id="form-flow-actions">TrekActions</H2>
      <P>All mutation methods returned as <Code>actions</Code>.</P>
      <MethodTable rows={[
        {
          method: 'next()',
          sig: '() => Promise<boolean>',
          desc: <>Validates the current step. On success, advances to the next step or calls <Code>onComplete</Code>. Returns <Code>true</Code> if navigation occurred.</>,
        },
        {
          method: 'back()',
          sig: '() => void',
          desc: 'Goes to the previous step without any validation.',
        },
        {
          method: 'goTo(stepId)',
          sig: '(stepId: StepId) => void',
          desc: 'Jumps directly to a specific step by ID.',
        },
        {
          method: 'setValues(patch)',
          sig: '(patch: Partial<FormValues>) => void',
          desc: 'Merges the patch into the current values. Triggers condition re-evaluation and persistence.',
        },
        {
          method: 'validate()',
          sig: '() => Promise<Record<string, string>>',
          desc: 'Validates the current step without advancing. Updates errors as a side effect.',
        },
        {
          method: 'reset()',
          sig: '() => void',
          desc: 'Clears persisted state, resets all values to initialValues, and returns to step 0.',
        },
      ]} />

      {/* Condition */}
      <H2 id="condition">Condition</H2>
      <P>Used in <Code>StepDefinition.condition</Code>. A union of simple and compound types.</P>
      <CodeBlock language="ts">{`type Condition = SimpleCondition | CompoundCondition

interface SimpleCondition {
  field: string
  op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn' | 'truthy' | 'falsy'
  value?: FieldValue | FieldValue[]
}

interface CompoundCondition {
  and?: Condition[]
  or?: Condition[]
  not?: Condition
}`}</CodeBlock>

      {/* PersistenceAdapter */}
      <H2 id="persistence-adapter">PersistenceAdapter</H2>
      <P>Implement this interface to create a custom storage adapter.</P>
      <CodeBlock language="ts">{`interface PersistenceAdapter {
  load(formId: string): FormValues | null | Promise<FormValues | null>
  save(formId: string, values: FormValues): void | Promise<void>
  clear(formId: string): void | Promise<void>
}`}</CodeBlock>

      {/* FormValues / FieldValue */}
      <H2>FormValues / FieldValue</H2>
      <CodeBlock language="ts">{`type FieldValue = string | number | boolean | string[] | null | undefined
type FormValues = Record<string, FieldValue>`}</CodeBlock>

      {/* All exports */}
      <H2 id="all-exports">All exports</H2>
      <CodeBlock language="ts">{`// Hook
import { useTrek } from 'formtrek'

// Persistence adapters
import {
  localStorageAdapter,
  sessionStorageAdapter,
  urlParamsAdapter,
  nullAdapter,
} from 'formtrek'

// Utility functions (for custom integrations)
import { evaluateCondition, resolveActiveSteps, validateStep } from 'formtrek'

// TypeScript types
import type {
  StepDefinition, StepId, StepStatus, StepState,
  TrekState, TrekActions, UseTrekReturn, UseTrekOptions,
  Condition, SimpleCondition, CompoundCondition,
  FormValues, FieldValue, PersistenceAdapter,
} from 'formtrek'`}</CodeBlock>
    </article>
  )
}
