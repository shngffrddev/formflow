import { useEffect } from 'react'
import { useTOC } from './DocsTOCContext'
import {
  H1, H2, H3, Lead, P, Code, CodeBlock, Callout,
} from './DocComponents'

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
      <H1 badge="Core Concepts">Persistence</H1>
      <Lead>
        Form state serialises to JSON and can be saved anywhere. Users can close the
        tab and pick up exactly where they left off.
      </Lead>

      <H2 id="how-it-works">How it works</H2>
      <P>
        On every call to <Code>actions.setValues()</Code> or <Code>actions.next()</Code>,
        FormTrek calls <Code>adapter.save(formId, values)</Code> with the latest values.
        On mount, it calls <Code>adapter.load(formId)</Code> and merges the result into
        the initial values. When the form completes, it calls <Code>adapter.clear(formId)</Code>.
      </P>
      <P>
        Persistence adapters are swappable — pass any built-in adapter or your own
        implementation to the <Code>persistence</Code> option.
      </P>

      <H2 id="built-in-adapters">Built-in adapters</H2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <code className="text-[12px] font-mono font-semibold px-1.5 py-0.5 rounded text-blue-700 bg-blue-100">localStorageAdapter</code>
          <p className="text-sm text-zinc-700 mt-2 mb-1">The default choice for most forms.</p>
          <p className="text-[11px] text-zinc-500">Survives: <span className="font-medium">Page reload + browser close</span></p>
          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Key: formtrek:{'<formId>'}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
          <code className="text-[12px] font-mono font-semibold px-1.5 py-0.5 rounded text-emerald-700 bg-emerald-100">sessionStorageAdapter</code>
          <p className="text-sm text-zinc-700 mt-2 mb-1">Good for sensitive data that shouldn't outlast the session.</p>
          <p className="text-[11px] text-zinc-500">Survives: <span className="font-medium">Page reload only</span></p>
          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Key: formtrek:{'<formId>'}</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4">
          <code className="text-[12px] font-mono font-semibold px-1.5 py-0.5 rounded text-violet-700 bg-violet-100">urlParamsAdapter</code>
          <p className="text-sm text-zinc-700 mt-2 mb-1">URL becomes the persistence layer — users can bookmark to resume.</p>
          <p className="text-[11px] text-zinc-500">Survives: <span className="font-medium">URL is shared/bookmarked</span></p>
          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Key: ?state= URL param</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
          <code className="text-[12px] font-mono font-semibold px-1.5 py-0.5 rounded text-zinc-600 bg-zinc-100">nullAdapter</code>
          <p className="text-sm text-zinc-700 mt-2 mb-1">No-op adapter. Use to disable persistence without removing the option.</p>
          <p className="text-[11px] text-zinc-500">Survives: <span className="font-medium">Never persisted</span></p>
          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Key: —</p>
        </div>
      </div>

      <CodeBlock language="ts" filename="form.ts">{`import {
  localStorageAdapter,
  sessionStorageAdapter,
  urlParamsAdapter,
  nullAdapter,
} from 'formtrek'

// Swap adapters by changing this one line:
useTrek({
  formId: 'signup',
  steps,
  persistence: localStorageAdapter,
})`}</CodeBlock>

      <H3>localStorageAdapter</H3>
      <P>
        Saves to <Code>window.localStorage</Code> under the key{' '}
        <Code>formtrek:&#123;formId&#125;</Code>. Survives page reloads and browser close.
        The default choice for most forms.
      </P>

      <H3>sessionStorageAdapter</H3>
      <P>
        Saves to <Code>window.sessionStorage</Code>. Survives page reloads but is cleared
        when the browser tab is closed. Good for forms with sensitive data you don't want
        to persist indefinitely.
      </P>

      <H3>urlParamsAdapter</H3>
      <P>
        Encodes values as base64 JSON in the <Code>?state=</Code> URL parameter, updated
        via <Code>history.replaceState</Code>. The URL itself becomes the persistence
        layer — users can bookmark or share it to resume later.
      </P>
      <CodeBlock language="ts">{`// URL looks like:
// https://yourapp.com/apply?state=eyJ2YWx1ZXMiOnsiZmlyc3ROYW1lIjoiSmFuZSJ9fQ==

// Decode it manually if needed:
const raw = new URLSearchParams(location.search).get('state')
const saved = raw ? JSON.parse(atob(raw)) : null`}</CodeBlock>

      <H3>nullAdapter</H3>
      <P>
        A no-op adapter. Load always returns <Code>null</Code>, save and clear do nothing.
        Useful in tests or when you want full control via <Code>onComplete</Code>.
      </P>

      <H2 id="disabling-persistence">Disabling persistence</H2>
      <P>
        Pass <Code>persistence: null</Code> (or omit the option entirely) to disable
        persistence without importing <Code>nullAdapter</Code>:
      </P>
      <CodeBlock language="ts">{`useTrek({
  formId: 'checkout',
  steps,
  persistence: null,  // no persistence — values reset on unmount
})`}</CodeBlock>

      <H2 id="custom-adapters">Custom adapters</H2>
      <P>
        Any object that implements the <Code>PersistenceAdapter</Code> interface works.
        Save form state to a database, Redis, or any other storage layer.
      </P>
      <CodeBlock language="ts" filename="api-adapter.ts">{`import type { PersistenceAdapter } from 'formtrek'

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
}`}</CodeBlock>

      <Callout type="tip">
        FormTrek calls <Code>load</Code> and <Code>save</Code> with <Code>await</Code>,
        so async adapters work without any extra configuration.
      </Callout>

      <H2 id="resetting-state">Resetting saved state</H2>
      <P>
        Call <Code>actions.reset()</Code> to clear persisted values and return to step one.
        This calls <Code>adapter.clear(formId)</Code> internally.
      </P>
      <CodeBlock language="tsx">{`<button
  type="button"
  onClick={actions.reset}
  className="text-sm text-zinc-500 hover:text-red-600 transition-colors"
>
  Start over
</button>`}</CodeBlock>
    </article>
  )
}
