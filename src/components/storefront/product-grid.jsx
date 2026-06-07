import { ProductCard } from './product-card'

export function ProductGrid({ products, priorityCount = 0 }) {
  if (!products.length) {
    return (
      <div className="border border-dashed border-brand-300 px-8 py-24 text-center">
        <p className="text-lg font-semibold">No products found</p>
        <p className="mt-3 text-sm text-brand-500">Try another collection or search term.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-x-6 sm:gap-y-8 md:grid-cols-3 md:gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12 xl:grid-cols-5 xl:gap-y-14">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < priorityCount} />
      ))}
    </div>
  )
}
