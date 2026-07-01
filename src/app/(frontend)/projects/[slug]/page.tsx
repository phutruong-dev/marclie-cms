import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import { Media } from '@/components/Media'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return projects.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Project({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/projects/' + decodedSlug
  const project = await queryProjectBySlug({ slug: decodedSlug })

  if (!project) return <PayloadRedirects url={url} />

  const { categories, client, content, featuredImage, gallery, projectUrl, summary, title, year } =
    project

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid projects too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="container">
        <div className="mx-auto max-w-[48rem]">
          {categories && categories.length > 0 && (
            <div className="mb-4 text-sm uppercase text-muted-foreground">
              {categories
                .map((category) => (typeof category === 'object' ? category.title : null))
                .filter(Boolean)
                .join(', ')}
            </div>
          )}
          <h1 className="text-3xl md:text-5xl">{title}</h1>
          {summary && <p className="mt-4 text-lg text-muted-foreground">{summary}</p>}

          {(client || year || projectUrl) && (
            <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-4 border-y border-border py-4 text-sm">
              {client && (
                <div>
                  <dt className="text-muted-foreground">Client</dt>
                  <dd className="font-medium">{client}</dd>
                </div>
              )}
              {year && (
                <div>
                  <dt className="text-muted-foreground">Year</dt>
                  <dd className="font-medium">{year}</dd>
                </div>
              )}
              {projectUrl && (
                <div>
                  <dt className="text-muted-foreground">Link</dt>
                  <dd className="font-medium">
                    <a
                      className="underline"
                      href={projectUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Visit project
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>

      {featuredImage && typeof featuredImage === 'object' && (
        <div className="container mt-10">
          <Media
            className="mx-auto max-w-5xl overflow-hidden rounded-lg"
            imgClassName="w-full"
            resource={featuredImage}
            size="100vw"
          />
        </div>
      )}

      {content && (
        <div className="container mt-10">
          <RichText className="mx-auto max-w-[48rem]" data={content} enableGutter={false} />
        </div>
      )}

      {gallery && gallery.length > 0 && (
        <div className="container mt-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, index) =>
              typeof item.image === 'object' ? (
                <Media
                  key={index}
                  className="overflow-hidden rounded-lg"
                  imgClassName="w-full h-full object-cover"
                  resource={item.image}
                  size="33vw"
                />
              ) : null,
            )}
          </div>
        </div>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const project = await queryProjectBySlug({ slug: decodedSlug })

  return generateMeta({ doc: project })
}

const queryProjectBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
