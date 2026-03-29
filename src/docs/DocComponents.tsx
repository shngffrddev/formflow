import { useState } from 'react'
import { Link } from 'react-router-dom'

// ─── Typography ───────────────────────────────────────────────────────────────

export function H1({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <div className="mb-2">
      {badge && (
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <span className="w-3.5 h-px bg-blue-400 inline-block" />
          {badge}
        </p>
      )}
      <h1 className="text-[2.2rem] font-bold tracking-tight text-zinc-950 leading-tight">
        {children}
      </h1>
    </div>
  )
}

export function H2({
  children, id,
}: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="group flex items-center gap-2 text-[1.2rem] font-semibold text-zinc-900 mt-12 mb-4 scroll-mt-24 pt-8 border-t border-zinc-100"
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-300 hover:text-zinc-500"
          aria-hidden="true"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </a>
      )}
    </h2>
  )
}

export function H3({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="text-[.95rem] font-semibold text-zinc-900 mt-7 mb-2.5 scroll-mt-24">
      {children}
    </h3>
  )
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] text-zinc-600 leading-7 mb-4">{children}</p>
  )
}

export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[1.05rem] text-zinc-500 leading-relaxed mb-8 mt-3">{children}</p>
  )
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="inline-flex items-center bg-zinc-100 border border-zinc-200/80 text-zinc-800 text-[13px] px-1.5 py-0.5 rounded-md font-mono leading-none">
      {children}
    </code>
  )
}

// ─── CodeBlock ────────────────────────────────────────────────────────────────

interface CodeBlockProps {
  children: string
  filename?: string
  language?: string
}

