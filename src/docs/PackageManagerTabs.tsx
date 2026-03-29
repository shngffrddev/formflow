import { useState } from 'react'

const MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const
type Manager = typeof MANAGERS[number]

const ADD_COMMANDS: Record<Manager, (pkg: string) => string> = {
  pnpm: (pkg) => `pnpm add ${pkg}`,
  npm:  (pkg) => `npm install ${pkg}`,
  yarn: (pkg) => `yarn add ${pkg}`,
  bun:  (pkg) => `bun add ${pkg}`,
}

const DLX_COMMANDS: Record<Manager, (pkg: string) => string> = {
  pnpm: (pkg) => `pnpm ${pkg}`,
  npm:  (pkg) => `npx ${pkg}`,
  yarn: (pkg) => `yarn ${pkg}`,
  bun:  (pkg) => `bunx ${pkg}`,
}

interface Props {
  packages: string
  mode?: 'add' | 'dlx'
}

export function PackageManagerTabs({ packages, mode = 'add' }: Props) {
  const [active, setActive] = useState<Manager>('pnpm')
  const [copied, setCopied] = useState(false)

  const commands = mode === 'dlx' ? DLX_COMMANDS : ADD_COMMANDS
  const cmd = commands[active](packages)

  const copy = async () => {
    await navigator.clipboard.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800 my-5 group/pkgtabs">
      {/* Tab row */}
      <div className="flex items-center bg-zinc-900 border-b border-zinc-800 px-1 pt-1">
        {MANAGERS.map((m) => (
          <button
            key={m}
            onClick={() => setActive(m)}
            className={`relative px-3.5 py-2 text-[12px] font-mono font-medium transition-colors rounded-t-md ${
              active === m
                ? 'text-white bg-zinc-800'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {m}
            {active === m && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
        <button
          onClick={copy}
          className="ml-auto mr-2 mb-1 text-zinc-600 hover:text-zinc-200 transition-colors p-1.5 rounded hover:bg-zinc-700 opacity-0 group-hover/pkgtabs:opacity-100"
          title="Copy command"
        >
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>

      {/* Command output */}
      <div className="bg-[#0d1117] px-5 py-4 font-mono text-[13.5px] text-[#e6edf3] leading-relaxed flex items-center gap-2">
        <span className="text-blue-400 select-none">$</span>
        <span>{cmd}</span>
      </div>
    </div>
  )
}
