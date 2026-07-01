import type { RequiredDataFromCollectionSlug } from 'payload'

import { heading, paragraph, richText } from './lexical'

// Services page — composed entirely from existing blocks (hero + features + content + cta).
export const services: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'services',
  _status: 'published',
  title: 'Services',
  hero: {
    type: 'lowImpact',
    richText: richText(
      heading('Services', 'h1'),
      paragraph('From strategy to launch — everything needed to ship a content-driven website.'),
    ),
  },
  layout: [
    {
      blockName: 'Service list',
      blockType: 'features',
      heading: 'What we offer',
      intro: 'End-to-end delivery, or just the parts you need.',
      columns: '2',
      items: [
        {
          title: 'Web design',
          description: 'Distinctive, accessible interfaces with a theme system that makes rebrands a token edit.',
        },
        {
          title: 'CMS engineering',
          description: 'Collections, blocks and access control tailored to how your team actually publishes.',
        },
        {
          title: 'Performance',
          description: 'Static-first rendering, image optimisation and a budget-aware approach to animation.',
        },
        {
          title: 'SEO & analytics',
          description: 'Metadata, sitemaps and structured content wired in from the first commit.',
        },
      ],
    },
    {
      blockName: 'How we work',
      blockType: 'content',
      columns: [
        {
          size: 'full',
          richText: richText(
            heading('How we work', 'h2'),
            paragraph(
              'A short, focused engagement: align on goals, build a vertical slice to prove the pipeline, then expand to the full site. Guardrails are on from day one, so every change — human or AI-assisted — is checked.',
            ),
          ),
        },
      ],
    },
    {
      blockName: 'CTA',
      blockType: 'cta',
      richText: richText(
        heading('Have a project in mind?', 'h3'),
        paragraph('Tell us what you are building and we will map out the fastest path to launch.'),
      ),
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Start a project',
            url: '/contact',
          },
        },
      ],
    },
  ],
  meta: {
    description: 'Services — web design, CMS engineering, performance and SEO with Marclie CMS.',
    title: 'Services',
  },
}