export function CodeBlock({ children, filename, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(children.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800 my-5 group/code">
      {/* Header bar */}
      <div className="flex items-center gap-2.5 bg-zinc-900 px-4 py-2.5 border-b border-zinc-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        </div>
        {filename && (
          <span className="text-zinc-500 text-[12px] font-mono ml-1">{filename}</span>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {language && (
            <span className="text-[10px] font-sans font-semibold text-zinc-500 uppercase tracking-widest border border-zinc-700 px-1.5 py-0.5 rounded">
              {language}
            </span>
          )}
          <button
            onClick={copy}
            className="text-zinc-600 hover:text-zinc-200 transition-colors p-1 rounded hover:bg-zinc-800 opacity-0 group-hover/code:opacity-100"
            title="Copy code"
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
        </div>
      </div>
      {/* Code body */}
      <pre className="bg-[#0d1117] text-[#e6edf3] text-[13px] font-mono p-5 overflow-x-auto leading-[1.7]">
        <code>{children}</code>
      </pre>
    </div>
  )
}

// ─── Callout ──────────────────────────────────────────────────────────────────

const CALLOUT_CONFIG = {
  note: {
    bg: 'bg-blue-50 border-blue-200',
    bar: 'bg-blue-500',
    label: 'text-blue-700',
    body: 'text-blue-900',
    icon: (
      <svg className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    title: 'Note',
  },
  tip: {
    bg: 'bg-emerald-50 border-emerald-200',
    bar: 'bg-emerald-500',
    label: 'text-emerald-700',
    body: 'text-emerald-900',
    icon: (
      <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
        <line x1="10" y1="22" x2="14" y2="22" />
      </svg>
    ),
    title: 'Tip',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    bar: 'bg-amber-500',
    label: 'text-amber-700',
    body: 'text-amber-900',
    icon: (
      <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
    title: 'Warning',
  },
  important: {
    bg: 'bg-violet-50 border-violet-200',
    bar: 'bg-violet-500',
    label: 'text-violet-700',
    body: 'text-violet-900',
    icon: (
      <svg className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Important',
  },
}

export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: keyof typeof CALLOUT_CONFIG
  title?: string
  children: React.ReactNode
}) {
  const c = CALLOUT_CONFIG[type]
  return (
    <div className={`relative rounded-xl border my-5 overflow-hidden ${c.bg}`}>
      <span className={`absolute left-0 top-0 bottom-0 w-1 ${c.bar}`} />
      <div className="pl-5 pr-4 py-4">
        <div className={`flex items-start gap-2 text-sm font-semibold mb-1 ${c.label}`}>
          {c.icon}
          <span className="uppercase tracking-wider text-[11px] mt-0.5">{title ?? c.title}</span>
        </div>
        <div className={`text-[14px] leading-relaxed ${c.body} [&_code]:bg-white/60 [&_code]:border-current/20`}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────

export function Steps({ children }: { children: React.ReactNode }) {
  return <div className="my-8 space-y-0">{children}</div>
}

export function Step({
  n, label, children,
}: { n: number; label: string; children?: React.ReactNode }) {
  return (
    <div className="flex gap-5 group/step">
      {/* Left column: circle + line */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center shrink-0 ring-4 ring-white z-10">
          {n}
        </div>
        <div className="w-px flex-1 bg-zinc-200 mt-1 mb-1 group-last/step:hidden" />
      </div>
      {/* Right column: content */}
      <div className="flex-1 min-w-0 pb-8 group-last/step:pb-0">
        <p className="font-semibold text-zinc-900 text-[15px] mb-3 pt-1">{label}</p>
        <div>{children}</div>
      </div>
    </div>
  )
}

// ─── Tables ───────────────────────────────────────────────────────────────────

export function TypeBadge({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-[11.5px] font-mono text-violet-700 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded">
      {children}
    </code>
  )
}

export function RequiredBadge() {
  return (
    <span className="ml-1.5 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full uppercase tracking-wide align-middle">
      req
    </span>
  )
}

interface PropRowData {
  name: string
  type: string
  required?: boolean
  defaultVal?: string
  desc: React.ReactNode
}

export function PropTable({ rows }: { rows: PropRowData[] }) {
  return (
    <div className="rounded-xl border border-zinc-200 overflow-hidden my-5 text-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-36">Prop</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-40">Type</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-24">Default</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((row, i) => (
            <tr key={row.name} className={i % 2 !== 0 ? 'bg-zinc-50/50' : ''}>
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-[13px] text-zinc-800 font-medium">{row.name}</code>
                {row.required && <RequiredBadge />}
              </td>
              <td className="px-4 py-3 align-top">
                <TypeBadge>{row.type}</TypeBadge>
              </td>
              <td className="px-4 py-3 align-top font-mono text-[12px] text-zinc-400">
                {row.defaultVal ?? '—'}
              </td>
              <td className="px-4 py-3 align-top text-[14px] text-zinc-600 leading-relaxed">
                {row.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface Prop3Row {
  prop: string
  type: string
  desc: React.ReactNode
}

export function PropTable3({ rows }: { rows: Prop3Row[] }) {
  return (
    <div className="rounded-xl border border-zinc-200 overflow-hidden my-5 text-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-36">Property</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-44">Type</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((row, i) => (
            <tr key={row.prop} className={i % 2 !== 0 ? 'bg-zinc-50/50' : ''}>
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-[13px] text-zinc-800 font-medium">{row.prop}</code>
              </td>
              <td className="px-4 py-3 align-top">
                <TypeBadge>{row.type}</TypeBadge>
              </td>
              <td className="px-4 py-3 align-top text-[14px] text-zinc-600 leading-relaxed">
                {row.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface Method3Row {
  method: string
  sig: string
  desc: React.ReactNode
}

export function MethodTable({ rows }: { rows: Method3Row[] }) {
  return (
    <div className="rounded-xl border border-zinc-200 overflow-hidden my-5 text-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-32">Method</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-56">Signature</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((row, i) => (
            <tr key={row.method} className={i % 2 !== 0 ? 'bg-zinc-50/50' : ''}>
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-[13px] text-zinc-800 font-medium">{row.method}</code>
              </td>
              <td className="px-4 py-3 align-top">
                <TypeBadge>{row.sig}</TypeBadge>
              </td>
              <td className="px-4 py-3 align-top text-[14px] text-zinc-600 leading-relaxed">
                {row.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Generic 2-col table
interface SimpleRow { a: React.ReactNode; b: React.ReactNode }
export function SimpleTable({
  headers, rows,
}: { headers: [string, string]; rows: SimpleRow[] }) {
  return (
    <div className="rounded-xl border border-zinc-200 overflow-hidden my-5 text-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-200">
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 !== 0 ? 'bg-zinc-50/50' : ''}>
              <td className="px-4 py-3 align-top font-mono text-[13px] text-zinc-800">{row.a}</td>
              <td className="px-4 py-3 align-top text-[14px] text-zinc-600">{row.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Card Grid (next-steps navigation) ───────────────────────────────────────

export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">{children}</div>
  )
}

export function DocCard({ to, label, desc }: { to: string; label: string; desc: string }) {
  return (
    <Link
      to={to}
      className="group block p-4 rounded-xl border border-zinc-200 hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-transparent transition-all"
    >
      <div className="flex items-center justify-between mb-1.5">
        <p className="font-semibold text-sm text-zinc-900 group-hover:text-blue-700 transition-colors">
          {label}
        </p>
        <svg
          className="w-4 h-4 text-zinc-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all"
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
      <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
    </Link>
  )
}

// ─── Feature grid ─────────────────────────────────────────────────────────────

export function FeatureGrid({ items }: { items: { icon: string; label: string; desc: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
      {items.map(item => (
        <div key={item.label} className="border border-zinc-100 rounded-xl p-4 bg-zinc-50/50">
          <div className="text-xl mb-2">{item.icon}</div>
          <p className="font-semibold text-sm text-zinc-900 mb-1">{item.label}</p>
          <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  )
}
