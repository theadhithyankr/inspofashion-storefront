export function ProductCard({ product, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f5f5f4] mb-3">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Quick Add overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full bg-white text-brand-900 border border-brand-200 py-3 text-sm font-bold uppercase tracking-wider hover:bg-brand-900 hover:text-white transition-colors shadow-sm">
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base font-bold text-brand-900 leading-tight group-hover:underline underline-offset-4 decoration-2">
            {product.title}
          </h3>
        </div>
        <p className="text-sm font-medium text-brand-600 mt-1">
          {product.category}
        </p>
        <p className="text-base font-medium text-brand-900 mt-1">
          ₹{parseFloat(product.price).toFixed(2)}
        </p>
        
        {product.colors && product.colors.length > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {product.colors.map(color => (
              <span key={color} className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded">
                {color}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
