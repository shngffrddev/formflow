import { useEffect } from 'react'
import { useTOC } from './DocsTOCContext'
import {
  H1, H2, H3, Lead, P, Code, CodeBlock, Callout, SimpleTable,
} from './DocComponents'

const OPS = [
  { op: 'eq', desc: 'Equal to value' },
  { op: 'neq', desc: 'Not equal to value' },
  { op: 'gt', desc: 'Greater than value' },
  { op: 'gte', desc: 'Greater than or equal to value' },
  { op: 'lt', desc: 'Less than value' },
  { op: 'lte', desc: 'Less than or equal to value' },
  { op: 'in', desc: 'Value is in the provided array' },
  { op: 'notIn', desc: 'Value is not in the provided array' },
  { op: 'truthy', desc: 'Value is truthy (no value arg needed)' },
  { op: 'falsy', desc: 'Value is falsy (no value arg needed)' },
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
      <H1 badge="Core Concepts">Conditional Branching</H1>
      <Lead>
        Control which steps appear based on values the user has already entered.
        Plain objects, no custom DSL, no JSX conditionals.
      </Lead>

      <H2 id="how-it-works">How it works</H2>
      <P>
        Every step can have an optional <Code>condition</Code> property. After each call
        to <Code>actions.setValues()</Code> or <Code>actions.next()</Code>, FormTrek
        re-evaluates all conditions against the current accumulated values and rebuilds
        the active step list.
      </P>
      <P>
        Steps whose condition evaluates to <Code>false</Code> are removed from the sequence
        entirely — they don't appear in the step count, progress bar, or navigation.
        Their <em>values are preserved</em> in case the condition becomes true again.
      </P>

      <Callout type="tip">
        Because conditions are pure functions of <Code>state.values</Code>, FormTrek can
        re-evaluate them synchronously on every keystroke. Keep conditions fast — no async.
      </Callout>

      <H2 id="simple-conditions">Simple conditions</H2>
      <P>A simple condition targets a single field with one of ten operators:</P>
      <CodeBlock language="ts">{`{
  id: 'billing',
  title: 'Billing',
  condition: { field: 'accountType', op: 'eq', value: 'paid' },
  schema: billingSchema,
}`}</CodeBlock>

      <SimpleTable
        headers={['Operator', 'Description']}
        rows={OPS.map(r => ({ a: r.op, b: r.desc }))}
      />

      <H2 id="compound-conditions">Compound conditions</H2>
      <P>
        Conditions can be composed with <Code>and</Code>, <Code>or</Code>, and{' '}
        <Code>not</Code> to express any logic.
      </P>

      <H3>and — all must be true</H3>
      <CodeBlock language="ts">{`condition: {
  and: [
    { field: 'role', op: 'eq', value: 'engineer' },
    { field: 'yearsExperience', op: 'gte', value: 5 },
  ]
}`}</CodeBlock>

      <H3>or — any must be true</H3>
      <CodeBlock language="ts">{`condition: {
  or: [
    { field: 'role', op: 'eq', value: 'designer' },
    { field: 'role', op: 'eq', value: 'researcher' },
  ]
}

// Equivalent shorthand using 'in':
condition: { field: 'role', op: 'in', value: ['designer', 'researcher'] }`}</CodeBlock>

      <H3>not — negate a condition</H3>
      <CodeBlock language="ts">{`condition: {
  not: { field: 'workStyle', op: 'eq', value: 'remote-only' }
}

// Equivalent using 'neq':
condition: { field: 'workStyle', op: 'neq', value: 'remote-only' }`}</CodeBlock>

      <H3>Deeply nested</H3>
      <CodeBlock language="ts">{`condition: {
  and: [
    { field: 'plan', op: 'in', value: ['pro', 'enterprise'] },
    {
      or: [
        { field: 'region', op: 'eq', value: 'EU' },
        { field: 'gdprConsent', op: 'truthy' },
      ]
    }
  ]
}`}</CodeBlock>

      <H2 id="step-ordering">Step ordering</H2>
      <P>
        By default, steps appear in the order they are defined in the array.
        You can override this with the <Code>order</Code> property — a numeric weight
        used for sorting (lower = earlier).
      </P>
      <P>
        This is useful when a conditional step should slot between two existing steps
        only for certain users.
      </P>
      <CodeBlock language="ts">{`const steps = [
  { id: 'basics',    title: 'Basics',    order: 10, schema: basicsSchema },
  { id: 'technical', title: 'Technical', order: 40, schema: technicalSchema },
  {
    id: 'salary',
    title: 'Salary',
    order: 35, // appears between basics (10) and technical (40)
    condition: { field: 'yearsExperience', op: 'gte', value: 5 },
    schema: salarySchema,
  },
]`}</CodeBlock>

      <H2 id="accessing-active-steps">Accessing active steps</H2>
      <P>
        The hook exposes <Code>state.activeStepIds</Code> — the ordered array of step IDs
        that are currently visible after conditions are evaluated. Use it to build
        progress bars or step counters.
      </P>
      <CodeBlock language="tsx">{`const { state } = useTrek({ ... })

const total = state.activeStepIds.length
const current = state.currentIndex + 1

// Progress bar
<div className="w-full h-1 bg-zinc-100 rounded-full">
  <div
    className="h-1 bg-blue-500 rounded-full transition-all"
    style={{ width: \`\${(current / total) * 100}%\` }}
  />
</div>

// Step counter
<p className="text-sm text-zinc-500">Step {current} of {total}</p>`}</CodeBlock>

      <Callout type="note">
        Values from hidden steps are kept in <Code>state.values</Code>. If a condition
        becomes true again after being false, the user's previous input is automatically
        restored — no extra logic needed.
      </Callout>
    </article>
  )
}
