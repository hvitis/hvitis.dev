import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string | string[]
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

function resolveImages(image?: string | string[]): string[] {
  const list = image ? (Array.isArray(image) ? image : [image]) : [siteMetadata.socialBanner]
  return list.map((img) => (img.includes('http') ? img : siteMetadata.siteUrl + img))
}

export function genPageMetadata({
  title,
  description,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  ...rest
}: PageSEOProps): Metadata {
  const resolvedDescription = description || siteMetadata.description
  const images = resolveImages(image)

  return {
    title,
    description: resolvedDescription,
    openGraph: {
      title: `${title} | ${siteMetadata.seoTitle}`,
      description: resolvedDescription,
      url: './',
      siteName: siteMetadata.title,
      images,
      locale: 'en_US',
      type,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime: modifiedTime || publishedTime,
        authors: authors && authors.length > 0 ? authors : [siteMetadata.author],
      }),
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      description: resolvedDescription,
      card: 'summary_large_image',
      images,
    },
    ...rest,
  }
}
