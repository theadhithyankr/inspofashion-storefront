import { notFound } from 'next/navigation'
import { CollectionBrowser } from '@/components/storefront/collection-browser'
import { getCollectionBySlug, getCollections, getProductsForCollection } from '@/lib/storefront-data'

export const revalidate = 60 // Revalidate every 60 seconds

export async function generateStaticParams() {
  const collections = await getCollections()
  return collections.map((collection) => ({ slug: collection.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)
  if (!collection) return {}
  return {
    title: collection.name,
    description: collection.description || `Shop ${collection.name} at Inspofashions.`,
  }
}

export default async function CollectionPage({ params }) {
  const { slug } = await params
  const [collection, products] = await Promise.all([
    getCollectionBySlug(slug),
    getProductsForCollection(slug),
  ])

  if (!collection) notFound()

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-10">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">Collection</p>
        <h1 className="mt-3 font-display text-5xl text-brand-900 sm:text-7xl">{collection.name}</h1>
        <p className="mt-4 text-lg leading-8 text-brand-600">{collection.description || `Explore the ${collection.name} edit.`}</p>
      </header>
      <CollectionBrowser products={products} />
    </main>
  )
}
