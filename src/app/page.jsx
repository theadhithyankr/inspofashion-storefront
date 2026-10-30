import Image from 'next/image'
import Link from 'next/link'
import { ProductGrid } from '@/components/storefront/product-grid'
import { getStorefrontData } from '@/lib/storefront-data'

export const revalidate = 60

export default async function HomePage() {
  const { products, collections, hero } = await getStorefrontData()
  const featured = products.filter((product) => product.is_featured).slice(0, 8)
  const newArrivals = (featured.length ? featured : products).slice(0, 8)
  const heroImage = hero?.image_url || collections[0]?.image_url || products[0]?.images?.[0] || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=80'

  // Find nighties and frock nighties collections
  const nightiesCollection = collections.find(c => c.slug === 'nighties') || collections[0]
  const frockNightiesCollection = collections.find(c => c.slug === 'frock-nighties') || collections[1]

  return (
    <main>
      {/* Hero Section - Refined Nightwear Brand */}
      <section className="relative w-full h-[90vh] sm:h-screen overflow-hidden bg-ivory-100">
        {/* Desktop Hero Image - Landscape */}
        <Image 
          src={heroImage} 
          alt="Inspo Fashions nightwear collection" 
          fill 
          priority 
          sizes="(min-width: 768px) 100vw, 0vw"
          className="hidden sm:block object-cover"
          style={{ objectPosition: 'center center' }}
        />
        
        {/* Mobile Hero Image - Portrait */}
        <Image 
          src="/mobile hero image.png" 
          alt="Inspo Fashions nightwear collection" 
          fill 
          priority 
          sizes="(max-width: 767px) 100vw, 0vw"
          className="block sm:hidden object-cover object-center"
        />
        
        {/* Subtle overlay - minimal, no harsh darkening */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream-100/40" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-start justify-end sm:justify-center px-6 sm:px-8 lg:px-16 pb-16 sm:pb-0">
          <div className="w-full max-w-2xl animate-[fadeIn_0.8s_ease-out_0.2s_forwards] opacity-0">
            {/* Eyebrow */}
            <p className="text-caption text-text-secondary mb-4 sm:mb-6 font-semibold tracking-[0.2em]">
              INSPO FASHIONS · NIGHTWEAR
            </p>
            
            {/* Main Heading - Refined for nightwear positioning */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-4 sm:mb-6 font-normal text-text-primary max-w-lg">
              Comfort, beautifully yours.
            </h1>
            
            {/* Description */}
            <p className="text-body-sm sm:text-body text-text-secondary mb-8 sm:mb-10 max-w-md leading-relaxed">
              Discover beautiful nighties and frock nighties designed for your everyday comfort.
            </p>
            
            {/* CTAs - Two primary buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={nightiesCollection ? `/collections/${nightiesCollection.slug}` : '/collections/nighties'}
                className="btn-primary text-center"
              >
                Shop Nighties
              </Link>
              <Link 
                href={frockNightiesCollection ? `/collections/${frockNightiesCollection.slug}` : '/collections/frock-nighties'}
                className="btn-secondary text-center"
              >
                Shop Frock Nighties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Section - "JUST LANDED" */}
      <section className="bg-ivory-100 py-12 sm:py-20 lg:py-28">
        <div className="container-wide">
          {/* Mobile: Stacked cards */}
          <div className="block sm:hidden mb-8">
            <p className="section-label-sm">Featured</p>
            <h2 className="section-heading-md mb-6">Just Landed</h2>
            
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
              className="btn-primary"
            >
              Shop Now
            </Link>
          </div>

          {/* Desktop: 1 + 3 grid layout */}
          <div className="hidden sm:grid gap-0 sm:gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-3">
            {/* Left - Text and button */}
            <div className="flex flex-col justify-center pb-8 sm:pb-0">
              <p className="section-label">Featured</p>
              <h2 className="section-heading mb-6 leading-tight">
                Just Landed
              </h2>
              <p className="text-muted mb-8 max-w-xs">
                Discover our latest additions to our bestselling collection. New styles and timeless elegance.
              </p>
              <Link
                href="/search"
                className="btn-primary w-fit"
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
      <section className="bg-white py-12 sm:py-20 lg:py-28">
        <div className="container-wide">
          <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 auto-rows-[240px] sm:auto-rows-[380px] lg:auto-rows-[480px]">
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
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                <h3 className="font-display text-lg sm:text-5xl text-white font-normal uppercase tracking-[0.05em]">
                  New Arrivals
                </h3>
                <button className="mt-3 sm:mt-8 px-3 sm:px-6 py-1.5 sm:py-2.5 bg-white text-text-primary font-bold text-xs uppercase tracking-[0.18em] hover:bg-ivory-100 transition-all pointer-events-none rounded-md">
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
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                <h3 className="font-display text-lg sm:text-5xl text-white font-normal uppercase tracking-[0.05em]">
                  Best Sellers
                </h3>
                <button className="mt-3 sm:mt-8 px-3 sm:px-6 py-1.5 sm:py-2.5 bg-white text-text-primary font-bold text-xs uppercase tracking-[0.18em] hover:bg-ivory-100 transition-all pointer-events-none rounded-md">
                  Shop Now
                </button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="bg-ivory-50 py-12 sm:py-20 lg:py-28">
        <div className="container-wide">
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <p className="section-label">Curated Collection</p>
            <h2 className="section-heading">
              Featured Styles
            </h2>
          </div>
          <ProductGrid products={featured} priorityCount={4} />
        </div>
      </section>
    </main>
  )
}
