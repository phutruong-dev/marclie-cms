import React from 'react'

// Wordmark shown on the admin login screen. Uses currentColor for theme adaptation.
export default function Logo() {
  return (
    <div
      style={{
        alignItems: 'center',
        color: 'currentColor',
        display: 'flex',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        fontSize: 28,
        fontWeight: 700,
        gap: 12,
        letterSpacing: '-0.02em',
      }}
      aria-label="Marclie CMS"
    >
      <svg width="36" height="36" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="6" fill="currentColor" />
        <text
          x="14"
          y="19"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="16"
          fontWeight="700"
          fill="var(--theme-bg, #fff)"
        >
          M
        </text>
      </svg>
      <span>Marclie CMS</span>
    </div>
  )
}
