'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { formatPrice } from '@/lib/format'

export function ProductCard({ product, priority = false }) {
  const [isHovering, setIsHovering] = useState(false)
  const image = product.images?.[0] || product.image_url
  const secondaryImage = product.images?.[1] || null

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div 
        className="relative aspect-[4/5] overflow-hidden bg-brand-100"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Primary image */}
        {image && (
          <Image
            src={image}
            alt={product.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`object-cover transition-all duration-500 will-change-opacity ${
              product.is_sold_out ? 'grayscale opacity-60' : 'group-hover:scale-105'
            } ${isHovering && secondaryImage ? 'opacity-0' : 'opacity-100'}`}
          />
        )}

        {/* Secondary image on hover (desktop only) */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.title} - alternate view`}
            fill
            priority={false}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`absolute inset-0 object-cover transition-all duration-500 will-change-opacity hidden sm:block ${
              product.is_sold_out ? 'grayscale opacity-60' : 'group-hover:scale-105'
            } ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {product.is_featured && (
          <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-900 z-10">
            Featured
          </span>
        )}
        {product.is_sold_out && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
            <span className="bg-white px-6 py-2 text-sm font-bold uppercase tracking-[0.16em] text-brand-900">
              Sold Out
            </span>
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className={`font-semibold leading-tight group-hover:underline ${product.is_sold_out ? 'text-brand-400' : 'text-brand-900'}`}>{product.title}</h3>
          <p className="mt-1 text-sm text-brand-500">{product.category}</p>
        </div>
        <p className={`shrink-0 font-semibold ${product.is_sold_out ? 'text-brand-400' : ''}`}>{formatPrice(product.price)}</p>
      </div>
      {product.colors?.length > 0 && (
        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-brand-500">{product.colors.length} colours</p>
      )}
    </Link>
  )
}
