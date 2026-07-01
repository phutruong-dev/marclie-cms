import type { RequiredDataFromCollectionSlug } from 'payload'

import { heading, paragraph, richText } from './lexical'

// Portfolio page — the Archive block is populated from the `projects` collection,
// so the listing reads live project data (no hand-maintained list).
export const portfolio: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'portfolio',
  _status: 'published',
  title: 'Portfolio',
  hero: {
    type: 'lowImpact',
    richText: richText(
      heading('Portfolio', 'h1'),
      paragraph('A selection of recent projects, pulled straight from the CMS.'),
    ),
  },
  layout: [
    {
      blockName: 'Projects archive',
      blockType: 'archive',
      populateBy: 'collection',
      relationTo: 'projects',
      categories: [],
      limit: 12,
      introContent: richText(
        heading('Selected work', 'h2'),
        paragraph(
          'Each case study is a document in the Projects collection — add or edit one in the admin and it appears here automatically.',
        ),
      ),
    },
  ],
  meta: {
    description: 'Portfolio — selected projects built with Marclie CMS.',
    title: 'Portfolio',
  },
}
