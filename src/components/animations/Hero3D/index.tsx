'use client'

import dynamic from 'next/dynamic'
import React from 'react'

import { cn } from '@/utilities/ui'

/**
 * Lazy, client-only loader for the WebGL `Scene`. three.js / R3F are heavy and
 * browser-only, so the scene is always code-split and never server-rendered
 * (`next/dynamic` + `ssr: false`). See `docs/animation.md`.
 */
const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-muted" />,
})

export type Hero3DProps = {
  className?: string
}

/**
 * Drop-in animated 3D hero placeholder. Give it a sized container (it fills its
 * parent). Replace `Scene` with a project-specific scene to customise.
 */
export const Hero3D: React.FC<Hero3DProps> = ({ className }) => {
  return (
    <div className={cn('relative aspect-square w-full', className)}>
      <Scene />
    </div>
  )
}
