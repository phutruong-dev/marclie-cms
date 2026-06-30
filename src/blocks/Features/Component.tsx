import React from 'react'

import type { FeaturesBlock as FeaturesBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

const colsClass: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-2 lg:grid-cols-4',
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({ heading, intro, columns, items }) => {
  return (
    <div className="container">
      {(heading || intro) && (
        <div className="mb-10 max-w-2xl">
          {heading && <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>}
          {intro && <p className="mt-3 text-muted-foreground">{intro}</p>}
        </div>
      )}
      <div className={cn('grid grid-cols-1 gap-6', colsClass[columns || '3'])}>
        {(items || []).map((item, index) => (
          <div key={index} className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-medium text-card-foreground">{item.title}</h3>
            {item.description && (
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
