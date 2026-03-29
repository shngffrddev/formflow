import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { TOCProvider, useTOC } from './DocsTOCContext'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Logo } from '@components/Logo'

// ── Focus trap hook ───────────────────────────────────────────────────────────

function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !containerRef.current) return
    const el = containerRef.current
    const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const getFocusable = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE))
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = getFocusable()
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    el.addEventListener('keydown', trap)
    return () => el.removeEventListener('keydown', trap)
  }, [active, containerRef])
}

const VERSION = 'v0.2.2'
const GITHUB = 'https://github.com/shngffrddev/formtrek'

const NAV = [
  {
    label: 'Getting Started',
    items: [
      { to: '/docs/introduction', label: 'Introduction' },
      { to: '/docs/getting-started', label: 'Quick Start' },
    ],
  },
  {
    label: 'Core Concepts',
    items: [
      { to: '/docs/conditional-branching', label: 'Conditional Branching' },
      { to: '/docs/validation', label: 'Validation' },
      { to: '/docs/persistence', label: 'Persistence' },
    ],
  },
  {
    label: 'API',
    items: [
      { to: '/docs/api', label: 'API Reference' },
    ],
  },
]

const BREADCRUMB_LABELS: Record<string, string> = {
  '/docs/introduction': 'Introduction',
  '/docs/getting-started': 'Quick Start',
  '/docs/conditional-branching': 'Conditional Branching',
  '/docs/validation': 'Validation',
  '/docs/persistence': 'Persistence',
  '/docs/api': 'API Reference',
}

const SECTION_LABELS: Record<string, string> = {
  '/docs/introduction': 'Getting Started',
  '/docs/getting-started': 'Getting Started',
  '/docs/conditional-branching': 'Core Concepts',
  '/docs/validation': 'Core Concepts',
  '/docs/persistence': 'Core Concepts',
  '/docs/api': 'API',
}

const SEARCH_INDEX = [
  { label: 'Introduction', path: '/docs/introduction', context: 'Getting Started' },
  { label: 'Quick Start', path: '/docs/getting-started', context: 'Getting Started' },
  { label: 'Conditional Branching', path: '/docs/conditional-branching', context: 'Core Concepts' },
  { label: 'Validation', path: '/docs/validation', context: 'Core Concepts' },
  { label: 'Persistence', path: '/docs/persistence', context: 'Core Concepts' },
  { label: 'API Reference', path: '/docs/api', context: 'API' },
  { label: 'Why FormTrek?', path: '/docs/introduction#why-formflow', context: 'Introduction' },
  { label: 'Core concepts', path: '/docs/introduction#core-concepts', context: 'Introduction' },
  { label: 'What FormTrek is not', path: '/docs/introduction#what-formflow-is-not', context: 'Introduction' },
  { label: 'Quick look', path: '/docs/introduction#quick-look', context: 'Introduction' },
  { label: 'Installation', path: '/docs/getting-started#installation', context: 'Getting Started' },
  { label: 'Your first form', path: '/docs/getting-started#your-first-form', context: 'Getting Started' },
  { label: 'Full example', path: '/docs/getting-started#full-example', context: 'Getting Started' },
  { label: 'Next steps', path: '/docs/getting-started#next-steps', context: 'Getting Started' },
  { label: 'How conditions work', path: '/docs/conditional-branching#how-it-works', context: 'Conditional Branching' },
  { label: 'Simple conditions', path: '/docs/conditional-branching#simple-conditions', context: 'Conditional Branching' },
  { label: 'Compound conditions', path: '/docs/conditional-branching#compound-conditions', context: 'Conditional Branching' },
  { label: 'Step ordering', path: '/docs/conditional-branching#step-ordering', context: 'Conditional Branching' },
  { label: 'Accessing active steps', path: '/docs/conditional-branching#accessing-active-steps', context: 'Conditional Branching' },
  { label: 'Attaching a schema', path: '/docs/validation#attaching-a-schema', context: 'Validation' },
  { label: 'Accessing errors', path: '/docs/validation#accessing-errors', context: 'Validation' },
  { label: 'Skipping validation', path: '/docs/validation#skipping-validation', context: 'Validation' },
  { label: 'Cross-field validation', path: '/docs/validation#cross-field-validation', context: 'Validation' },
  { label: 'Async validation', path: '/docs/validation#async-validation', context: 'Validation' },
  { label: 'Server-side reuse', path: '/docs/validation#server-side-reuse', context: 'Validation' },
  { label: 'How persistence works', path: '/docs/persistence#how-it-works', context: 'Persistence' },
  { label: 'Built-in adapters', path: '/docs/persistence#built-in-adapters', context: 'Persistence' },
  { label: 'Disabling persistence', path: '/docs/persistence#disabling-persistence', context: 'Persistence' },
  { label: 'Custom adapters', path: '/docs/persistence#custom-adapters', context: 'Persistence' },
  { label: 'Resetting saved state', path: '/docs/persistence#resetting-state', context: 'Persistence' },
  { label: 'useTrek()', path: '/docs/api#use-form-flow', context: 'API Reference' },
  { label: 'StepDefinition', path: '/docs/api#step-definition', context: 'API Reference' },
  { label: 'TrekState', path: '/docs/api#form-flow-state', context: 'API Reference' },
  { label: 'StepState', path: '/docs/api#step-state', context: 'API Reference' },
  { label: 'TrekActions', path: '/docs/api#form-flow-actions', context: 'API Reference' },
  { label: 'Condition', path: '/docs/api#condition', context: 'API Reference' },
  { label: 'PersistenceAdapter', path: '/docs/api#persistence-adapter', context: 'API Reference' },
  { label: 'All exports', path: '/docs/api#all-exports', context: 'API Reference' },
]

