import { ProductCard } from './product-card'

export function ProductGrid({ products, priorityCount = 0 }) {
  if (!products.length) {
    return (
      <div className="border border-dashed border-brand-300 px-6 py-16 text-center">
        <p className="text-lg font-semibold">No products found</p>
        <p className="mt-2 text-sm text-brand-500">Try another collection or search term.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < priorityCount} />
      ))}
    </div>
  )
}
