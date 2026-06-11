import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGrid } from '@/components/storefront/product-grid'
import { clampText } from '@/lib/format'
import { getStorefrontData } from '@/lib/storefront-data'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const { products, collections, hero } = await getStorefrontData()
  const featured = products.filter((product) => product.is_featured).slice(0, 8)
  const newArrivals = (featured.length ? featured : products).slice(0, 8)
  const heroImage = hero?.image_url || collections[0]?.image_url || products[0]?.images?.[0] || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=80'

  return (
    <main>
      {/* Hero Section - Full width, 100vh desktop, responsive mobile */}
      <section className="relative w-full h-screen lg:h-screen overflow-hidden bg-white">
        {/* Full-width hero image with smart object-position for responsiveness */}
        <Image 
          src={heroImage} 
          alt="Inspofashions campaign" 
          fill 
          priority 
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: 'center center'
          }}
        />

        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/15" />
        
        {/* Content - Left aligned on desktop, bottom-left on mobile */}
        <div className="absolute inset-0 flex flex-col items-start justify-center lg:justify-center lg:items-start pt-20 lg:pt-0">
          <div className="w-full px-6 sm:px-8 lg:px-12 pb-0 lg:pb-0">
            <div className="max-w-md lg:max-w-2xl animate-[fadeIn_0.9s_ease-out_0.2s_forwards] opacity-0">
              {/* Main heading - Large luxury serif */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-1 font-normal text-black">
                {clampText(hero?.subtitle, 'Timeless Comfort.')}
              </h1>
              
              {/* Second line of heading */}
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6 font-normal text-black">
                {clampText(hero?.title, 'Everyday Elegance.')}
              </h2>
              
              {/* Decorative line - Luxury accent */}
              <div className="w-12 h-0.5 bg-black mb-6"></div>
              
              {/* Description text - Premium copy */}
              <p className="mb-8 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-black/90 leading-relaxed">
                Premium Nightwear<br />
                Designed for Modern Women.
              </p>
              
              {/* Call-to-action buttons */}
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

      {/* Shop by Mood Section - Simple grid layout */}
      <section className="bg-white py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-16">
          {/* Section header */}
          <div className="mb-12 lg:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/70 mb-3">Collections</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-black font-normal">
              Shop by mood
            </h2>
          </div>

          {/* Collection cards grid - 2x2 on desktop, responsive on mobile */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 auto-rows-[300px] sm:auto-rows-[350px] lg:auto-rows-[400px]">
            {collections.slice(0, 4).map((collection) => (
              <Link 
                key={collection.id} 
                href={`/collections/${collection.slug}`} 
                className="group relative overflow-hidden bg-gray-200"
              >
                {collection.image_url && (
                  <Image 
                    src={collection.image_url} 
                    alt={collection.name} 
                    fill 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw" 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl text-white font-normal">
                      {collection.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-white py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-16">
          {/* Section header */}
          <div className="mb-12 lg:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/70 mb-3">New Arrivals</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-black font-normal">
              The current edit
            </h2>
          </div>
          
          {/* Product grid */}
          <ProductGrid products={newArrivals} priorityCount={4} />
        </div>
      </section>
    </main>
  )
}
