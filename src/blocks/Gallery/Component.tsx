import React from 'react'

import type { GalleryBlock as GalleryBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const colsClass: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

export const GalleryBlock: React.FC<GalleryBlockProps> = ({ heading, columns, images }) => {
  return (
    <div className="container">
      {heading && <h2 className="mb-8 text-3xl font-semibold tracking-tight">{heading}</h2>}
      <div className={cn('grid grid-cols-1 gap-4', colsClass[columns || '3'])}>
        {(images || []).map((item, index) => (
          <figure key={index} className="m-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card">
              <Media fill imgClassName="object-cover" resource={item.image} />
            </div>
            {item.caption && (
              <figcaption className="mt-2 text-sm text-muted-foreground">{item.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  )
}
