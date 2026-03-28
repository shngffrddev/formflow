import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'

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

export function DocsLayout() {
  const location = useLocation()

  // Flatten nav to find prev/next
  const allItems = NAV.flatMap(g => g.items)
  const currentIdx = allItems.findIndex(i => i.to === location.pathname)
  const prev = currentIdx > 0 ? allItems[currentIdx - 1] : null
  const next = currentIdx < allItems.length - 1 ? allItems[currentIdx + 1] : null

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Top nav */}
      <header className="border-b border-zinc-100 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-semibold text-lg tracking-tight">FormFlow</Link>
            <span className="text-zinc-300">|</span>
            <span className="text-sm text-zinc-500">Docs</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-zinc-600">
            <Link to="/demo" className="hover:text-zinc-900 transition-colors">Demo</Link>
            <a
              href="https://github.com"
              className="hover:text-zinc-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-zinc-100 py-8 pr-4">
          {NAV.map(group => (
            <div key={group.label} className="mb-6">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-2">
                {group.label}
              </p>
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-zinc-900 text-white font-medium'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-10 py-10 max-w-3xl">
          <Outlet />

          {/* Prev/Next */}
          <div className="mt-16 pt-8 border-t border-zinc-100 flex items-center justify-between">
            {prev ? (
              <Link
                to={prev.to}
                className="group flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                <span>{prev.label}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link
                to={next.to}
                className="group flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <span>{next.label}</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            ) : <span />}
          </div>
        </main>
      </div>
    </div>
  )
}
