import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGrid } from '@/components/storefront/product-grid'
import { clampText } from '@/lib/format'
import { getStorefrontData } from '@/lib/storefront-data'

export const revalidate = 60

export default async function HomePage() {
  const { products, collections, hero } = await getStorefrontData()
  const featured = products.filter((product) => product.is_featured).slice(0, 8)
  const newArrivals = (featured.length ? featured : products).slice(0, 8)
  const heroImage = hero?.image_url || collections[0]?.image_url || products[0]?.images?.[0] || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=80'

  return (
    <main>
      {/* Hero Section */}
      <section className="relative w-full h-screen lg:h-screen overflow-hidden bg-white">
        <Image 
          src={heroImage} 
          alt="Inspofashions campaign" 
          fill 
          priority 
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 flex flex-col items-start justify-center lg:justify-center lg:items-start pt-20 lg:pt-0">
          <div className="w-full px-6 sm:px-8 lg:px-12 pb-0 lg:pb-0">
            <div className="max-w-md lg:max-w-2xl animate-[fadeIn_0.9s_ease-out_0.2s_forwards] opacity-0">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-1 font-normal text-black">
                {clampText(hero?.subtitle, 'Timeless Comfort.')}
              </h1>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6 font-normal text-black">
                {clampText(hero?.title, 'Everyday Elegance.')}
              </h2>
              <div className="w-12 h-0.5 bg-black mb-6"></div>
              <p className="mb-8 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-black/90 leading-relaxed">
                Premium Nightwear<br />
                Designed for Modern Women.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <Link 
                  href={hero?.button_men_url || (collections[0] ? `/collections/${collections[0].slug}` : '/search')} 
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white font-bold text-xs uppercase tracking-[0.18em] hover:bg-black/90 transition-all duration-300"
                >
                  {hero?.button_men || 'Shop Collection'}
                </Link>
                <Link 
                  href={hero?.button_women_url || '/search'} 
                  className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-black text-black font-bold text-xs uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-all duration-300 bg-white/80 sm:bg-transparent"
                >
                  {hero?.button_women || 'Shop Women'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Section - "JUST LANDED" */}
      <section className="bg-white py-12 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-16">
          {/* Mobile: Stacked cards */}
          <div className="block sm:hidden mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/70 mb-3">Featured</p>
            <h2 className="font-display text-2xl text-black font-normal mb-6">Just Landed</h2>
            
            {/* Stacked grid - 2 cards */}
            <div className="grid gap-4 grid-cols-2 auto-rows-[200px] mb-6">
              {collections.slice(0, 2).map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className="group relative overflow-hidden bg-gray-200 rounded-lg"
                >
                  {collection.image_url && (
                    <Image
                      src={collection.image_url}
                      alt={collection.name}
                      fill
                      sizes="calc(50vw - 16px)"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  
                  {/* Collection name overlay at bottom */}
                  <div className="absolute inset-0 flex items-end p-3">
                    <h4 className="font-display text-lg text-white font-normal uppercase tracking-[0.1em]">
                      {collection.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
            
            <Link
              href="/search"
              className="inline-block px-6 py-2 bg-black text-white font-bold text-xs uppercase tracking-[0.18em] hover:bg-black/90 transition-all"
            >
              Shop Now
            </Link>
          </div>

          {/* Desktop: 1 + 3 grid layout */}
          <div className="hidden sm:grid gap-0 sm:gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-3">
            {/* Left - Text and button */}
            <div className="flex flex-col justify-center pb-8 sm:pb-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/70 mb-4">Featured</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-black font-normal mb-6 leading-tight">
                Just Landed
              </h2>
              <p className="text-sm text-black/70 mb-8 leading-relaxed max-w-xs">
                Discover our latest additions to our bestselling collection. New styles and timeless elegance.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-[0.18em] hover:bg-black/90 transition-all duration-300 w-fit"
              >
                Shop Now
              </Link>
            </div>

            {/* Right - 3 featured cards */}
            {collections.slice(0, 3).map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group relative overflow-hidden bg-gray-200 aspect-[3/4]"
              >
                {collection.image_url && (
                  <Image
                    src={collection.image_url}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                  <h3 className="font-display text-xl sm:text-2xl text-white font-normal uppercase tracking-[0.1em]">
                    {collection.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals & Best Sellers Section */}
      <section className="bg-white py-12 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-16">
          <div className="grid gap-4 sm:gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 auto-rows-[200px] sm:auto-rows-[400px] lg:auto-rows-[450px]">
            {/* New Arrivals */}
            <Link
              href="/search?sort=newest"
              className="group relative overflow-hidden bg-gray-200 rounded-lg"
            >
              {newArrivals[0]?.images?.[0] && (
                <Image
                  src={newArrivals[0].images[0]}
                  alt="New Arrivals"
                  fill
                  sizes="50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                <h3 className="font-display text-lg sm:text-5xl text-white font-normal uppercase tracking-[0.05em]">
                  New Arrivals
                </h3>
                <button className="mt-3 sm:mt-8 px-3 sm:px-6 py-1.5 sm:py-2.5 bg-black text-white font-bold text-xs uppercase tracking-[0.18em] hover:bg-black/90 transition-all pointer-events-none">
                  Shop Now
                </button>
              </div>
            </Link>

            {/* Best Sellers */}
            <Link
              href="/search?sort=popular"
              className="group relative overflow-hidden bg-gray-200 rounded-lg"
            >
              {featured[featured.length - 1]?.images?.[0] && (
                <Image
                  src={featured[featured.length - 1].images[0]}
                  alt="Best Sellers"
                  fill
                  sizes="50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                <h3 className="font-display text-lg sm:text-5xl text-white font-normal uppercase tracking-[0.05em]">
                  Best Sellers
                </h3>
                <button className="mt-3 sm:mt-8 px-3 sm:px-6 py-1.5 sm:py-2.5 bg-black text-white font-bold text-xs uppercase tracking-[0.18em] hover:bg-black/90 transition-all pointer-events-none">
                  Shop Now
                </button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="bg-white py-12 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-16">
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/70 mb-2 sm:mb-3">Curated Collection</p>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl text-black font-normal">
              Featured Styles
            </h2>
          </div>
          <ProductGrid products={featured} priorityCount={4} />
        </div>
      </section>
    </main>
  )
}
