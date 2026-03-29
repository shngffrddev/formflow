import type { FormValues, PersistenceAdapter } from './types'

// ─── localStorage (default) ───────────────────────────────────────────────────

export const localStorageAdapter: PersistenceAdapter = {
  load(formId) {
    try {
      const raw = localStorage.getItem(`formtrek:${formId}`)
      return raw ? (JSON.parse(raw) as FormValues) : null
    } catch {
      return null
    }
  },
  save(formId, values) {
    try {
      localStorage.setItem(`formtrek:${formId}`, JSON.stringify(values))
    } catch {
      // Quota exceeded or private browsing — fail silently
    }
  },
  clear(formId) {
    localStorage.removeItem(`formtrek:${formId}`)
  },
}

// ─── sessionStorage ───────────────────────────────────────────────────────────

export const sessionStorageAdapter: PersistenceAdapter = {
  load(formId) {
    try {
      const raw = sessionStorage.getItem(`formtrek:${formId}`)
      return raw ? (JSON.parse(raw) as FormValues) : null
    } catch {
      return null
    }
  },
  save(formId, values) {
    try {
      sessionStorage.setItem(`formtrek:${formId}`, JSON.stringify(values))
    } catch {}
  },
  clear(formId) {
    sessionStorage.removeItem(`formtrek:${formId}`)
  },
}

// ─── URL params ───────────────────────────────────────────────────────────────
// Encodes values as base64 JSON in a single ?state= param.
// Useful for shareable resume-later links.

export const urlParamsAdapter: PersistenceAdapter = {
  load(_formId) {
    const param = new URLSearchParams(window.location.search).get('state')
    if (!param) return null
    try {
      return JSON.parse(atob(param)) as FormValues
    } catch {
      return null
    }
  },
  save(_formId, values) {
    const encoded = btoa(JSON.stringify(values))
    const url = new URL(window.location.href)
    url.searchParams.set('state', encoded)
    window.history.replaceState(null, '', url.toString())
  },
  clear(_formId) {
    const url = new URL(window.location.href)
    url.searchParams.delete('state')
    window.history.replaceState(null, '', url.toString())
  },
}

// ─── No-op (disables persistence) ────────────────────────────────────────────

export const nullAdapter: PersistenceAdapter = {
  load: () => null,
  save: () => {},
  clear: () => {},
}
