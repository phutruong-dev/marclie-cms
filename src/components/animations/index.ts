/**
 * Frontend animation wrappers (isolated). GSAP-based scroll/timeline presets +
 * a lazy-loaded three.js hero. All respect `prefers-reduced-motion`.
 * Guide: `docs/animation.md`.
 */
export { AnimateIn } from './AnimateIn'
export type { AnimateInProps } from './AnimateIn'
export { Parallax } from './Parallax'
export type { ParallaxProps } from './Parallax'
export { Hero3D } from './Hero3D'
export type { Hero3DProps } from './Hero3D'
export { useReducedMotion } from './useReducedMotion'
