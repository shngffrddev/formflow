import { useState } from 'react'

const MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const
type Manager = typeof MANAGERS[number]

const COMMANDS: Record<Manager, (pkg: string) => string> = {
  pnpm: (pkg) => `pnpm add ${pkg}`,
  npm:  (pkg) => `npm install ${pkg}`,
  yarn: (pkg) => `yarn add ${pkg}`,
  bun:  (pkg) => `bun add ${pkg}`,
}

interface Props {
  packages: string
}

export function PackageManagerTabs({ packages }: Props) {
  const [active, setActive] = useState<Manager>('pnpm')

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800 my-4 font-mono text-sm">
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-zinc-900 px-3 pt-2">
        {MANAGERS.map((m) => (
          <button
            key={m}
            onClick={() => setActive(m)}
            className={`px-3 py-1.5 rounded-t text-xs font-medium transition-colors ${
              active === m
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {m}
          </button>
        ))}
        {/* Copy button */}
        <CopyButton text={COMMANDS[active](packages)} />
      </div>

      {/* Command */}
      <div className="bg-zinc-800 px-5 py-4 text-zinc-200">
        {COMMANDS[active](packages)}
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={copy}
      className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors p-1"
      title="Copy"
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}
