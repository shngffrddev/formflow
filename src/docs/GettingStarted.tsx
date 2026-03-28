import { Link } from 'react-router-dom'

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold tracking-tight mb-3">{children}</h1>
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold tracking-tight mt-10 mb-3">{children}</h2>
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
function Step({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-7 h-7 rounded-full bg-zinc-900 text-white text-sm font-semibold flex items-center justify-center shrink-0">
        {n}
      </span>
      <span className="font-medium">{label}</span>
    </div>
  )
}

export function GettingStarted() {
  return (
    <article>
      <div className="mb-8">
        <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Overview</p>
        <H1>Getting Started</H1>
        <p className="text-lg text-zinc-500 leading-relaxed">
          Install FormFlow, define your steps, and have a working multi-step form in under
          five minutes.
        </p>
      </div>

      <H2>Installation</H2>
      <P>
        FormFlow requires React 18+ and Zod 3+. Both are peer dependencies — install
        them alongside FormFlow:
      </P>
      <Pre>{`npm install formflow zod`}</Pre>

      <H2>Your first form</H2>
      <P>
        Building a form with FormFlow involves four steps. Let's walk through each one.
      </P>

      <Step n={1} label="Define your steps" />
      <P>
        Each step is a plain object. The <Code>id</Code> uniquely identifies the step,
        <Code>schema</Code> is a Zod object schema for validation (or <Code>null</Code>
        for informational steps), and <Code>condition</Code> optionally controls whether
        the step is included.
      </P>
      <Pre>{`import { z } from 'zod'
import type { StepDefinition } from 'formflow'

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
    // Only shown when the user selected "professional" as account type
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
]`}</Pre>

      <Step n={2} label="Call useFormFlow" />
      <P>
        Pass your steps and a unique <Code>formId</Code> to <Code>useFormFlow</Code>.
        The hook returns <Code>state</Code>, <Code>actions</Code>, and
        <Code>currentStep</Code>.
      </P>
      <Pre>{`import { useFormFlow, localStorageAdapter } from 'formflow'

function MyForm() {
  const { state, actions, currentStep } = useFormFlow({
    formId: 'onboarding',
    steps,
    persistence: localStorageAdapter, // save progress to localStorage
    onComplete: async (values) => {
      await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(values),
      })
    },
  })

  // ...
}`}</Pre>

      <Step n={3} label="Render each step" />
      <P>
        Use <Code>currentStep.id</Code> to decide what to render. Field values live in
        <Code>state.values</Code> — update them with <Code>actions.setValues()</Code>.
        Validation errors are in <Code>state.steps[currentStep.id].errors</Code>.
      </P>
      <Pre>{`const stepErrors = state.steps[currentStep.id]?.errors ?? {}

return (
  <form onSubmit={(e) => { e.preventDefault(); actions.next() }}>
    {currentStep.id === 'personal' && (
      <>
        <input
          value={(state.values.firstName as string) ?? ''}
          onChange={(e) => actions.setValues({ firstName: e.target.value })}
          placeholder="First name"
        />
        {stepErrors.firstName && <p>{stepErrors.firstName}</p>}

        <input
          value={(state.values.email as string) ?? ''}
          onChange={(e) => actions.setValues({ email: e.target.value })}
          placeholder="Email"
        />
        {stepErrors.email && <p>{stepErrors.email}</p>}
      </>
    )}

    {currentStep.id === 'review' && (
      <pre>{JSON.stringify(state.values, null, 2)}</pre>
    )}

    <div>
      {!state.isFirstStep && (
        <button type="button" onClick={actions.back}>Back</button>
      )}
      <button type="submit">
        {state.isLastStep ? 'Submit' : 'Next'}
      </button>
    </div>
  </form>
)`}</Pre>

      <Step n={4} label="Handle completion" />
      <P>
        When the user submits the final step, <Code>actions.next()</Code> calls your
        <Code>onComplete</Code> callback with all accumulated values.
        <Code>state.isComplete</Code> becomes <Code>true</Code> afterwards — use it
        to show a success screen.
      </P>
      <Pre>{`if (state.isComplete) {
  return <p>Thanks! We'll be in touch.</p>
}`}</Pre>

      <H2>Full example</H2>
      <P>
        Putting it all together — a minimal but complete two-step form:
      </P>
      <Pre>{`import { useFormFlow, localStorageAdapter } from 'formflow'
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
  const { state, actions, currentStep } = useFormFlow({
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
      <h2>{currentStep.title} (step {state.currentIndex + 1} of {state.activeStepIds.length})</h2>

      {currentStep.id === 'info' && (
        <>
          <div>
            <input
              value={(state.values.name as string) ?? ''}
              onChange={(e) => actions.setValues({ name: e.target.value })}
              placeholder="Name"
            />
            {errors.name && <span>{errors.name}</span>}
          </div>
          <div>
            <input
              value={(state.values.email as string) ?? ''}
              onChange={(e) => actions.setValues({ email: e.target.value })}
              placeholder="Email"
            />
            {errors.email && <span>{errors.email}</span>}
          </div>
        </>
      )}

      {currentStep.id === 'confirm' && (
        <p>Submitting as: {state.values.name as string} ({state.values.email as string})</p>
      )}

      <div>
        {!state.isFirstStep && (
          <button type="button" onClick={actions.back}>Back</button>
        )}
        <button type="submit">{state.isLastStep ? 'Submit' : 'Next'}</button>
      </div>
    </form>
  )
}`}</Pre>

      <H2>Next steps</H2>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[
          { to: '/docs/conditional-branching', label: 'Conditional Branching', desc: 'Show or skip steps based on earlier answers' },
          { to: '/docs/validation', label: 'Validation', desc: 'Per-step Zod schemas and server-side reuse' },
          { to: '/docs/persistence', label: 'Persistence', desc: 'localStorage, sessionStorage, URL params, custom' },
          { to: '/docs/api', label: 'API Reference', desc: 'Full useFormFlow options, state, and actions' },
        ].map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="border border-zinc-100 rounded-xl p-4 hover:border-zinc-200 hover:bg-zinc-50 transition-colors group"
          >
            <p className="font-medium text-sm group-hover:text-zinc-900">{item.label} →</p>
            <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </article>
  )
}
