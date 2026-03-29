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
        Get FormTrek installed, define your steps, and you'll have a working multi-step
        form. Shouldn't take more than five minutes.
      </Lead>

      <H2 id="installation">Installation</H2>
      <P>
        The easiest way is the CLI — it figures out which package manager you're using
        and installs everything:
      </P>
      <PackageManagerTabs packages="dlx formtrek init" mode="dlx" />
      <P>Or if you'd rather install manually — React 18+ and Zod 3+ are the only peer deps:</P>
      <PackageManagerTabs packages="formtrek zod" />

      <Callout type="note">
        No extra weight at runtime. React and Zod are peer deps — they're already in
        your project, so you're not pulling anything new in.
      </Callout>

      <H2 id="your-first-form">Your first form</H2>
      <P>
        There are four things to wire up. None of them are complicated.
      </P>

      <Steps>
        <Step n={1} label="Define your steps">
          <P>
            Each step is a plain object. Give it an <Code>id</Code>, a Zod <Code>schema</Code>{' '}
            for validation (or <Code>null</Code> if there's nothing to validate on that step),
            and optionally a <Code>condition</Code> to control when it appears.
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
            Hand off your steps and a <Code>formId</Code> to <Code>useTrek</Code>.
            Back comes <Code>state</Code> to read from, <Code>actions</Code> to call, and{' '}
            <Code>currentStep</Code> to branch on — that's all you'll need.
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
            Check <Code>currentStep.id</Code> to know which fields to show. Values live
            in <Code>state.values</Code>, validation errors in{' '}
            <Code>state.steps[currentStep.id].errors</Code>. Update values by calling{' '}
            <Code>actions.setValues()</Code>.
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
            On the last step, <Code>actions.next()</Code> calls your <Code>onComplete</Code>{' '}
            with everything that's been collected. When <Code>state.isComplete</Code> flips
            to true, swap in your success screen.
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
      <P>Here's everything together in one component:</P>
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
        <DocCard to="/docs/conditional-branching" label="Conditional Branching" desc="Show, skip, or reorder steps based on earlier answers" />
        <DocCard to="/docs/validation" label="Validation" desc="How validation works, where errors live, and how to reuse schemas on the server" />
        <DocCard to="/docs/persistence" label="Persistence" desc="Save form progress with the built-in adapters or write your own" />
        <DocCard to="/docs/api" label="API Reference" desc="Every option, every return value, all the TypeScript types" />
      </CardGrid>
    </article>
  )
}
