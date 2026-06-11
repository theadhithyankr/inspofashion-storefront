'use client'

import { useMemo, useEffect, useState } from 'react'
import Image from 'next/image'
import { getProductVariantColors, getProductVariantImages } from '@/lib/format'
import { getColorCodeWithFallback, isLightColor } from '@/lib/color-validation'
import { preloadVariantImages } from '@/lib/image-cache'

function normalizeColorForCompare(value = '') {
  return value?.toString().trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function getDisplayColor(product, color) {
  const normalizedColor = normalizeColorForCompare(color)
  const declaredColor = product.colors?.find((item) => normalizeColorForCompare(item) === normalizedColor)
  return declaredColor || color
}

export function ProductVariantGallery({ product, selectedColor, onColorChange }) {
  // ✅ NEW: Preload variant images on mount
  const [preloadStatus, setPreloadStatus] = useState('idle')

  useEffect(() => {
    if (!product?.variants?.length) return

    setPreloadStatus('loading')
    preloadVariantImages(product.variants)
      .then(() => setPreloadStatus('complete'))
      .catch((error) => {
        console.warn('[Gallery] Image preload failed:', error)
        setPreloadStatus('error')
      })
  }, [product])

  const variantColors = useMemo(() => getProductVariantColors(product), [product])
  const variantMap = useMemo(() => product.variantMap || {}, [product.variantMap])
  const declaredColors = product.colors?.filter(Boolean) || []
  const colors = declaredColors.length > 0 ? declaredColors : variantColors

  const activeColor = colors.find((color) => normalizeColorForCompare(color) === normalizeColorForCompare(selectedColor)) || colors[0] || ''
  const mappedImages = activeColor ? getProductVariantImages(product, activeColor) : []
  const galleryImages = mappedImages.length > 0 ? mappedImages : product.images || []

  if (galleryImages.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-100" />
    )
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {galleryImages.map((image, index) => (
          <div key={`${image}-${index}`} className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-100 ${index === 0 ? 'sm:col-span-2' : ''}`}>
            <Image
              src={image}
              alt={index === 0 ? product.title : `${product.title} ${activeColor || `image ${index + 1}`}`}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {colors.length > 0 && (
        <div className="mt-6 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Colour</p>
              <p className="mt-1 text-sm font-semibold text-brand-900">
                {activeColor ? `Selected: ${getDisplayColor(product, activeColor)}` : 'Choose a colour'}
              </p>
            </div>
            {mappedImages.length > 0 && (
              <p className="text-xs text-brand-500">{mappedImages.length} image{mappedImages.length > 1 ? 's' : ''} for this colour</p>
            )}
          </div>

          {preloadStatus === 'loading' && (
            <p className="mt-2 text-xs text-brand-500">Loading images...</p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {colors.map((color) => {
              const normalizedColor = normalizeColorForCompare(color)
              const isActive = normalizedColor === normalizeColorForCompare(activeColor)

              // ✅ NEW: Get color code from variant map
              const variant = variantMap[normalizedColor]
              let hex = null

              if (variant) {
                // ✅ Use backend color_code with fallback
                hex = getColorCodeWithFallback(variant, variant.images)
              } else {
                // Fallback if no variant data
                hex = getColorCodeWithFallback({ color }, mappedImages)
              }

              const isOutOfStock = variant?.stock <= 0
              const isLightSwatch = isLightColor(hex)

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => !isOutOfStock && onColorChange?.(color)}
                  disabled={isOutOfStock}
                  aria-pressed={isActive}
                  aria-label={`${color}${isOutOfStock ? ' (out of stock)' : ''}`}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border-brand-900 bg-brand-900 text-white'
                      : isOutOfStock
                        ? 'border-brand-200 bg-brand-50 text-brand-400 cursor-not-allowed opacity-50'
                        : 'border-brand-200 bg-white text-brand-900 hover:border-brand-900'
                  }`}
                >
                  <span
                    className={`relative h-7 w-7 rounded-full border ${
                      isLightSwatch ? 'border-brand-300' : 'border-white'
                    } shadow-sm`}
                    style={{ backgroundColor: hex }}
                    aria-hidden="true"
                  >
                    {isActive && (
                      <span className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-white shadow" />
                    )}
                  </span>
                  <span className="flex flex-col items-start">
                    <span>{getDisplayColor(product, color)}</span>
                    {isOutOfStock && (
                      <span className="text-xs opacity-75">Out of stock</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}