'use client'

import React, { useRef } from 'react'

import { cn } from '@/utilities/ui'

import { gsap, useGSAP } from './gsap'
import { useReducedMotion } from './useReducedMotion'

export type ParallaxProps = {
  children: React.ReactNode
  /**
   * How far the element drifts across the scroll, as a fraction of its own
   * height. Positive = moves up (slower than scroll). Defaults to `0.2`.
   */
  speed?: number
  className?: string
}

/**
 * Vertical parallax: the element drifts as the page scrolls, tied to scroll
 * position via a scrubbed ScrollTrigger. Isolated GSAP wrapper — see
 * `docs/animation.md`.
 *
 * Respects `prefers-reduced-motion`: no drift is applied when motion is reduced.
 */
export const Parallax: React.FC<ParallaxProps> = ({ children, speed = 0.2, className }) => {
  const scope = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced || !scope.current) return

      gsap.to(scope.current, {
        yPercent: -speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope, dependencies: [reduced, speed] },
  )

  return (
    <div ref={scope} className={cn('will-change-transform', className)}>
      {children}
    </div>
  )
}
