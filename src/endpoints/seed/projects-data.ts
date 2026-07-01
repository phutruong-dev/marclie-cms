import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

import { heading, paragraph, richText } from './lexical'

type ProjectSeed = RequiredDataFromCollectionSlug<'projects'>

type ProjectsArgs = {
  images: Media[]
  categoryIds: number[]
}

// Sample portfolio projects. Images/categories are passed in from the seed run so
// the docs reference real, already-created media and category records.
export const projectsData = ({ images, categoryIds }: ProjectsArgs): ProjectSeed[] => {
  const img = (i: number) => images[i % images.length]?.id

  return [
    {
      slug: 'northwind-rebrand',
      _status: 'published',
      title: 'Northwind — Brand & Website',
      client: 'Northwind Co.',
      year: 2025,
      projectUrl: 'https://example.com/northwind',
      categories: categoryIds,
      featuredImage: img(0),
      summary:
        'A full rebrand and marketing site rebuilt on Marclie CMS, cutting publish time from days to minutes.',
      content: richText(
        heading('Overview', 'h2'),
        paragraph(
          'Northwind needed a site their own team could maintain. We migrated their content into structured collections and gave editors live preview, so changes ship the moment they are ready.',
        ),
        heading('Outcome', 'h3'),
        paragraph('A faster, on-brand site with a publishing workflow the marketing team owns end to end.'),
      ),
      meta: {
        title: 'Northwind — Brand & Website',
        description: 'A full rebrand and marketing site rebuilt on Marclie CMS.',
        image: img(0),
      },
    },
    {
      slug: 'atlas-design-system',
      _status: 'published',
      title: 'Atlas — Design System',
      client: 'Atlas Labs',
      year: 2024,
      categories: categoryIds,
      featuredImage: img(1),
      summary:
        'A token-driven design system shared across web and product, themed for light and dark out of the box.',
      content: richText(
        heading('Overview', 'h2'),
        paragraph(
          'We standardised colour, type and spacing as CSS-first tokens, so a rebrand is a token edit rather than a component rewrite.',
        ),
        heading('Outcome', 'h3'),
        paragraph('One source of truth for visual style, reused across every Atlas surface.'),
      ),
      meta: {
        title: 'Atlas — Design System',
        description: 'A token-driven design system themed for light and dark.',
        image: img(1),
      },
    },
    {
      slug: 'meridian-content-platform',
      _status: 'published',
      title: 'Meridian — Content Platform',
      client: 'Meridian Media',
      year: 2024,
      projectUrl: 'https://example.com/meridian',
      categories: categoryIds,
      featuredImage: img(2),
      summary:
        'A high-volume editorial platform with search, categories and scheduled publishing.',
      content: richText(
        heading('Overview', 'h2'),
        paragraph(
          'Meridian publishes dozens of articles a week. We built an archive-driven front end with full-text search and category filtering, backed by drafts and versioning.',
        ),
        heading('Outcome', 'h3'),
        paragraph('Editors move faster and readers find content sooner.'),
      ),
      meta: {
        title: 'Meridian — Content Platform',
        description: 'A high-volume editorial platform with search and scheduling.',
        image: img(2),
      },
    },
  ]
}
