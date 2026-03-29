import { useEffect } from 'react'
import { useTOC } from './DocsTOCContext'

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold tracking-tight mb-3">{children}</h1>
}
function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return <h2 id={id} className="text-2xl font-semibold tracking-tight mt-12 mb-4 pt-8 border-t border-zinc-100 scroll-mt-20">{children}</h2>
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold mt-6 mb-2 font-mono text-zinc-800">{children}</h3>
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-zinc-600 leading-relaxed mb-3">{children}</p>
}
function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-zinc-100 text-zinc-800 text-sm px-1.5 py-0.5 rounded font-mono">{children}</code>
}
function Pre({ children }: { children: string }) {
  return (
    <pre className="bg-zinc-900 text-zinc-200 text-sm font-mono rounded-xl p-5 overflow-x-auto leading-relaxed my-4">
      <code>{children}</code>
    </pre>
  )
}
function PropRow({
  name, type, required, defaultVal, desc,
}: {
  name: string; type: string; required?: boolean; defaultVal?: string; desc: string
}) {
  return (
    <tr className="border-b border-zinc-100 last:border-0">
      <td className="py-3 pr-4 align-top">
        <code className="text-sm font-mono text-zinc-800">{name}</code>
        {required && <span className="ml-1.5 text-xs text-red-500 font-medium">required</span>}
      </td>
      <td className="py-3 pr-4 align-top">
        <code className="text-xs font-mono text-zinc-500">{type}</code>
      </td>
      <td className="py-3 pr-4 align-top text-xs text-zinc-400 font-mono">{defaultVal ?? '—'}</td>
      <td className="py-3 align-top text-sm text-zinc-600">{desc}</td>
    </tr>
  )
}
function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-zinc-100 rounded-xl overflow-hidden my-4">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 border-b border-zinc-100">
          <tr>
            {['Name', 'Type', 'Default', 'Description'].map(h => (
              <th key={h} className="text-left px-4 py-2.5 font-medium text-zinc-600 text-xs uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="px-4">{children}</tbody>
      </table>
    </div>
  )
}
function TR({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-zinc-100 last:border-0">{children}</tr>
}
function TD({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td className={`px-4 py-3 align-top text-sm ${mono ? 'font-mono text-zinc-800 text-xs' : 'text-zinc-600'}`}>
      {children}
    </td>
  )
}

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
      <div className="mb-8">
        <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Reference</p>
        <H1>API Reference</H1>
        <p className="text-lg text-zinc-500 leading-relaxed">
          Complete reference for <Code>useTrek</Code>, its options, return values, and all exported types.
        </p>
      </div>

      {/* useTrek */}
      <H2 id="use-form-flow">useTrek(options)</H2>
      <P>The main hook. Returns <Code>state</Code>, <Code>actions</Code>, and <Code>currentStep</Code>.</P>
      <Pre>{`import { useTrek } from 'formtrek'

const { state, actions, currentStep } = useTrek(options)`}</Pre>

      <H3>Options</H3>
      <div className="border border-zinc-100 rounded-xl overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              {['Name', 'Type', 'Default', 'Description'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 font-medium text-zinc-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <PropRow name="formId" type="string" required desc="Unique ID used as the persistence key. Must be stable across renders." />
            <PropRow name="steps" type="StepDefinition[]" required desc="Ordered array of step definitions." />
            <PropRow name="persistence" type="PersistenceAdapter | null" defaultVal="null" desc="Adapter for saving and loading form state. Pass null to disable." />
            <PropRow name="onComplete" type="(values: FormValues) => void | Promise<void>" defaultVal="undefined" desc="Called when the user submits the final step. Receives all accumulated values." />
            <PropRow name="initialValues" type="FormValues" defaultVal="{}" desc="Default field values. Merged with any persisted values on mount (persisted values take precedence)." />
          </tbody>
        </table>
      </div>

      {/* StepDefinition */}
      <H2 id="step-definition">StepDefinition</H2>
      <P>A plain object describing a single step in the form.</P>
      <Pre>{`interface StepDefinition {
  id: StepId
  title: string
  subtitle?: string
  schema: ZodTypeAny | null
  condition?: Condition
  order?: number
}`}</Pre>
      <div className="border border-zinc-100 rounded-xl overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              {['Property', 'Type', 'Description'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 font-medium text-zinc-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { p: 'id', t: 'string', d: 'Unique step identifier.' },
              { p: 'title', t: 'string', d: 'Displayed step title.' },
              { p: 'subtitle', t: 'string?', d: 'Optional subtitle shown below the title.' },
              { p: 'schema', t: 'ZodTypeAny | null', d: 'Zod schema for step validation. Pass null to skip validation.' },
              { p: 'condition', t: 'Condition?', d: 'If provided, evaluated on every value change. Step is hidden when false.' },
              { p: 'order', t: 'number?', d: 'Sort weight. Lower numbers appear first. Array index used when omitted.' },
            ].map(row => (
              <TR key={row.p}>
                <TD mono>{row.p}</TD>
                <TD mono>{row.t}</TD>
                <TD>{row.d}</TD>
              </TR>
            ))}
          </tbody>
        </table>
      </div>

      {/* TrekState */}
      <H2 id="form-flow-state">TrekState</H2>
      <P>The complete form state returned as <Code>state</Code> from the hook.</P>
      <Pre>{`interface TrekState {
  values: FormValues
  steps: Record<StepId, StepState>
  activeStepIds: StepId[]
  currentIndex: number
  currentStepId: StepId
  isFirstStep: boolean
  isLastStep: boolean
  isComplete: boolean
}`}</Pre>
      <div className="border border-zinc-100 rounded-xl overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              {['Property', 'Type', 'Description'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 font-medium text-zinc-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { p: 'values', t: 'FormValues', d: 'All accumulated field values across all steps.' },
              { p: 'steps', t: 'Record<StepId, StepState>', d: 'Per-step tracking including status and validation errors.' },
              { p: 'activeStepIds', t: 'StepId[]', d: 'Ordered list of step IDs currently visible (conditions evaluated).' },
              { p: 'currentIndex', t: 'number', d: 'Zero-based index of the current step within activeStepIds.' },
              { p: 'currentStepId', t: 'StepId', d: 'The id of the step currently being displayed.' },
              { p: 'isFirstStep', t: 'boolean', d: 'True when the user is on the first active step.' },
              { p: 'isLastStep', t: 'boolean', d: 'True when the user is on the final active step.' },
              { p: 'isComplete', t: 'boolean', d: 'True after onComplete resolves. Use to show a success screen.' },
            ].map(row => (
              <TR key={row.p}>
                <TD mono>{row.p}</TD>
                <TD mono>{row.t}</TD>
                <TD>{row.d}</TD>
              </TR>
            ))}
          </tbody>
        </table>
      </div>

      {/* StepState */}
      <H2 id="step-state">StepState</H2>
      <Pre>{`interface StepState {
  status: 'pending' | 'active' | 'complete' | 'skipped'
  errors: Record<string, string>
}`}</Pre>
      <div className="border border-zinc-100 rounded-xl overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              {['Property', 'Type', 'Description'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 font-medium text-zinc-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { p: 'status', t: "'pending' | 'active' | 'complete' | 'skipped'", d: 'Current status of this step.' },
              { p: 'errors', t: 'Record<string, string>', d: 'Field-level validation errors. Empty object when valid.' },
            ].map(row => (
              <TR key={row.p}>
                <TD mono>{row.p}</TD>
                <TD mono>{row.t}</TD>
                <TD>{row.d}</TD>
              </TR>
            ))}
          </tbody>
        </table>
      </div>

      {/* TrekActions */}
      <H2 id="form-flow-actions">TrekActions</H2>
      <P>All mutation methods returned as <Code>actions</Code> from the hook.</P>
      <div className="border border-zinc-100 rounded-xl overflow-hidden my-4">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              {['Method', 'Signature', 'Description'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 font-medium text-zinc-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { m: 'next()', s: '() => Promise<boolean>', d: 'Validates the current step. On success, advances to the next step or calls onComplete if on the last step. Returns true if navigation occurred.' },
              { m: 'back()', s: '() => void', d: 'Goes to the previous step without validation.' },
              { m: 'goTo(stepId)', s: '(stepId: StepId) => void', d: 'Jumps to a specific step. Only navigates to steps that are marked complete or active.' },
              { m: 'setValues(patch)', s: '(patch: Partial<FormValues>) => void', d: 'Merges the patch into the current values. Triggers condition re-evaluation and persistence.' },
              { m: 'validate()', s: '() => Promise<Record<string, string>>', d: 'Validates the current step schema without advancing. Updates errors in state as a side effect.' },
              { m: 'reset()', s: '() => void', d: 'Clears persisted state, resets all values to initialValues, and returns to step 0.' },
            ].map(row => (
              <TR key={row.m}>
                <TD mono>{row.m}</TD>
                <TD mono>{row.s}</TD>
                <TD>{row.d}</TD>
              </TR>
            ))}
          </tbody>
        </table>
      </div>

      {/* Condition */}
      <H2 id="condition">Condition</H2>
      <P>Used in <Code>StepDefinition.condition</Code>. A union of simple and compound condition types.</P>
      <Pre>{`type Condition = SimpleCondition | CompoundCondition

interface SimpleCondition {
  field: string
  op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn' | 'truthy' | 'falsy'
  value?: FieldValue | FieldValue[]
}

interface CompoundCondition {
  and?: Condition[]
  or?: Condition[]
  not?: Condition
}`}</Pre>

      {/* PersistenceAdapter */}
      <H2 id="persistence-adapter">PersistenceAdapter</H2>
      <P>Interface for custom storage adapters.</P>
      <Pre>{`interface PersistenceAdapter {
  load(formId: string): FormValues | null | Promise<FormValues | null>
  save(formId: string, values: FormValues): void | Promise<void>
  clear(formId: string): void | Promise<void>
}`}</Pre>

      {/* FormValues / FieldValue */}
      <H2>FormValues / FieldValue</H2>
      <Pre>{`type FieldValue = string | number | boolean | string[] | null | undefined
type FormValues = Record<string, FieldValue>`}</Pre>

      {/* Exports */}
      <H2 id="all-exports">All exports</H2>
      <Pre>{`// Hook
export { useTrek } from 'formtrek'

// Persistence adapters
export {
  localStorageAdapter,
  sessionStorageAdapter,
  urlParamsAdapter,
  nullAdapter,
} from 'formtrek'

// Utilities
export { evaluateCondition, resolveActiveSteps, validateStep } from 'formtrek'

// Types
export type {
  StepDefinition, StepId, StepStatus, StepState,
  TrekState, TrekActions, UseTrekReturn, UseTrekOptions,
  Condition, SimpleCondition, CompoundCondition,
  FormValues, FieldValue, PersistenceAdapter,
} from 'formtrek'`}</Pre>
    </article>
  )
}
