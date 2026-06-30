import React from 'react'

// Loads Marclie CMS admin style overrides globally (Icon renders on every admin page).
import '../admin.scss'

// Small monogram shown in the admin nav. Uses currentColor so it adapts to the theme.
export default function Icon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" aria-label="Marclie CMS">
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
  )
}