// ── Search modal ─────────────────────────────────────────────────────────────

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])
  useFocusTrap(dialogRef, true)

  const results = query.trim().length > 0
    ? SEARCH_INDEX.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.context.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : SEARCH_INDEX.slice(0, 6)

  useEffect(() => { setSelected(0) }, [query])

  const go = useCallback((path: string) => {
    const [page, hash] = path.split('#')
    if (page) navigate(page)
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    }
    onClose()
  }, [navigate, onClose])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && results[selected]) go(results[selected].path)
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl shadow-zinc-900/20 border border-zinc-200/80 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-100">
          <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search documentation…"
            className="flex-1 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none bg-transparent"
          />
          <kbd className="shrink-0 text-[10px] font-mono bg-zinc-100 border border-zinc-200 rounded px-1.5 py-0.5 text-zinc-400">ESC</kbd>
        </div>

        {/* Results */}
        <ul className="max-h-80 overflow-y-auto py-1.5">
          {results.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-zinc-400">No results for "{query}"</li>
          ) : results.map((item, i) => (
            <li key={item.path}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === selected ? 'bg-blue-50' : 'hover:bg-zinc-50'
                }`}
                onClick={() => go(item.path)}
                onMouseEnter={() => setSelected(i)}
              >
                {item.path.includes('#') ? (
                  <svg className="w-3.5 h-3.5 text-zinc-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h10" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-zinc-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${i === selected ? 'text-blue-700' : 'text-zinc-800'}`}>{item.label}</p>
                  <p className="text-xs text-zinc-400 truncate">{item.context}</p>
                </div>
                {i === selected && (
                  <kbd className="shrink-0 text-[10px] font-mono bg-blue-100 border border-blue-200 rounded px-1 py-0.5 text-blue-600">↵</kbd>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="border-t border-zinc-100 px-4 py-2 flex items-center gap-4 text-[11px] text-zinc-400 bg-zinc-50/50">
          <span className="flex items-center gap-1"><kbd className="font-mono bg-white border border-zinc-200 px-1 rounded text-zinc-500">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="font-mono bg-white border border-zinc-200 px-1 rounded text-zinc-500">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="font-mono bg-white border border-zinc-200 px-1 rounded text-zinc-500">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  )
}

