import { useEffect } from 'react'
import { useTOC } from './DocsTOCContext'
import {
  H1, H2, Lead, P, Code, CodeBlock, Callout, FeatureGrid, CardGrid, DocCard,
} from './DocComponents'

export function Introduction() {
  const { setItems } = useTOC()
  useEffect(() => {
    setItems([
      { id: 'why-formflow', label: 'Why FormTrek?' },
      { id: 'core-concepts', label: 'Core concepts' },
      { id: 'what-formflow-is-not', label: 'What it is not' },
      { id: 'quick-look', label: 'Quick look' },
    ])
    return () => setItems([])
  }, [setItems])

  return (
    <article>
      <H1 badge="Getting Started">Introduction</H1>
      <Lead>
        FormTrek is a headless React hook library for multi-step forms with conditional
        branching, Zod validation, and partial persistence — all in one tiny package.
      </Lead>

      <H2 id="why-formflow">Why FormTrek?</H2>
      <P>
        Multi-step forms appear simple until you need to conditionally show or skip steps
        based on earlier answers, let users save their progress and return later, or
        reuse the same validation logic on your server. Most solutions handle one of
        these well. FormTrek handles all three.
      </P>
      <P>
        The library is <strong>headless</strong> — it manages state, navigation, validation,
        and persistence, but leaves rendering entirely to you. Any UI library, any styling
        approach, any component system.
      </P>

      <FeatureGrid items={[
        {
          icon: '🌿',
          label: 'Conditional branching',
          desc: 'Steps appear or disappear based on accumulated values. No JSX conditionals needed.',
        },
        {
          icon: '🔒',
          label: 'Zod validation',
          desc: 'Per-step schemas validated on navigation. Reuse the same schema server-side.',
        },
        {
          icon: '💾',
          label: 'Persistence',
          desc: 'Built-in localStorage, sessionStorage, URL params, and custom adapter support.',
        },
      ]} />

      <H2 id="core-concepts">Core concepts</H2>
      <P>FormTrek is built around three ideas:</P>

      <div className="space-y-3 my-6">
        {[
          {
            label: 'Steps',
            desc: <>Each step is a plain object with an <Code>id</Code>, a <Code>title</Code>, an optional Zod <Code>schema</Code>, and an optional <Code>condition</Code>. Steps are defined once and reused everywhere.</>,
          },
          {
            label: 'Conditions',
            desc: <>A condition is a plain object evaluated on every value change. If the condition resolves to <Code>false</Code>, the step is removed from the active sequence — no JSX branching required.</>,
          },
          {
            label: 'Persistence adapters',
            desc: <>An adapter is an object with <Code>load</Code>, <Code>save</Code>, and <Code>clear</Code> methods. FormTrek ships four built-in adapters and accepts any custom implementation.</>,
          },
        ].map(item => (
          <div key={item.label} className="flex gap-4 p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50 transition-colors">
            <div className="w-1.5 shrink-0 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 mt-1 mb-1" />
            <div>
              <p className="font-semibold text-zinc-900 text-[15px] mb-1">{item.label}</p>
              <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <H2 id="what-formflow-is-not">What FormTrek is not</H2>
      <P>
        FormTrek is not a form renderer. It does not generate inputs, labels, or layouts.
        It gives you state and a set of actions — what you render with them is up to you.
      </P>
      <P>
        It is also not a replacement for react-hook-form or Formik. It does not manage
        every keystroke or provide field-level registration. It validates at the{' '}
        <em>step level</em> on navigation, which is the right granularity for multi-step flows.
      </P>
      <Callout type="tip">
        FormTrek pairs well with any field-level form library. Use react-hook-form for
        individual field state within each step, and FormTrek for orchestrating the steps themselves.
      </Callout>

      <H2 id="quick-look">Quick look</H2>
      <P>A taste of the API before diving into the full guide:</P>
      <CodeBlock language="tsx" filename="signup-form.tsx">{`import { useTrek, localStorageAdapter } from 'formtrek'
import { z } from 'zod'

const { state, actions, currentStep } = useTrek({
  formId: 'signup',
  steps: [
    {
      id: 'basics',
      title: 'Basic info',
      schema: z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
    },
    {
      id: 'team',
      title: 'Team details',
      // Only shown when accountType === 'team'
      condition: { field: 'accountType', op: 'eq', value: 'team' },
      schema: z.object({ teamName: z.string().min(1) }),
    },
  ],
  persistence: localStorageAdapter,
  onComplete: async (values) => {
    await submitToServer(values)
  },
})`}</CodeBlock>

      <div className="mt-10">
        <p className="text-sm font-semibold text-zinc-700 mb-4">Ready to build?</p>
        <CardGrid>
          <DocCard to="/docs/getting-started" label="Quick Start" desc="Install FormTrek and have a working multi-step form in minutes" />
          <DocCard to="/docs/api" label="API Reference" desc="Full reference for useTrek options, state, actions, and types" />
        </CardGrid>
      </div>
    </article>
  )
}
