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
      <section className="relative flex min-h-[calc(100svh-104px)] items-end overflow-hidden">
        <Image src={heroImage} alt="Inspofashions campaign" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />
        <div className="relative mx-auto grid w-full max-w-[1500px] gap-8 px-4 pb-10 text-white sm:px-6 md:grid-cols-12 lg:px-10">
          <div className="md:col-span-8 lg:col-span-7">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em]">{clampText(hero?.subtitle, 'New Editorial Drop')}</p>
            <h1 className="font-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              {clampText(hero?.title, 'Clothing that knows how to arrive.')}
            </h1>
          </div>
          <div className="self-end md:col-span-4">
            <p className="mb-6 max-w-sm text-sm leading-7 text-white/85">
              Premium clothing, clear sizing, and a direct WhatsApp order flow. No payment gateway, no friction.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={hero?.button_men_url || (collections[0] ? `/collections/${collections[0].slug}` : '/search')} className="bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-900">
                {hero?.button_men || 'Shop Collection'}
              </Link>
              <Link href={hero?.button_women_url || '/search'} className="border border-white px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
                {hero?.button_women || 'View All'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">Collections</p>
            <h2 className="mt-2 font-display text-4xl text-brand-900">Shop by mood</h2>
          </div>
          <Link href="/search" className="hidden items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] sm:flex">
            All pieces <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.slice(0, 4).map((collection, index) => (
            <Link key={collection.id} href={`/collections/${collection.slug}`} className={`group relative min-h-[360px] overflow-hidden bg-brand-100 ${index === 0 ? 'lg:col-span-2' : ''}`}>
              {collection.image_url && <Image src={collection.image_url} alt={collection.name} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="font-display text-3xl">{collection.name}</h3>
                {collection.description && <p className="mt-2 max-w-md text-sm leading-6 text-white/80">{collection.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">New arrivals</p>
          <h2 className="mt-2 font-display text-4xl text-brand-900">The current edit</h2>
        </div>
        <ProductGrid products={newArrivals} priorityCount={4} />
      </section>
    </main>
  )
}
