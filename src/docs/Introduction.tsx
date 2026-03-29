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
        FormTrek is a small, headless React hook for building multi-step forms. It handles
        conditional steps, Zod validation, and persistence — you handle the UI.
      </Lead>

      <H2 id="why-formflow">Why FormTrek?</H2>
      <P>
        Multi-step forms look easy until someone asks you to skip a step based on what a
        user already entered. Or let them close the browser and come back. Or validate on
        the server using the same rules you used on the client. Most libraries handle one
        of those. FormTrek does all three.
      </P>
      <P>
        It's <strong>headless</strong>, meaning you write all the markup. FormTrek just keeps
        track of where you are, what's been filled in, and whether each step passed validation.
      </P>

      <FeatureGrid items={[
        {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
            </svg>
          ),
          label: 'Conditional branching',
          desc: "Steps show up or drop out as values change. Just a plain condition object — no JSX branching.",
          iconBg: 'bg-blue-100 text-blue-700',
        },
        {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="m9 12 2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          ),
          label: 'Zod validation',
          desc: "One schema per step, checked on navigation. Bring the same schema to your API handler.",
          iconBg: 'bg-emerald-100 text-emerald-700',
        },
        {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
            </svg>
          ),
          label: 'Persistence',
          desc: "localStorage, sessionStorage, URL params, or your own adapter. Works out of the box.",
          iconBg: 'bg-violet-100 text-violet-700',
        },
      ]} />

      <H2 id="core-concepts">Core concepts</H2>
      <P>There are three building blocks worth understanding:</P>

      <div className="space-y-3 my-6">
        {[
          {
            label: 'Steps',
            desc: <>Each step is a plain object — an <Code>id</Code>, a <Code>title</Code>, an optional Zod <Code>schema</Code>, and an optional <Code>condition</Code>. Define them once, use them everywhere.</>,
          },
          {
            label: 'Conditions',
            desc: <>A condition is a plain object that gets checked every time a value changes. If it's <Code>false</Code>, the step drops out of the sequence. No JSX branching needed.</>,
          },
          {
            label: 'Persistence adapters',
            desc: <>An adapter has three methods: <Code>load</Code>, <Code>save</Code>, and <Code>clear</Code>. FormTrek ships four ready to use, and you can write your own in minutes.</>,
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
        FormTrek doesn't generate inputs or labels. It gives you state and actions — what
        you render with them is entirely up to you.
      </P>
      <P>
        It's not trying to replace react-hook-form either. It doesn't track individual
        keystrokes or field-level state. Validation happens at the <em>step level</em> when
        the user clicks Next — that's the right scope for a wizard-style flow.
      </P>
      <Callout type="tip">
        You can use react-hook-form inside each step for field state, and FormTrek to
        orchestrate the steps. They don't get in each other's way.
      </Callout>

      <H2 id="quick-look">Quick look</H2>
      <P>Here's what it looks like before you commit to reading the full guide:</P>
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
        <p className="text-sm font-semibold text-zinc-700 mb-4">Want to jump in?</p>
        <CardGrid>
          <DocCard to="/docs/getting-started" label="Quick Start" desc="Get it installed and a basic form working" />
          <DocCard to="/docs/api" label="API Reference" desc="Everything useTrek accepts and returns, with types" />
        </CardGrid>
      </div>
    </article>
  )
}
