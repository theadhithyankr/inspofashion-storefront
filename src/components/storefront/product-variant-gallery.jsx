'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { getColorHex, getProductVariantColors, getProductVariantImages } from '@/lib/format'

function normalizeColorForCompare(value = '') {
  return value?.toString().trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function getDisplayColor(product, color) {
  const normalizedColor = normalizeColorForCompare(color)
  const declaredColor = product.colors?.find((item) => normalizeColorForCompare(item) === normalizedColor)
  return declaredColor || color
}

export function ProductVariantGallery({ product, selectedColor, onColorChange }) {
  const variantColors = useMemo(() => getProductVariantColors(product), [product])
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

          <div className="mt-4 flex flex-wrap gap-3">
            {colors.map((color) => {
              const normalizedColor = normalizeColorForCompare(color)
              const isActive = normalizedColor === normalizeColorForCompare(activeColor)
              const hex = getColorHex(color)
              const isLightSwatch = ['white', 'cream', 'beige', 'ivory', 'gold', 'silver'].includes(normalizedColor)

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onColorChange?.(color)}
                  aria-pressed={isActive}
                  aria-label={`Show ${color} colour images`}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border-brand-900 bg-brand-900 text-white'
                      : 'border-brand-200 bg-white text-brand-900 hover:border-brand-900'
                  }`}
                >
                  <span
                    className={`relative h-7 w-7 rounded-full border ${
                      isLightSwatch ? 'border-brand-300' : 'border-white'
                    } shadow-sm`}
                    style={{ backgroundColor: hex }}
                  >
                    {isActive && (
                      <span className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-white shadow" />
                    )}
                  </span>
                  <span>{getDisplayColor(product, color)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}