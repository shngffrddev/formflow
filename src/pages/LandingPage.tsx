import { Link } from 'react-router-dom'

const CODE_QUICK_START = `import { useFormFlow, localStorageAdapter } from 'formflow'
import { z } from 'zod'

const steps = [
  {
    id: 'contact',
    title: 'Contact Info',
    schema: z.object({
      email: z.string().email(),
      name: z.string().min(1),
    }),
  },
  {
    id: 'company',
    title: 'Company',
    // Only shown when the user is not a freelancer
    condition: { field: 'employmentType', op: 'neq', value: 'freelancer' },
    schema: z.object({ company: z.string().min(1) }),
  },
  {
    id: 'review',
    title: 'Review',
    schema: null,
  },
]

function MyForm() {
  const { state, actions, currentStep } = useFormFlow({
    formId: 'onboarding',
    steps,
    persistence: localStorageAdapter,
  })

  return (
    <form onSubmit={e => { e.preventDefault(); actions.next() }}>
      <h2>{currentStep.title}</h2>
      {/* render your fields here */}
      <button type="submit">
        {state.isLastStep ? 'Submit' : 'Next'}
      </button>
    </form>
  )
}`

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-zinc-900 rounded-xl p-6 overflow-x-auto text-sm leading-relaxed text-zinc-200 font-mono">
      <code>{code}</code>
    </pre>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Nav */}
      <header className="border-b border-zinc-100 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight">FormFlow</span>
          <nav className="flex items-center gap-6 text-sm text-zinc-600">
            <Link to="/docs/introduction" className="hover:text-zinc-900 transition-colors">Docs</Link>
            <Link to="/demo" className="hover:text-zinc-900 transition-colors">Demo</Link>
            <a
              href="https://github.com"
              className="hover:text-zinc-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <Link
              to="/docs/getting-started"
              className="bg-zinc-900 text-white px-4 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            v0.1.0 — MIT License
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
            Multi-step forms<br />that don't lose state.
          </h1>
          <p className="text-xl text-zinc-500 leading-relaxed mb-10 max-w-2xl">
            FormFlow handles the parts that actually matter: conditional steps that
            depend on earlier answers, saving progress so users can return later, and
            validation that works both client-side and server-side without duplicating
            the schema.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/docs/getting-started"
              className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-zinc-700 transition-colors"
            >
              Get started
            </Link>
            <Link
              to="/demo"
              className="border border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-medium hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
            >
              View demo →
            </Link>
          </div>
        </div>
      </section>

      {/* Install strip */}
      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-4">
          <span className="text-sm text-zinc-500 font-medium">Install</span>
          <code className="text-sm font-mono text-zinc-800 bg-white border border-zinc-200 px-4 py-2 rounded-lg select-all">
            npm install formflow zod
          </code>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-lg">
              🔀
            </div>
            <h3 className="font-semibold text-lg">Conditional branching</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              Steps can be shown, hidden, or reordered based on values from any earlier
              step. The branching logic lives in plain objects — no JSX, no custom DSL,
              just data.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-lg">
              ✅
            </div>
            <h3 className="font-semibold text-lg">Zod-powered validation</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              Each step has a Zod schema. Validation runs on submit and can be re-run
              server-side against the same schema — one definition, two layers of safety.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-lg">
              💾
            </div>
            <h3 className="font-semibold text-lg">Partial persistence</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              Form state serialises to JSON and can be saved anywhere — localStorage,
              a database, a URL param. Users can close the tab and pick up exactly where
              they left off.
            </p>
          </div>
        </div>
      </section>

      {/* Code example */}
      <section className="border-t border-zinc-100 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Simple API, powerful results.
              </h2>
              <p className="text-zinc-500 leading-relaxed mb-6">
                One hook. Define your steps as plain objects with Zod schemas and
                optional conditions. FormFlow handles navigation, validation, and
                persistence — you keep full control of rendering.
              </p>
              <ul className="space-y-3 text-sm text-zinc-600">
                {[
                  'Headless — bring your own UI components',
                  'TypeScript-first with full inference',
                  'Works with any React 18+ app',
                  'Zero UI dependencies',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <CodeBlock code={CODE_QUICK_START} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to build?</h2>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto">
          Read the docs or jump straight into the interactive demo to see conditional branching in action.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/docs/introduction"
            className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-zinc-700 transition-colors"
          >
            Read the docs
          </Link>
          <Link
            to="/demo"
            className="border border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-medium hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
          >
            Interactive demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-zinc-400">
          <span>FormFlow — MIT License</span>
          <div className="flex items-center gap-6">
            <Link to="/docs/introduction" className="hover:text-zinc-600 transition-colors">Docs</Link>
            <Link to="/demo" className="hover:text-zinc-600 transition-colors">Demo</Link>
            <a href="https://github.com" className="hover:text-zinc-600 transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
