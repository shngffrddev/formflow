import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PackageManagerTabs } from './PackageManagerTabs'
import { useTOC } from './DocsTOCContext'

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold tracking-tight mb-3">{children}</h1>
}
function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return <h2 id={id} className="text-xl font-semibold tracking-tight mt-10 mb-3 scroll-mt-20">{children}</h2>
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

export function Introduction() {
  const { setItems } = useTOC()
  useEffect(() => {
    setItems([
      { id: 'why-formflow', label: 'Why FormTrek?' },
      { id: 'core-concepts', label: 'Core concepts' },
      { id: 'what-formflow-is-not', label: 'What FormTrek is not' },
      { id: 'quick-look', label: 'Quick look' },
    ])
    return () => setItems([])
  }, [setItems])

  return (
    <article>
      <div className="mb-8">
        <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Overview</p>
        <H1>Introduction</H1>
        <p className="text-lg text-zinc-500 leading-relaxed">
          FormTrek is a React hook library for multi-step forms with conditional branching,
          Zod validation, and partial persistence.
        </p>
      </div>

      <H2 id="why-formflow">Why FormTrek?</H2>
      <P>
        Multi-step forms appear simple until you need to conditionally show or skip steps
        based on earlier answers, let users save their progress and return later, or
        reuse the same validation logic on your server. Most solutions handle one of
        these well. FormTrek handles all three.
      </P>
      <P>
        The library is <strong>headless</strong> — it manages state, navigation, validation,
        and persistence, but leaves rendering entirely to you. You can use it with any UI
        library or plain HTML.
      </P>

      <H2 id="core-concepts">Core concepts</H2>
      <P>
        FormTrek is built around three ideas:
      </P>
      <div className="space-y-4 my-6">
        <div className="border border-zinc-100 rounded-xl p-5">
          <p className="font-semibold mb-1">Steps</p>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Each step is a plain object with an <Code>id</Code>, a <Code>title</Code>,
            an optional Zod <Code>schema</Code>, and an optional <Code>condition</Code>.
            Steps are defined once and reused everywhere.
          </p>
        </div>
        <div className="border border-zinc-100 rounded-xl p-5">
          <p className="font-semibold mb-1">Conditions</p>
          <p className="text-sm text-zinc-500 leading-relaxed">
            A condition is a plain object that FormTrek evaluates on every value change.
            If the condition resolves to <Code>false</Code>, the step is removed from
            the active sequence entirely — no JSX branching required.
          </p>
        </div>
        <div className="border border-zinc-100 rounded-xl p-5">
          <p className="font-semibold mb-1">Persistence adapters</p>
          <p className="text-sm text-zinc-500 leading-relaxed">
            A persistence adapter is an object with <Code>load</Code>, <Code>save</Code>,
            and <Code>clear</Code> methods. FormTrek ships four built-in adapters and
            accepts any custom implementation.
          </p>
        </div>
      </div>

      <H2 id="what-formflow-is-not">What FormTrek is not</H2>
      <P>
        FormTrek is not a form renderer. It does not generate inputs, labels, or layouts.
        It gives you state and a set of actions — what you render with them is up to you.
      </P>
      <P>
        It is also not a full form library in the sense of react-hook-form or Formik.
        It does not manage every keystroke or provide field-level registration.
        It validates at the <em>step level</em> on navigation, which is the right
        granularity for multi-step flows.
      </P>

      <H2 id="quick-look">Quick look</H2>
      <Pre>{`import { useTrek, localStorageAdapter } from 'formtrek'
import { z } from 'zod'

const { state, actions, currentStep } = useTrek({
  formId: 'signup',
  steps: [
    {
      id: 'basics',
      title: 'Basic info',
      schema: z.object({ name: z.string().min(1), email: z.string().email() }),
    },
    {
      id: 'team',
      title: 'Team details',
      condition: { field: 'accountType', op: 'eq', value: 'team' },
      schema: z.object({ teamName: z.string().min(1) }),
    },
  ],
  persistence: localStorageAdapter,
  onComplete: async (values) => { await submitToServer(values) },
})`}</Pre>

      <div className="mt-10 flex gap-4">
        <Link
          to="/docs/getting-started"
          className="bg-zinc-900 text-white text-sm px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
        >
          Get started →
        </Link>
      </div>
    </article>
  )
}
