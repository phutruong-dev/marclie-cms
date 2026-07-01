'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Central GSAP setup for the frontend. Import `gsap` and `ScrollTrigger` from
 * here (not from the package directly) so plugins are registered exactly once.
 *
 * `useGSAP` is registered as a plugin so its scope/cleanup integration works,
 * and `ScrollTrigger` is registered for all scroll-driven wrappers.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger)

export { gsap, ScrollTrigger, useGSAP }
