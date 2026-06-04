import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/storefront/product-grid'
import { ProductPurchasePanel } from '@/components/storefront/product-purchase-panel'
import { formatPrice } from '@/lib/format'
import { getProductBySlug, getProducts } from '@/lib/storefront-data'

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}

  return {
    title: product.title,
    description: product.description || `${product.title} at ${formatPrice(product.price)}.`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const allProducts = await getProducts()
  const related = allProducts
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images || [],
    description: product.description,
    brand: { '@type': 'Brand', name: 'Inspofashions' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: Number(product.price).toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto grid max-w-[1500px] gap-10 px-4 py-8 pb-28 sm:px-6 lg:grid-cols-2 lg:px-10 lg:pb-16">
        <div className="grid gap-3 sm:grid-cols-2">
          {product.images.map((image, index) => (
            <div key={`${image}-${index}`} className={`relative aspect-[4/5] overflow-hidden bg-brand-100 ${index === 0 ? 'sm:col-span-2' : ''}`}>
              <Image src={image} alt={`${product.title} ${index + 1}`} fill priority={index === 0} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
        <ProductPurchasePanel product={product} />
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">Related</p>
          <h2 className="mb-8 mt-2 font-display text-4xl text-brand-900">Complete the edit</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  )
}
