'use client'

import React, { useRef } from 'react'

import { cn } from '@/utilities/ui'

import { gsap, useGSAP } from './gsap'
import { useReducedMotion } from './useReducedMotion'

type AnimateInVariant = 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom'

const offsets: Record<AnimateInVariant, gsap.TweenVars> = {
  fade: {},
  'fade-up': { y: 32 },
  'fade-down': { y: -32 },
  'fade-left': { x: 32 },
  'fade-right': { x: -32 },
  zoom: { scale: 0.92 },
}

export type AnimateInProps = {
  children: React.ReactNode
  /** Motion preset. Defaults to `fade-up`. */
  variant?: AnimateInVariant
  /** Tween duration in seconds. */
  duration?: number
  /** Delay before the tween starts, in seconds. */
  delay?: number
  /**
   * When the children are direct elements that should animate one after
   * another, set a stagger (seconds) — each direct child animates in sequence.
   */
  stagger?: number
  /** Render a different element than a `div`. */
  as?: React.ElementType
  className?: string
}

/**
 * Fade/slide an element (or its direct children, with `stagger`) into view as
 * it scrolls into the viewport. Isolated GSAP + ScrollTrigger wrapper — see
 * `docs/animation.md`.
 *
 * Respects `prefers-reduced-motion`: when motion is reduced the content is
 * rendered in its final visible state with no animation.
 */
export const AnimateIn: React.FC<AnimateInProps> = ({
  children,
  variant = 'fade-up',
  duration = 0.7,
  delay = 0,
  stagger,
  as: Tag = 'div',
  className,
}) => {
  const scope = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced || !scope.current) return

      const targets = stagger ? Array.from(scope.current.children) : scope.current
      const from = { autoAlpha: 0, ...offsets[variant] }

      gsap.from(targets, {
        ...from,
        duration,
        delay,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    },
    { scope, dependencies: [reduced, variant, duration, delay, stagger] },
  )

  // `React.createElement` (rather than `<Tag>`) keeps the polymorphic `as` prop
  // typing intact even when three.js/R3F's global JSX augmentation is loaded.
  return React.createElement(Tag, { ref: scope, className: cn(className) }, children)
}
