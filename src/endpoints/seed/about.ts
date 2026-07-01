import type { RequiredDataFromCollectionSlug } from 'payload'

import { heading, paragraph, richText } from './lexical'

// About page — composed entirely from existing blocks (hero + content + features + cta).
export const about: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'about',
  _status: 'published',
  title: 'About',
  hero: {
    type: 'lowImpact',
    richText: richText(
      heading('About Marclie CMS', 'h1'),
      paragraph(
        'We build fast, content-driven websites on a single Next.js codebase — a marketing site and a CMS in one, owned end to end.',
      ),
    ),
  },
  layout: [
    {
      blockName: 'Intro',
      blockType: 'content',
      columns: [
        {
          size: 'half',
          richText: richText(
            heading('Our approach', 'h2'),
            paragraph(
              'Engine first, content later. We start from a maintained foundation, harden the guardrails early, then layer brand and content on top so every project ships quickly without re-inventing the core.',
            ),
          ),
        },
        {
          size: 'half',
          enableLink: false,
          richText: richText(
            heading('What you get', 'h2'),
            paragraph(
              'A reusable starter with drafts, live preview, SEO, search and forms already wired — so new sites are a matter of theme tokens and content, not plumbing.',
            ),
          ),
        },
      ],
    },
    {
      blockName: 'Values',
      blockType: 'features',
      heading: 'What we value',
      intro: 'A few principles that shape every build.',
      columns: '3',
      items: [
        {
          title: 'Maintainable',
          description: 'Core stays untouched and upgradeable; customisation lives in clearly separated layers.',
        },
        {
          title: 'Fast by default',
          description: 'Static-first rendering with on-demand revalidation keeps pages quick and fresh.',
        },
        {
          title: 'Accessible',
          description: 'Light and dark themes, semantic markup and motion that respects user preferences.',
        },
      ],
    },
    {
      blockName: 'CTA',
      blockType: 'cta',
      richText: richText(
        heading('Want to see the work?', 'h3'),
        paragraph('Browse selected projects or get in touch to start something new.'),
      ),
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'View portfolio',
            url: '/portfolio',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'Contact us',
            url: '/contact',
          },
        },
      ],
    },
  ],
  meta: {
    description: 'About Marclie CMS — how we build fast, content-driven websites.',
    title: 'About',
  },
}
