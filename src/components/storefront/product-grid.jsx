import { ProductCard } from './product-card'

export function ProductGrid({ products, priorityCount = 0 }) {
  if (!products.length) {
    return (
      <div className="border border-border-light rounded-lg px-8 py-24 text-center bg-cream-50">
        <p className="font-display text-2xl text-text-primary font-normal">No products found</p>
        <p className="mt-3 text-sm text-text-secondary">Try another collection or search term.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < priorityCount} />
      ))}
    </div>
  )
}
