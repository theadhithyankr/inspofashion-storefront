import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'

export function ProductCard({ product, priority = false }) {
  const image = product.images?.[0] || product.image_url

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-100">
        {image && (
          <Image
            src={image}
            alt={product.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        )}
        {product.is_featured && (
          <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-900">
            Featured
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold leading-tight text-brand-900 group-hover:underline">{product.title}</h3>
          <p className="mt-1 text-sm text-brand-500">{product.category}</p>
        </div>
        <p className="shrink-0 font-semibold">{formatPrice(product.price)}</p>
      </div>
      {product.colors?.length > 0 && (
        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-brand-500">{product.colors.length} colours</p>
      )}
    </Link>
  )
}
