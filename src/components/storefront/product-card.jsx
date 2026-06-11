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
        className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4"
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
            className={`object-cover transition-all duration-500 ${
              product.is_sold_out ? 'grayscale opacity-50' : 'group-hover:scale-105'
            } ${isHovering && secondaryImage ? 'opacity-0' : 'opacity-100'}`}
          />
        )}

        {/* Secondary image on hover */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.title} - alternate view`}
            fill
            priority={false}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`absolute inset-0 object-cover transition-all duration-500 hidden sm:block ${
              product.is_sold_out ? 'grayscale opacity-50' : 'group-hover:scale-105'
            } ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Featured label */}
        {product.is_featured && (
          <span className="absolute left-4 top-4 bg-black text-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] z-10">
            Featured
          </span>
        )}

        {/* Sold out overlay */}
        {product.is_sold_out && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
            <span className="bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-[0.15em]">
              Sold Out
            </span>
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-2">
        {/* Product name */}
        <h3 className={`font-display text-base sm:text-lg leading-tight font-normal ${
          product.is_sold_out ? 'text-gray-400' : 'text-black group-hover:text-black/70'
        }`}>
          {product.title}
        </h3>

        {/* Category and price */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.1em] text-black/60">
            {product.category}
          </p>
          <p className={`text-sm font-semibold ${
            product.is_sold_out ? 'text-gray-400' : 'text-black'
          }`}>
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Colors info */}
        {product.colors?.length > 0 && (
          <p className="text-xs uppercase tracking-[0.1em] text-black/40">
            {product.colors.length} colour{product.colors.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </Link>
  )
}
