import { useEffect } from 'react'
import { useTOC } from './DocsTOCContext'

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold tracking-tight mb-3">{children}</h1>
}
function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return <h2 id={id} className="text-xl font-semibold tracking-tight mt-10 mb-3 scroll-mt-20">{children}</h2>
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

const ADAPTERS = [
  {
    name: 'localStorageAdapter',
    key: 'formtrek:<formId>',
    survives: 'Page reload, browser close',
    useWhen: 'Default choice for most forms',
  },
  {
    name: 'sessionStorageAdapter',
    key: 'formtrek:<formId>',
    survives: 'Page reload only',
    useWhen: 'Sensitive data you don\'t want to outlast the session',
  },
  {
    name: 'urlParamsAdapter',
    key: '?state= URL param',
    survives: 'URL is shared or bookmarked',
    useWhen: 'Shareable "resume later" links',
  },
  {
    name: 'nullAdapter',
    key: '—',
    survives: '—',
    useWhen: 'Disable persistence entirely',
  },
]

export function Persistence() {
  const { setItems } = useTOC()
  useEffect(() => {
    setItems([
      { id: 'how-it-works', label: 'How it works' },
      { id: 'built-in-adapters', label: 'Built-in adapters' },
      { id: 'disabling-persistence', label: 'Disabling persistence' },
      { id: 'custom-adapters', label: 'Custom adapters' },
      { id: 'resetting-state', label: 'Resetting saved state' },
    ])
    return () => setItems([])
  }, [setItems])
  return (
    <article>
      <div className="mb-8">
        <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Core Concepts</p>
        <H1>Persistence</H1>
        <p className="text-lg text-zinc-500 leading-relaxed">
          Form state serialises to JSON and can be saved anywhere. Users can close
          the tab and pick up exactly where they left off.
        </p>
      </div>

      <H2 id="how-it-works">How it works</H2>
      <P>
        On every call to <Code>actions.setValues()</Code> or <Code>actions.next()</Code>,
        FormTrek calls <Code>adapter.save(formId, values)</Code> with the latest accumulated
        values. On mount, it calls <Code>adapter.load(formId)</Code> and uses the result as
        the initial values. When the form completes, it calls <Code>adapter.clear(formId)</Code>.
      </P>

      <H2 id="built-in-adapters">Built-in adapters</H2>
      <div className="border border-zinc-100 rounded-xl overflow-hidden my-6">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Adapter</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Storage key</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Use when</th>
            </tr>
          </thead>
          <tbody>
            {ADAPTERS.map((a, i) => (
              <tr key={a.name} className={i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}>
                <td className="px-4 py-3 font-mono text-xs text-zinc-800">{a.name}</td>
                <td className="px-4 py-3 text-zinc-500 text-xs font-mono">{a.key}</td>
                <td className="px-4 py-3 text-zinc-600">{a.useWhen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pre>{`import {
  localStorageAdapter,
  sessionStorageAdapter,
  urlParamsAdapter,
  nullAdapter,
} from 'formtrek'

// Pass to useTrek:
useTrek({
  formId: 'signup',
  steps,
  persistence: localStorageAdapter, // ← swap adapters here
})`}</Pre>

      <H3>localStorageAdapter</H3>
      <P>
        Saves to <Code>window.localStorage</Code> under the key{' '}
        <Code>formtrek:&#123;formId&#125;</Code>. Survives page reloads and browser close.
        The default choice for most forms.
      </P>

      <H3>sessionStorageAdapter</H3>
      <P>
        Saves to <Code>window.sessionStorage</Code>. Survives page reloads but is
        cleared when the browser tab is closed. Good for forms containing sensitive
        data you don't want to persist indefinitely.
      </P>

      <H3>urlParamsAdapter</H3>
      <P>
        Encodes values as base64 JSON in the <Code>?state=</Code> URL parameter,
        updated via <Code>history.replaceState</Code>. The URL itself becomes the
        persistence layer — users can bookmark or share it to resume later.
      </P>
      <Pre>{`// User's URL looks like:
// https://yourapp.com/apply?state=eyJ2YWx1ZXMiOnsiZmlyc3ROYW1lIjoiSmFuZSJ9fQ==

// Decode it manually if needed:
const raw = new URLSearchParams(location.search).get('state')
const saved = raw ? JSON.parse(atob(raw)) : null`}</Pre>

      <H3>nullAdapter</H3>
      <P>
        A no-op adapter that disables persistence entirely. Load always returns
        <Code>null</Code>, save and clear do nothing. Useful in tests or when you want
        to manage persistence yourself via <Code>onComplete</Code>.
      </P>

      <H2 id="disabling-persistence">Disabling persistence</H2>
      <P>
        Pass <Code>persistence: null</Code> (or omit it) to disable persistence without
        importing <Code>nullAdapter</Code>:
      </P>
      <Pre>{`useTrek({
  formId: 'checkout',
  steps,
  persistence: null,  // no persistence
})`}</Pre>

      <H2 id="custom-adapters">Custom adapters</H2>
      <P>
        Any object that implements the <Code>PersistenceAdapter</Code> interface works.
        This lets you save form state to a database, Redis, or any other storage layer.
      </P>
      <Pre>{`import type { PersistenceAdapter } from 'formtrek'

// Example: save to your own API
const apiAdapter: PersistenceAdapter = {
  async load(formId) {
    const res = await fetch(\`/api/drafts/\${formId}\`)
    if (!res.ok) return null
    const { values } = await res.json()
    return values
  },

  async save(formId, values) {
    await fetch(\`/api/drafts/\${formId}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    })
  },

  async clear(formId) {
    await fetch(\`/api/drafts/\${formId}\`, { method: 'DELETE' })
  },
}`}</Pre>

      <P>
        FormTrek calls <Code>load</Code> and <Code>save</Code> with <Code>await</Code>,
        so async adapters work without any extra configuration.
      </P>

      <H2 id="resetting-state">Resetting saved state</H2>
      <P>
        Call <Code>actions.reset()</Code> to clear persisted values and return to step one.
        This calls <Code>adapter.clear(formId)</Code> internally.
      </P>
      <Pre>{`<button onClick={actions.reset}>Start over</button>`}</Pre>
    </article>
  )
}
