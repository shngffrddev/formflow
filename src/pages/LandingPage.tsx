import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@components/Logo'

// ─── Data ─────────────────────────────────────────────────────────────────────

const GITHUB = 'https://github.com/shngffrddev/formtrek'
const NPM = 'https://www.npmjs.com/package/formtrek'

const MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const
type Manager = typeof MANAGERS[number]

const ADD_CMD: Record<Manager, string> = {
  pnpm: 'pnpm add formtrek zod',
  npm:  'npm install formtrek zod',
  yarn: 'yarn add formtrek zod',
  bun:  'bun add formtrek zod',
}

const STATS = [
  { value: '~2.1kb', label: 'gzipped' },
  { value: '0', label: 'runtime deps' },
  { value: 'React 18+', label: 'compatible' },
  { value: 'MIT', label: 'open source' },
]

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
      </svg>
    ),
    label: 'Conditional branching',
    desc: 'Steps appear or disappear based on what the user has already entered. Logic lives in plain objects — no JSX, no custom DSL, no prop drilling.',
    accent: 'from-blue-50 to-blue-50/0 border-blue-100',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="m9 12 2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    label: 'Zod validation',
    desc: 'Per-step Zod schemas validated on navigation. The same schema runs on your server — one definition, two layers of safety, zero duplication.',
    accent: 'from-emerald-50 to-emerald-50/0 border-emerald-100',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
      </svg>
    ),
    label: 'Partial persistence',
    desc: 'Built-in localStorage, sessionStorage, URL params, or a custom API adapter. Users close the tab and resume exactly where they left off.',
    accent: 'from-violet-50 to-violet-50/0 border-violet-100',
    iconBg: 'bg-violet-100 text-violet-700',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M7 21a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12a4 4 0 0 1-4 4zm0 0h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 0 1 2.828 0l2.829 2.829a2 2 0 0 1 0 2.828l-8.486 8.485M7 17h.01"/>
      </svg>
    ),
    label: 'Headless by design',
    desc: 'FormTrek manages state, navigation, validation, and persistence. Rendering is entirely yours — any UI library, any styling approach.',
    accent: 'from-amber-50 to-amber-50/0 border-amber-100',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
      </svg>
    ),
    label: 'TypeScript-first',
    desc: 'Fully typed generics throughout. State, actions, and step definitions all infer correctly from your schema definitions.',
    accent: 'from-sky-50 to-sky-50/0 border-sky-100',
    iconBg: 'bg-sky-100 text-sky-700',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    label: 'Tiny footprint',
    desc: 'Under 2.1kb gzipped with zero runtime dependencies. React and Zod are peer deps — only pay for what you already have.',
    accent: 'from-rose-50 to-rose-50/0 border-rose-100',
    iconBg: 'bg-rose-100 text-rose-700',
  },
]

const CODE = `import { useTrek, localStorageAdapter } from 'formtrek'
import { z } from 'zod'

const { state, actions, currentStep } = useTrek({
  formId: 'onboarding',
  steps: [
    {
      id: 'basics',
      title: 'Basic Info',
      schema: z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
    },
    {
      id: 'company',
      title: 'Company',
      // Only shown for professional accounts
      condition: { field: 'accountType', op: 'eq', value: 'pro' },
      schema: z.object({ company: z.string().min(1) }),
    },
    {
      id: 'review',
      title: 'Review & Submit',
      schema: null,
    },
  ],
  persistence: localStorageAdapter,
  onComplete: async (values) => {
    await submitToAPI(values)
  },
})`

// ─── Sub-components ───────────────────────────────────────────────────────────

