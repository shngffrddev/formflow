import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { TOCProvider, useTOC } from './DocsTOCContext'

const VERSION = 'v0.2.2'
const GITHUB = 'https://github.com/shngffrddev/formflow'

const NAV = [
  {
    label: 'Overview',
    items: [
      { to: '/docs/introduction', label: 'Introduction' },
      { to: '/docs/getting-started', label: 'Getting Started' },
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
    label: 'Reference',
    items: [
      { to: '/docs/api', label: 'API Reference' },
    ],
  },
]

const BREADCRUMB_LABELS: Record<string, string> = {
  '/docs/introduction': 'Introduction',
  '/docs/getting-started': 'Getting Started',
  '/docs/conditional-branching': 'Conditional Branching',
  '/docs/validation': 'Validation',
  '/docs/persistence': 'Persistence',
  '/docs/api': 'API Reference',
}

const SECTION_LABELS: Record<string, string> = {
  '/docs/introduction': 'Overview',
  '/docs/getting-started': 'Overview',
  '/docs/conditional-branching': 'Core Concepts',
  '/docs/validation': 'Core Concepts',
  '/docs/persistence': 'Core Concepts',
  '/docs/api': 'Reference',
}

function DocsInner() {
  const location = useLocation()
  const { items: tocItems } = useTOC()

  const allItems = NAV.flatMap(g => g.items)
  const currentIdx = allItems.findIndex(i => i.to === location.pathname)
  const prev = currentIdx > 0 ? allItems[currentIdx - 1] : null
  const next = currentIdx < allItems.length - 1 ? allItems[currentIdx + 1] : null

  const breadcrumbPage = BREADCRUMB_LABELS[location.pathname]
  const breadcrumbSection = SECTION_LABELS[location.pathname]

  return (
    <div className="min-h-screen bg-white text-zinc-900">

      {/* ── Top nav ── */}
      <header className="border-b border-zinc-200 sticky top-0 bg-white/95 backdrop-blur z-20">
        <div className="max-w-[90rem] mx-auto px-4 h-14 flex items-center gap-4">

          {/* Logo + version */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="5" height="5" rx="1" />
                <rect x="9" y="2" width="5" height="5" rx="1" opacity=".6" />
                <rect x="2" y="9" width="5" height="5" rx="1" opacity=".6" />
                <rect x="9" y="9" width="5" height="5" rx="1" opacity=".3" />
              </svg>
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-zinc-900">FormFlow</span>
          </Link>

          <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-xs font-medium font-mono border border-zinc-200">
            {VERSION}
          </span>

          {/* Search */}
          <button className="hidden md:flex ml-2 items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-400 hover:border-zinc-300 hover:text-zinc-500 transition-colors bg-zinc-50 w-52">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-xs">Search docs…</span>
            <kbd className="ml-auto text-[10px] font-mono bg-white border border-zinc-200 rounded px-1 py-0.5 text-zinc-400">⌘K</kbd>
          </button>

          <div className="flex items-center gap-1 ml-auto">
            <Link to="/demo" className="px-3 py-1.5 rounded-md text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
              Demo
            </Link>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-[90rem] mx-auto flex">

        {/* ── Left sidebar ── */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-zinc-100 py-8 px-4">
          {NAV.map(group => (
            <div key={group.label} className="mb-7">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest px-3 mb-2">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          isActive
                            ? 'bg-brand-50 text-brand-700 font-medium border border-brand-100'
                            : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-brand-500' : 'bg-zinc-300'}`} />
                          {item.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-8 lg:px-12 py-10 max-w-3xl">

          {/* Breadcrumb */}
          {breadcrumbPage && (
            <nav className="flex items-center gap-1.5 text-sm text-zinc-400 mb-8">
              <Link to="/" className="hover:text-zinc-600 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </Link>
              <svg className="w-3 h-3 text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
              <span className="text-zinc-400">{breadcrumbSection}</span>
              <svg className="w-3 h-3 text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
              <span className="text-zinc-600 font-medium">{breadcrumbPage}</span>
            </nav>
          )}

          <Outlet />

          {/* Prev / Next */}
          <div className="mt-16 pt-8 border-t border-zinc-100 flex items-center justify-between">
            {prev ? (
              <Link to={prev.to} className="group flex flex-col gap-0.5 text-sm">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
                  Previous
                </span>
                <span className="text-zinc-700 font-medium group-hover:text-brand-600 transition-colors">{prev.label}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to={next.to} className="group flex flex-col gap-0.5 text-sm items-end">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  Next
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                </span>
                <span className="text-zinc-700 font-medium group-hover:text-brand-600 transition-colors">{next.label}</span>
              </Link>
            ) : <span />}
          </div>
        </main>

        {/* ── Right sidebar ── */}
        <aside className="hidden xl:block w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-10 px-4">

          {/* On This Page */}
          {tocItems.length > 0 && (
            <div className="mb-8">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">On This Page</p>
              <ul className="space-y-1.5">
                {tocItems.map(item => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors block leading-snug"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Community */}
          <div className="mb-8">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Community</p>
            <ul className="space-y-1.5">
              {[
                { href: `${GITHUB}/edit/master/README.md`, label: 'Edit this page' },
                { href: GITHUB, label: 'Star on GitHub' },
                { href: `${GITHUB}/issues/new`, label: 'Report an issue' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    {label}
                    <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Ecosystem</p>
            <ul className="space-y-1.5">
              {[
                { href: 'https://www.npmjs.com/package/@shngffrddev/formflow', label: 'npm package' },
                { href: `${GITHUB}/releases`, label: 'Changelog' },
                { href: `${GITHUB}`, label: 'Source code' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    {label}
                    <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
