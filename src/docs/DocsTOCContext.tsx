import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface TOCItem {
  id: string
  label: string
}

interface TOCCtx {
  items: TOCItem[]
  setItems: (items: TOCItem[]) => void
  activeId: string | null
  setActiveId: (id: string | null) => void
}

const TOCContext = createContext<TOCCtx>({
  items: [],
  setItems: () => {},
  activeId: null,
  setActiveId: () => {},
})

export function TOCProvider({ children }: { children: ReactNode }) {
  const [items, setItemsState] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const setItems = useCallback((next: TOCItem[]) => {
    setItemsState(next)
    setActiveId(null)
  }, [])
  return (
    <TOCContext.Provider value={{ items, setItems, activeId, setActiveId }}>
      {children}
    </TOCContext.Provider>
  )
}

export function useTOC() {
  return useContext(TOCContext)
}
