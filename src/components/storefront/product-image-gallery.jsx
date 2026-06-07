'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { getColorHex } from '@/lib/format'

/**
 * ProductImageGallery
 * Displays main product image + color swatches
 * Syncs with URL query parameter (?color=maroon)
 * Shows premium active state with ring offset
 */
export function ProductImageGallery({ product, selectedColor, onColorChange }) {
  const [imageTransition, setImageTransition] = useState(false)

  // Get images for selected color from product_images table
  // Fallback to main images if no color-specific images exist
  const currentImages = useMemo(() => {
    if (!selectedColor) return product.images || []
    
    // If colorImages exists from variants query, use it
    if (product.colorImages && product.colorImages.length > 0) {
      const colorSpecificImages = product.colorImages
        .filter((img) => img.color_name === selectedColor)
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => img.image_url)
      
      if (colorSpecificImages.length > 0) return colorSpecificImages
    }
    
    // Fallback to general images
    return product.images || []
  }, [selectedColor, product.images, product.colorImages])

  const handleColorChange = (newColor) => {
    setImageTransition(true)
    onColorChange(newColor)
    setTimeout(() => setImageTransition(false), 300)
  }

  return (
    <div>
      {/* Main Image Gallery */}
      <div className="grid gap-3 sm:grid-cols-2">
        {currentImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={`relative aspect-[4/5] overflow-hidden bg-brand-100 transition-opacity duration-300 ${
              imageTransition ? 'opacity-50' : 'opacity-100'
            } ${index === 0 ? 'sm:col-span-2' : ''}`}
          >
            <Image
              src={image}
              alt={`${product.title} - ${selectedColor || 'Product'} ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Color Variant Swatches */}
      {product.colors && product.colors.length > 1 && (
        <div className="mt-6 p-4 border border-brand-200 rounded-sm bg-brand-50">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500 mb-3">
            Available Colors
          </p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => {
              const isOutOfStock = product.color_stock?.[color] === 0
              const isSelected = selectedColor === color
              const colorHex = getColorHex(color)

              return (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  disabled={isOutOfStock}
                  className={`group relative flex flex-col items-center gap-1.5 transition disabled:cursor-not-allowed ${
                    isOutOfStock ? 'disabled:opacity-50' : ''
                  }`}
                  title={isOutOfStock ? `${color} - Out of stock` : color}
                  aria-pressed={isSelected}
                >
                  {/* Swatch Circle */}
                  <div className="relative transition-all h-12 w-12">
                    <div
                      className={`absolute inset-0 rounded-full border-2 transition-all ${
                        isOutOfStock
                          ? 'border-gray-300 opacity-40'
                          : isSelected
                          ? 'border-black ring-2 ring-offset-2 ring-black shadow-sm'
                          : 'border-brand-200 hover:border-brand-900'
                      }`}
                      style={{
                        backgroundColor: isOutOfStock ? '#f3f4f6' : colorHex,
                      }}
                    />

                    {/* Selected Indicator - White dot in center */}
                    {isSelected && !isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}

                    {/* Out of Stock - Diagonal strikethrough */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-0.5 w-2/3 bg-gray-400 rotate-45" />
                      </div>
                    )}
                  </div>

                  {/* Color Label */}
                  <span
                    className={`text-xs font-medium transition ${
                      isOutOfStock
                        ? 'text-gray-400'
                        : isSelected
                        ? 'text-brand-900 font-semibold'
                        : 'text-brand-700 group-hover:text-brand-900'
                    }`}
                  >
                    {color}
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
