import type { MetadataRoute } from 'next'
import { pagePaths } from '@/lib/routes'
import { absoluteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return pagePaths().map((path) => ({ url: absoluteUrl(path), changeFrequency: 'monthly', priority: path === '/' ? 1 : 0.6 }))
}