function InstallTabs() {
  const [active, setActive] = useState<Manager>('pnpm')
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(ADD_CMD[active])
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800 font-mono text-sm w-full max-w-sm group/install">
      <div className="flex items-center bg-zinc-900 border-b border-zinc-800 px-1 pt-1">
        {MANAGERS.map((m) => (
          <button
            key={m}
            onClick={() => setActive(m)}
            className={`relative px-3 py-1.5 text-[11px] font-medium transition-colors rounded-t ${
              active === m ? 'text-white bg-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {m}
            {active === m && <span className="absolute bottom-0 left-0 right-0 h-px bg-blue-500 rounded-full" />}
          </button>
        ))}
        <button
          onClick={copy}
          className="ml-auto mr-1.5 mb-1 text-zinc-600 hover:text-zinc-200 transition-colors p-1.5 rounded hover:bg-zinc-700 opacity-0 group-hover/install:opacity-100"
          title="Copy"
        >
          {copied
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          }
        </button>
      </div>
      <div className="bg-[#0d1117] px-4 py-3 text-[#e6edf3] flex items-center gap-2">
        <span className="text-blue-400 select-none text-xs">$</span>
        <span className="text-[13px]">{ADD_CMD[active]}</span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">

      {/* ── Nav ── */}
      <header className="border-b border-zinc-100 sticky top-0 bg-white/90 backdrop-blur-md z-20">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={24} />
            <span className="font-semibold text-[15px] tracking-tight">FormTrek</span>
            <span className="hidden sm:inline px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[11px] font-mono border border-zinc-200">v0.2.2</span>
          </div>
          <nav className="flex items-center gap-0.5 text-sm">
            <Link to="/docs/introduction" className="px-3 py-1.5 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">Docs</Link>
            <Link to="/demo" className="px-3 py-1.5 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">Demo</Link>
            <a
              href={GITHUB}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <Link
              to="/docs/getting-started"
              className="ml-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors font-medium text-sm"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, #dbeafe 0%, white 65%)' }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(to right, #1e40af 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              v0.2.2 is out — MIT License
            </div>

            {/* Headline */}
            <h1 className="text-[3.4rem] sm:text-[4rem] font-bold tracking-tight leading-[1.1] mb-6 text-zinc-950">
              Multi-step forms that{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-blue-600">actually work.</span>
                <span
                  className="absolute bottom-1 left-0 right-0 h-3 -z-0 opacity-30 rounded"
                  style={{ background: 'linear-gradient(90deg, #bfdbfe, #93c5fd)' }}
                />
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-500 leading-relaxed mb-10 max-w-xl mx-auto">
              Conditional branching, Zod validation, and partial persistence —
              in one headless React hook. You own the UI, FormTrek owns the complexity.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link
                to="/docs/getting-started"
                className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-700 text-white px-7 py-3 rounded-xl font-semibold transition-colors text-[15px]"
              >
                Get started
              </Link>
              <Link
                to="/demo"
                className="w-full sm:w-auto border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 px-7 py-3 rounded-xl font-semibold transition-colors text-[15px]"
              >
                View demo →
              </Link>
            </div>

            {/* Install command */}
            <div className="flex justify-center">
              <InstallTabs />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {STATS.map(s => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-zinc-900 font-mono">{s.value}</span>
                <span className="text-sm text-zinc-400">{s.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-sm text-zinc-500">
              <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 transition-colors">
                Open source
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-zinc-500">
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <a href={NPM} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 transition-colors">
                npm
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
            <span className="w-4 h-px bg-blue-400 inline-block" /> Why FormTrek
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Everything multi-step forms need
          </h2>
          <p className="text-zinc-500 mt-3 max-w-lg mx-auto">
            One hook handles state, navigation, branching, validation, and persistence.
            You stay focused on the UI.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div
              key={f.label}
              className={`group relative rounded-xl border bg-gradient-to-b p-5 hover:shadow-sm transition-all hover:-translate-y-0.5 ${f.accent}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 ${f.iconBg}`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-zinc-900 mb-1.5">{f.label}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Code showcase ── */}
      <section className="bg-zinc-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: explanation */}
            <div>
              <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <span className="w-4 h-px bg-blue-500 inline-block" /> The API
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
                One hook.<br />Everything included.
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Call <code className="text-blue-400 font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">useTrek()</code> once per form.
                Pass your step definitions — plain objects with Zod schemas and optional conditions.
                Get back <code className="text-blue-400 font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">state</code>,{' '}
                <code className="text-blue-400 font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">actions</code>, and{' '}
                <code className="text-blue-400 font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">currentStep</code>.
              </p>

              <ul className="space-y-3">
                {[
                  { label: 'Conditions re-evaluate on every value change', sub: 'Synchronous, pure, zero config' },
                  { label: 'Validation runs on next() automatically', sub: 'Async Zod schemas supported' },
                  { label: 'Persistence hydrates on mount', sub: 'Swap adapters with one line change' },
                  { label: 'onComplete receives all accumulated values', sub: 'Works with any async submit handler' },
                ].map(item => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm text-zinc-200 font-medium leading-snug">{item.label}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{item.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 mt-8">
                <Link
                  to="/docs/api"
                  className="text-sm font-medium text-white border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition-colors"
                >
                  API Reference
                </Link>
                <Link
                  to="/demo"
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  See it live →
                </Link>
              </div>
            </div>

            {/* Right: code block */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 group/code">
              <div className="flex items-center gap-2.5 bg-zinc-900 px-4 py-2.5 border-b border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                </div>
                <span className="text-zinc-500 text-xs font-mono ml-1">onboarding-form.tsx</span>
                <span className="ml-auto text-[10px] font-sans font-semibold text-zinc-500 uppercase tracking-wider border border-zinc-700 px-1.5 py-0.5 rounded">TSX</span>
              </div>
              <pre className="bg-[#0d1117] text-[#e6edf3] text-[12.5px] font-mono p-5 overflow-x-auto leading-[1.75]">
                <code>{CODE}</code>
              </pre>
            </div>

          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
            <span className="w-4 h-px bg-blue-400 inline-block" /> Quick start
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">Up and running in minutes</h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Connecting line */}
          <div className="absolute left-5 top-10 bottom-10 w-px bg-zinc-100" />

          {[
            {
              n: 1,
              label: 'Install',
              desc: <>Run <code className="font-mono text-sm bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700">pnpm dlx formtrek init</code> — the CLI detects your package manager and installs everything automatically.</>,
            },
            {
              n: 2,
              label: 'Define your steps',
              desc: 'Create an array of step definitions, each with an id, schema, and optional condition. Steps are plain objects — no class instances, no decorators.',
            },
            {
              n: 3,
              label: 'Call useTrek()',
              desc: 'Pass your steps to useTrek. Use state and actions to wire up your inputs, navigation buttons, and submit handler.',
            },
            {
              n: 4,
              label: 'Ship it',
              desc: 'Add persistence to let users resume later, reuse your schemas server-side for double-validation, and add conditions to branch the flow based on any earlier answer.',
            },
          ].map((step) => (
            <div key={step.n} className="flex gap-6 pb-8 last:pb-0 relative">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center ring-4 ring-white z-10">
                  {step.n}
                </div>
              </div>
              <div className="pb-2 pt-2">
                <p className="font-semibold text-zinc-900 mb-1.5">{step.label}</p>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="relative overflow-hidden border-t border-zinc-100"
        style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 100%, #dbeafe 0%, white 60%)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
            Ready to build?
          </h2>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto">
            Read the docs for the full API or jump straight into the demo to see conditional branching live.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/docs/introduction"
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-700 text-white px-7 py-3 rounded-xl font-semibold transition-colors"
            >
              Read the docs
            </Link>
            <Link
              to="/demo"
              className="w-full sm:w-auto border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 px-7 py-3 rounded-xl font-semibold transition-colors"
            >
              Interactive demo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-100 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Logo size={18} />
              <span className="text-sm font-medium text-zinc-700">FormTrek</span>
              <span className="text-zinc-300">·</span>
              <span className="text-sm text-zinc-400">MIT License</span>
            </div>
            <div className="flex items-center gap-5 text-sm text-zinc-400">
              <Link to="/docs/introduction" className="hover:text-zinc-700 transition-colors">Docs</Link>
              <Link to="/demo" className="hover:text-zinc-700 transition-colors">Demo</Link>
              <a href={NPM} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 transition-colors">npm</a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
