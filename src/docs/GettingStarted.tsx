import { useEffect } from 'react'
import { useTOC } from './DocsTOCContext'
import { PackageManagerTabs } from './PackageManagerTabs'
import {
  H1, H2, Lead, P, Code, CodeBlock, Callout, Steps, Step, CardGrid, DocCard,
} from './DocComponents'

export function GettingStarted() {
  const { setItems } = useTOC()
  useEffect(() => {
    setItems([
      { id: 'installation', label: 'Installation' },
      { id: 'your-first-form', label: 'Your first form' },
      { id: 'full-example', label: 'Full example' },
      { id: 'next-steps', label: 'Next steps' },
    ])
    return () => setItems([])
  }, [setItems])

  return (
    <article>
      <H1 badge="Getting Started">Quick Start</H1>
      <Lead>
        Install FormTrek, define your steps, and have a working multi-step form running
        in under five minutes.
      </Lead>

      <H2 id="installation">Installation</H2>
      <P>
        The fastest way is the CLI — it detects your package manager and installs
        FormTrek and Zod automatically:
      </P>
      <PackageManagerTabs packages="dlx formtrek init" mode="dlx" />
      <P>Or install manually. FormTrek requires React 18+ and Zod 3+ as peer dependencies:</P>
      <PackageManagerTabs packages="formtrek zod" />

      <Callout type="note">
        FormTrek is <strong>zero-dependency</strong> at runtime — React and Zod are peer deps,
        not bundled. This keeps your bundle lean.
      </Callout>

      <H2 id="your-first-form">Your first form</H2>
      <P>
        Building a form with FormTrek involves four steps.
      </P>

      <Steps>
        <Step n={1} label="Define your steps">
          <P>
            Each step is a plain object. The <Code>id</Code> uniquely identifies the step,{' '}
            <Code>schema</Code> is a Zod object schema for validation (or <Code>null</Code>{' '}
            for read-only steps), and <Code>condition</Code> optionally controls visibility.
          </P>
          <CodeBlock language="tsx" filename="steps.ts">{`import { z } from 'zod'
import type { StepDefinition } from 'formtrek'

const steps: StepDefinition[] = [
  {
    id: 'personal',
    title: 'Personal Info',
    schema: z.object({
      firstName: z.string().min(1, 'Required'),
      email: z.string().email('Invalid email'),
    }),
  },
  {
    id: 'company',
    title: 'Company',
    // Only shown when accountType === 'professional'
    condition: { field: 'accountType', op: 'eq', value: 'professional' },
    schema: z.object({
      companyName: z.string().min(1, 'Required'),
    }),
  },
  {
    id: 'review',
    title: 'Review & Submit',
    schema: null, // no validation on review steps
  },
]`}</CodeBlock>
        </Step>

        <Step n={2} label="Call useTrek">
          <P>
            Pass your steps and a unique <Code>formId</Code> to <Code>useTrek</Code>.
            The hook returns <Code>state</Code>, <Code>actions</Code>, and{' '}
            <Code>currentStep</Code>.
          </P>
          <CodeBlock language="tsx" filename="MyForm.tsx">{`import { useTrek, localStorageAdapter } from 'formtrek'

function MyForm() {
  const { state, actions, currentStep } = useTrek({
    formId: 'onboarding',
    steps,
    persistence: localStorageAdapter, // save progress
    onComplete: async (values) => {
      await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(values),
      })
    },
  })

  // ...
}`}</CodeBlock>
        </Step>

        <Step n={3} label="Render each step">
          <P>
            Use <Code>currentStep.id</Code> to decide what to render. Field values
            live in <Code>state.values</Code> — update them with{' '}
            <Code>actions.setValues()</Code>. Errors are in{' '}
            <Code>state.steps[currentStep.id].errors</Code>.
          </P>
          <CodeBlock language="tsx">{`const stepErrors = state.steps[currentStep.id]?.errors ?? {}

return (
  <form onSubmit={(e) => { e.preventDefault(); actions.next() }}>
    {currentStep.id === 'personal' && (
      <>
        <input
          value={(state.values.firstName as string) ?? ''}
          onChange={(e) => actions.setValues({ firstName: e.target.value })}
          placeholder="First name"
        />
        {stepErrors.firstName && (
          <p className="text-red-500 text-sm">{stepErrors.firstName}</p>
        )}
      </>
    )}

    <div className="flex gap-3 mt-6">
      {!state.isFirstStep && (
        <button type="button" onClick={actions.back}>Back</button>
      )}
      <button type="submit">
        {state.isLastStep ? 'Submit' : 'Next →'}
      </button>
    </div>
  </form>
)`}</CodeBlock>
        </Step>

        <Step n={4} label="Handle completion">
          <P>
            When the user submits the final step, <Code>actions.next()</Code> calls
            your <Code>onComplete</Code> callback with all accumulated values.
            Use <Code>state.isComplete</Code> to show a success screen.
          </P>
          <CodeBlock language="tsx">{`if (state.isComplete) {
  return (
    <div className="text-center py-12">
      <p className="text-2xl mb-2">🎉 All done!</p>
      <p className="text-zinc-500">We'll be in touch shortly.</p>
    </div>
  )
}`}</CodeBlock>
        </Step>
      </Steps>

      <H2 id="full-example">Full example</H2>
      <P>Putting it all together — a minimal but complete two-step form:</P>
      <CodeBlock language="tsx" filename="OnboardingForm.tsx">{`import { useTrek, localStorageAdapter } from 'formtrek'
import { z } from 'zod'

const steps = [
  {
    id: 'info',
    title: 'Your Info',
    schema: z.object({
      name: z.string().min(1, 'Required'),
      email: z.string().email('Invalid email'),
    }),
  },
  {
    id: 'confirm',
    title: 'Confirm',
    schema: null,
  },
]

export function OnboardingForm() {
  const { state, actions, currentStep } = useTrek({
    formId: 'onboarding',
    steps,
    persistence: localStorageAdapter,
    onComplete: async (values) => console.log('Done:', values),
  })

  if (state.isComplete) {
    return <p>All done! ✓</p>
  }

  const errors = state.steps[currentStep.id]?.errors ?? {}

  return (
    <form onSubmit={(e) => { e.preventDefault(); actions.next() }}>
      <h2>
        {currentStep.title}
        <span className="text-zinc-400 ml-2 text-sm font-normal">
          Step {state.currentIndex + 1} of {state.activeStepIds.length}
        </span>
      </h2>

      {currentStep.id === 'info' && (
        <>
          <div>
            <input
              value={(state.values.name as string) ?? ''}
              onChange={(e) => actions.setValues({ name: e.target.value })}
              placeholder="Name"
            />
            {errors.name && <span className="text-red-500">{errors.name}</span>}
          </div>
          <div>
            <input
              value={(state.values.email as string) ?? ''}
              onChange={(e) => actions.setValues({ email: e.target.value })}
              placeholder="Email"
            />
            {errors.email && <span className="text-red-500">{errors.email}</span>}
          </div>
        </>
      )}

      {currentStep.id === 'confirm' && (
        <p>Submitting as: {state.values.name as string} ({state.values.email as string})</p>
      )}

      <div className="flex gap-3 mt-4">
        {!state.isFirstStep && (
          <button type="button" onClick={actions.back}>← Back</button>
        )}
        <button type="submit">
          {state.isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </form>
  )
}`}</CodeBlock>

      <H2 id="next-steps">Next steps</H2>
      <CardGrid>
        <DocCard to="/docs/conditional-branching" label="Conditional Branching" desc="Show or skip steps based on earlier answers — no JSX required" />
        <DocCard to="/docs/validation" label="Validation" desc="Per-step Zod schemas, async validators, and server-side reuse" />
        <DocCard to="/docs/persistence" label="Persistence" desc="localStorage, sessionStorage, URL params, or build your own adapter" />
        <DocCard to="/docs/api" label="API Reference" desc="Full useTrek options, state, actions, and TypeScript types" />
      </CardGrid>
    </article>
  )
}
