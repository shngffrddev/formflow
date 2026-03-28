import { useState } from 'react'
import { Link } from 'react-router-dom'

const PKG = '@shngffrddev/formflow zod'
const MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const
type Manager = typeof MANAGERS[number]
const CMD: Record<Manager, string> = {
  pnpm: `pnpm add ${PKG}`,
  npm:  `npm install ${PKG}`,
  yarn: `yarn add ${PKG}`,
  bun:  `bun add ${PKG}`,
}

function InstallTabs() {
  const [active, setActive] = useState<Manager>('pnpm')
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(CMD[active])
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-200 font-mono text-sm max-w-lg">
      <div className="flex items-center gap-1 bg-zinc-100 px-3 pt-2">
        {MANAGERS.map((m) => (
          <button
            key={m}
            onClick={() => setActive(m)}
            className={`px-3 py-1.5 rounded-t text-xs font-medium transition-colors ${
              active === m ? 'bg-white text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {m}
          </button>
        ))}
        <button onClick={copy} className="ml-auto text-zinc-400 hover:text-zinc-600 p-1 transition-colors" title="Copy">
          {copied
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          }
        </button>
      </div>
      <div className="bg-white px-5 py-3 text-zinc-800 text-sm">{CMD[active]}</div>
    </div>
  )
}

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
      <header className="border-b border-zinc-100 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="5" height="5" rx="1" />
                <rect x="9" y="2" width="5" height="5" rx="1" opacity=".6" />
                <rect x="2" y="9" width="5" height="5" rx="1" opacity=".6" />
                <rect x="9" y="9" width="5" height="5" rx="1" opacity=".3" />
              </svg>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">FormFlow</span>
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[11px] font-medium font-mono border border-zinc-200">v0.2.2</span>
          </div>
          <nav className="flex items-center gap-1 text-sm text-zinc-600">
            <Link to="/docs/introduction" className="px-3 py-1.5 rounded-md hover:text-zinc-900 hover:bg-zinc-100 transition-colors">Docs</Link>
            <Link to="/demo" className="px-3 py-1.5 rounded-md hover:text-zinc-900 hover:bg-zinc-100 transition-colors">Demo</Link>
            <a
              href="https://github.com/shngffrddev/formflow"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
            <Link
              to="/docs/getting-started"
              className="ml-1 bg-zinc-900 text-white px-4 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors font-medium"
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
            v0.2.2 — MIT License
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
        <div className="max-w-6xl mx-auto px-6 py-2">
          <InstallTabs />
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
            <a href="https://github.com/shngffrddev/formflow" className="hover:text-zinc-600 transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
