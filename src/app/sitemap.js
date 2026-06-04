import { getCollections, getProducts } from '@/lib/storefront-data'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inspofashions.com'
  const [products, collections] = await Promise.all([getProducts(), getCollections()])
  const now = new Date()

  return [
    '',
    '/search',
    '/about',
    '/size-guide',
    '/shipping-returns',
    '/contact',
    ...collections.map((collection) => `/collections/${collection.slug}`),
    ...products.map((product) => `/products/${product.slug}`),
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }))
}
