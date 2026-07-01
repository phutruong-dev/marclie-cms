import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

// Marclie CMS wordmark. Inherits text colour (currentColor) so it works in light/dark.
export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span
      aria-label="Marclie CMS"
      // Inherit the surrounding text colour (currentColor) so the wordmark stays
      // legible on both the light header and the dark footer (WCAG contrast).
      className={clsx('inline-flex items-center gap-2', className)}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect width="28" height="28" rx="6" fill="currentColor" />
        <text
          x="14"
          y="19"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="16"
          fontWeight="700"
          className="fill-background"
        >
          M
        </text>
      </svg>
      <span className="text-xl font-semibold tracking-tight">Marclie CMS</span>
    </span>
  )
}
