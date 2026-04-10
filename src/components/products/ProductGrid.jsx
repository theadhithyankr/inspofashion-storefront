import { ProductCard } from './ProductCard'

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-warm-200 mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-warm-200 w-1/3" />
        <div className="h-4 bg-warm-200 w-3/4" />
        <div className="h-4 bg-warm-200 w-1/4" />
      </div>
    </div>
  )
}

export function ProductGrid({ products, loading, onProductClick }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-brand-500 text-lg">No products found.</p>
        <p className="text-brand-400 text-sm mt-2">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
      ))}
    </div>
  )
}
