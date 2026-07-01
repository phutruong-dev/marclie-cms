'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void): () => void {
  const query = window.matchMedia(QUERY)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches
}

// Default to "reduced" on the server / first paint so content is never left
// hidden waiting for an animation that may be disabled.
function getServerSnapshot(): boolean {
  return true
}

/**
 * Tracks the user's `prefers-reduced-motion` setting reactively.
 *
 * Returns `true` when the user has asked the OS to minimise motion. Animation
 * wrappers use this to skip non-essential motion and render content in its
 * final, visible state instead.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
