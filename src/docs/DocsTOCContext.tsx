import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface TOCItem {
  id: string
  label: string
}

interface TOCCtx {
  items: TOCItem[]
  setItems: (items: TOCItem[]) => void
}

const TOCContext = createContext<TOCCtx>({ items: [], setItems: () => {} })

export function TOCProvider({ children }: { children: ReactNode }) {
  const [items, setItemsState] = useState<TOCItem[]>([])
  const setItems = useCallback((next: TOCItem[]) => setItemsState(next), [])
  return <TOCContext.Provider value={{ items, setItems }}>{children}</TOCContext.Provider>
}

export function useTOC() {
  return useContext(TOCContext)
}
