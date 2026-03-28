import { useEffect } from 'react'
import { useTOC } from './DocsTOCContext'

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold tracking-tight mb-3">{children}</h1>
}
function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return <h2 id={id} className="text-xl font-semibold tracking-tight mt-10 mb-3 scroll-mt-20">{children}</h2>
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold mt-6 mb-2">{children}</h3>
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-zinc-600 leading-relaxed mb-4">{children}</p>
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

const OPS = [
  { op: 'eq', desc: 'Equal', example: '{ field: "role", op: "eq", value: "admin" }' },
  { op: 'neq', desc: 'Not equal', example: '{ field: "role", op: "neq", value: "guest" }' },
  { op: 'gt', desc: 'Greater than', example: '{ field: "age", op: "gt", value: 18 }' },
  { op: 'gte', desc: 'Greater than or equal', example: '{ field: "age", op: "gte", value: 18 }' },
  { op: 'lt', desc: 'Less than', example: '{ field: "score", op: "lt", value: 50 }' },
  { op: 'lte', desc: 'Less than or equal', example: '{ field: "score", op: "lte", value: 100 }' },
  { op: 'in', desc: 'Value is in array', example: '{ field: "plan", op: "in", value: ["pro", "enterprise"] }' },
  { op: 'notIn', desc: 'Value is not in array', example: '{ field: "plan", op: "notIn", value: ["free"] }' },
  { op: 'truthy', desc: 'Value is truthy', example: '{ field: "hasCompany", op: "truthy" }' },
  { op: 'falsy', desc: 'Value is falsy', example: '{ field: "skipBilling", op: "falsy" }' },
]

export function ConditionalBranching() {
  const { setItems } = useTOC()
  useEffect(() => {
    setItems([
      { id: 'how-it-works', label: 'How it works' },
      { id: 'simple-conditions', label: 'Simple conditions' },
      { id: 'compound-conditions', label: 'Compound conditions' },
      { id: 'step-ordering', label: 'Step ordering' },
      { id: 'accessing-active-steps', label: 'Accessing active steps' },
    ])
    return () => setItems([])
  }, [setItems])

  return (
    <article>
      <div className="mb-8">
        <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Core Concepts</p>
        <H1>Conditional Branching</H1>
        <p className="text-lg text-zinc-500 leading-relaxed">
          Control which steps appear based on values the user has already entered,
          using plain objects — no JSX, no custom DSL.
        </p>
      </div>

      <H2 id="how-it-works">How it works</H2>
      <P>
        Every step can have an optional <Code>condition</Code> property. After each call
        to <Code>actions.setValues()</Code> or <Code>actions.next()</Code>, FormFlow
        re-evaluates all conditions against the current accumulated values and rebuilds
        the active step list.
      </P>
      <P>
        Steps whose condition evaluates to <Code>false</Code> are removed from the
        sequence entirely — they don't appear in the step count, progress bar, or
        navigation. Their values are still preserved in case the condition becomes
        true again later.
      </P>

      <H2 id="simple-conditions">Simple conditions</H2>
      <P>
        A simple condition targets a single field and applies one of ten operators.
      </P>
      <Pre>{`{
  id: 'billing',
  title: 'Billing',
  condition: { field: 'accountType', op: 'eq', value: 'paid' },
  schema: billingSchema,
}`}</Pre>

      <div className="border border-zinc-100 rounded-xl overflow-hidden my-6">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-zinc-600">Operator</th>
              <th className="text-left px-4 py-2.5 font-medium text-zinc-600">Description</th>
            </tr>
          </thead>
          <tbody>
            {OPS.map((row, i) => (
              <tr key={row.op} className={i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}>
                <td className="px-4 py-2.5 font-mono text-zinc-800 text-xs">{row.op}</td>
                <td className="px-4 py-2.5 text-zinc-600">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="compound-conditions">Compound conditions</H2>
      <P>
        Conditions can be composed with <Code>and</Code>, <Code>or</Code>, and
        <Code>not</Code> to express any logic you need.
      </P>

      <H3>and — all must be true</H3>
      <Pre>{`condition: {
  and: [
    { field: 'role', op: 'eq', value: 'engineer' },
    { field: 'yearsExperience', op: 'gte', value: 5 },
  ]
}`}</Pre>

      <H3>or — any must be true</H3>
      <Pre>{`condition: {
  or: [
    { field: 'role', op: 'eq', value: 'designer' },
    { field: 'role', op: 'eq', value: 'researcher' },
  ]
}

// Equivalent shorthand using 'in':
condition: { field: 'role', op: 'in', value: ['designer', 'researcher'] }`}</Pre>

      <H3>not — negate a condition</H3>
      <Pre>{`condition: {
  not: { field: 'workStyle', op: 'eq', value: 'remote-only' }
}

// Equivalent using 'neq':
condition: { field: 'workStyle', op: 'neq', value: 'remote-only' }`}</Pre>

      <H3>Deeply nested</H3>
      <Pre>{`condition: {
  and: [
    { field: 'plan', op: 'in', value: ['pro', 'enterprise'] },
    {
      or: [
        { field: 'region', op: 'eq', value: 'EU' },
        { field: 'gdprConsent', op: 'truthy' },
      ]
    }
  ]
}`}</Pre>

      <H2 id="step-ordering">Step ordering</H2>
      <P>
        By default, steps are shown in the order they are defined in the array.
        You can override this with the <Code>order</Code> property — a numeric weight
        used for sorting.
      </P>
      <P>
        This is useful when a step should appear earlier for some users than others.
        In the demo, the salary step has <Code>order: 35</Code> for experienced engineers
        so it appears before the technical skills step.
      </P>
      <Pre>{`const steps = [
  { id: 'basics', title: 'Basics', order: 10, schema: basicsSchema },
  { id: 'technical', title: 'Technical', order: 40, schema: technicalSchema },
  {
    id: 'salary',
    title: 'Salary',
    order: 35, // ← appears between basics and technical for senior engineers
    condition: { field: 'yearsExperience', op: 'gte', value: 5 },
    schema: salarySchema,
  },
]`}</Pre>

      <H2 id="accessing-active-steps">Accessing active steps</H2>
      <P>
        The hook exposes <Code>state.activeStepIds</Code> — the ordered array of step IDs
        that are currently visible. Use this to build progress indicators or navigation.
      </P>
      <Pre>{`const { state } = useFormFlow({ ... })

// Current progress
const total = state.activeStepIds.length
const current = state.currentIndex + 1

// e.g. "Step 2 of 4"
return <p>Step {current} of {total}</p>`}</Pre>

      <H2>Tips</H2>
      <div className="space-y-3 my-4">
        {[
          'Values from hidden steps are kept in state — if a condition becomes true again, the user\'s previous input is preserved.',
          'Conditions are re-evaluated synchronously on every state change — keep them fast (no async).',
          'Use the DevPanel (imported from the demo components) during development to inspect which conditions are passing and which steps are active.',
        ].map((tip, i) => (
          <div key={i} className="flex gap-3 text-sm text-zinc-600">
            <span className="text-zinc-400 font-mono mt-0.5">→</span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </article>
  )
}
