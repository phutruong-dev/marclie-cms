import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const Tag = htmlElement || Fragment

  // `React.createElement` keeps this polymorphic `htmlElement` typing intact
  // even when three.js/R3F's global JSX augmentation is loaded (see animations/).
  return React.createElement(
    Tag,
    htmlElement !== null ? { className } : {},
    isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />,
  )
}
