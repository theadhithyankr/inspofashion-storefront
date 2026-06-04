import { CollectionBrowser } from '@/components/storefront/collection-browser'
import { getProducts, searchProducts } from '@/lib/storefront-data'

export const metadata = {
  title: 'Search',
  description: 'Search clothing, collections, sizes, colours, and materials.',
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams
  const query = params?.q || ''
  const products = await getProducts()
  const results = query ? searchProducts(products, query) : products

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-10">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">Search</p>
        <h1 className="mt-3 font-display text-5xl text-brand-900 sm:text-7xl">
          {query ? `Results for "${query}"` : 'All pieces'}
        </h1>
      </header>
      <CollectionBrowser products={results} />
    </main>
  )
}