// ── Mobile drawer ─────────────────────────────────────────────────────────────

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const drawerRef = useRef<HTMLDivElement>(null)
  useFocusTrap(drawerRef, open)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-14 border-b border-zinc-100">
          <Logo size={24} />
          <span className="font-semibold text-[15px] tracking-tight">FormTrek</span>
          <button onClick={onClose} aria-label="Close navigation" className="ml-auto text-zinc-400 hover:text-zinc-700 p-1">
            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-4 py-6">
          {NAV.map(group => (
            <div key={group.label} className="mb-6">
              <p className="text-[10.5px] font-semibold text-zinc-400 uppercase tracking-widest px-2 mb-2">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main docs inner ───────────────────────────────────────────────────────────

function DocsInner() {
  const location = useLocation()
  const { items: tocItems, activeId, setActiveId } = useTOC()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Close mobile nav on route change
  useEffect(() => { setMobileNavOpen(false) }, [location.pathname])

  // Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Scroll-spy
  useEffect(() => {
    if (tocItems.length === 0) { setActiveId(null); return }
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          )
          setActiveId(top.target.id)
        }
      },
      { rootMargin: '-5% 0px -70% 0px', threshold: 0 }
    )
    tocItems.forEach(item => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    if (tocItems[0]) setActiveId(tocItems[0].id)
    return () => observer.disconnect()
  }, [tocItems, setActiveId])

  const allItems = NAV.flatMap(g => g.items)
  const currentIdx = allItems.findIndex(i => i.to === location.pathname)
  const prev = currentIdx > 0 ? allItems[currentIdx - 1] : null
  const next = currentIdx < allItems.length - 1 ? allItems[currentIdx + 1] : null
  const breadcrumbPage = BREADCRUMB_LABELS[location.pathname]
  const breadcrumbSection = SECTION_LABELS[location.pathname]

  return (
    <div className="min-h-screen bg-white text-zinc-900">

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 h-14 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-[90rem] mx-auto px-4 h-full flex items-center gap-3">

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden text-zinc-500 hover:text-zinc-900 p-1 -ml-1 mr-1"
            aria-label="Open navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-2">
            <Logo size={24} />
            <span className="font-semibold text-[15px] tracking-tight text-zinc-900">FormTrek</span>
          </Link>

          {/* Version badge */}
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[11px] font-mono border border-zinc-200/80">
            {VERSION}
          </span>

          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex ml-2 items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-400 hover:border-zinc-300 hover:bg-zinc-50 transition-all bg-white w-56 group"
          >
            <svg className="w-3.5 h-3.5 shrink-0 group-hover:text-zinc-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-xs flex-1 text-left">Search docs…</span>
            <kbd className="text-[10px] font-mono bg-zinc-100 border border-zinc-200 rounded px-1 py-0.5 text-zinc-400">⌘K</kbd>
          </button>

          {/* Right nav */}
          <div className="flex items-center gap-1 ml-auto">
            <Link
              to="/demo"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h1v6H9M14 9h-1v2h1v1h-1v3"/>
              </svg>
              Demo
            </Link>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository (opens in new tab)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-[90rem] mx-auto flex">

        {/* ── Left sidebar ── */}
        <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-zinc-100 py-8 pr-2 pl-6">
          {NAV.map(group => (
            <div key={group.label} className="mb-7">
              <p className="text-[10.5px] font-semibold text-zinc-400 uppercase tracking-widest px-3 mb-2">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `relative flex items-center px-3 py-1.5 rounded-lg text-sm transition-all ${
                          isActive
                            ? 'text-blue-700 font-medium bg-blue-50'
                            : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-blue-500" />
                          )}
                          <span className="pl-1">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Divider + links */}
          <div className="mt-auto pt-6 border-t border-zinc-100 space-y-1">
            {[
              { href: 'https://www.npmjs.com/package/formtrek', label: 'npm package' },
              { href: GITHUB, label: 'GitHub' },
              { href: `${GITHUB}/issues/new`, label: 'Report an issue' },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
                </svg>
                {label}
              </a>
            ))}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-6 md:px-10 lg:px-12 xl:px-16 py-10 max-w-3xl">

          {/* Breadcrumb */}
          {breadcrumbPage && (
            <nav className="flex items-center gap-1.5 text-[12px] text-zinc-400 mb-9" aria-label="Breadcrumb">
              <Link to="/docs" className="hover:text-zinc-600 transition-colors flex items-center">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </Link>
              <svg className="w-3 h-3 text-zinc-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
              <span className="text-zinc-400">{breadcrumbSection}</span>
              <svg className="w-3 h-3 text-zinc-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
              <span className="text-zinc-600 font-medium">{breadcrumbPage}</span>
            </nav>
          )}

          <Outlet />

          {/* Prev / Next navigation */}
          <div className="mt-16 pt-6 border-t border-zinc-100 flex items-center gap-4">
            {prev ? (
              <Link
                to={prev.to}
                className="group flex-1 flex flex-col gap-1 px-4 py-3 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
              >
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
                  Previous
                </span>
                <span className="text-sm text-zinc-700 font-medium group-hover:text-zinc-900 transition-colors">{prev.label}</span>
              </Link>
            ) : <span className="flex-1" />}
            {next ? (
              <Link
                to={next.to}
                className="group flex-1 flex flex-col gap-1 items-end px-4 py-3 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
              >
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  Next
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                </span>
                <span className="text-sm text-zinc-700 font-medium group-hover:text-zinc-900 transition-colors">{next.label}</span>
              </Link>
            ) : <span className="flex-1" />}
          </div>
        </main>

        {/* ── Right TOC sidebar ── */}
        <aside className="hidden xl:block w-52 2xl:w-60 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-10 px-4 pl-6">

          {tocItems.length > 0 && (
            <div className="mb-8">
              <p className="text-[10.5px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">On This Page</p>
              <ul className="space-y-0.5 border-l border-zinc-100 pl-3">
                {tocItems.map(item => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={activeId === item.id ? 'true' : undefined}
                      className={`block text-[13px] leading-snug py-1 transition-colors ${
                        activeId === item.id
                          ? 'text-blue-600 font-medium'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-[10.5px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Contribute</p>
            <ul className="space-y-1">
              {[
                { href: `${GITHUB}/edit/master/README.md`, label: 'Edit this page' },
                { href: `${GITHUB}/issues/new`, label: 'Report an issue' },
                { href: GITHUB, label: 'Star on GitHub' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[13px] text-zinc-400 hover:text-zinc-700 transition-colors py-0.5"
                  >
                    {label}
                    <svg className="w-3 h-3 shrink-0 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

      </div>
    </div>
  )
}

export function DocsLayout() {
  return (
    <TOCProvider>
      <DocsInner />
    </TOCProvider>
  )
}
