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
    <main className="w-full bg-white">
      {/* Header with fixed padding from top (accounts for header) */}
      <header className="px-6 sm:px-8 lg:px-16 pt-24 sm:pt-28 lg:pt-24 pb-8 sm:pb-12 border-b border-black/10">
        <div className="max-w-4xl">
          {/* Search title - Premium serif */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-black mb-4 font-normal">
            {query ? `Results for "${query}"` : 'All pieces'}
          </h1>
          
          {/* Description - Premium body text */}
          {query && (
            <p className="text-sm sm:text-base leading-7 text-black/70">
              Showing all items matching your search.
            </p>
          )}
        </div>
      </header>

      {/* Collection browser - Full width */}
      <div className="px-6 sm:px-8 lg:px-16 py-8 sm:py-12">
        <CollectionBrowser products={results} />
      </div>
    </main>
  )
}
