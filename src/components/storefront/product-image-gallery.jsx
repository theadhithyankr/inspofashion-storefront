'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'

function getColorHex(colorName) {
  const colorMap = {
    'red': '#dc2626', 'blue': '#2563eb', 'green': '#16a34a', 'yellow': '#eab308',
    'orange': '#ea580c', 'purple': '#9333ea', 'pink': '#ec4899', 'black': '#1f2937',
    'white': '#f5f5f5', 'gray': '#6b7280', 'grey': '#6b7280', 'brown': '#92400e',
    'beige': '#dcc8a3', 'navy': '#001f3f', 'cream': '#fffdd0', 'gold': '#fbbf24',
    'silver': '#d1d5db', 'bronze': '#b45309', 'copper': '#b7410e', 'rose': '#fb7185',
    'maroon': '#800000', 'coral': '#ff7f50', 'teal': '#14b8a6', 'mint': '#a7f3d0',
    'sage': '#c4b5a0', 'khaki': '#f0e68c', 'olive': '#808000', 'tan': '#d2b48c',
    'peach': '#ffbe98', 'lavender': '#e6e6fa', 'indigo': '#4b0082',
  }
  return colorMap[colorName?.toLowerCase()] || '#e5e7eb'
}

export function ProductImageGallery({ product, selectedColor, onColorChange }) {
  const [localColor, setLocalColor] = useState(product.colors?.[0] || '')
  const [imageTransition, setImageTransition] = useState(false)

  // Use prop color if provided, otherwise use local state
  const activeColor = selectedColor || localColor

  // Get images for selected color
  const currentImages = useMemo(() => {
    if (!activeColor) return product.images || []
    
    // Check if product has color-specific images
    if (product.color_images && product.color_images[activeColor]) {
      return product.color_images[activeColor]
    }
    
    // Fallback to general images if no color-specific images
    return product.images || []
  }, [activeColor, product.images, product.color_images])

  const handleColorChange = (newColor) => {
    setImageTransition(true)
    setLocalColor(newColor)
    
    // Also call the parent callback if provided
    if (onColorChange) {
      onColorChange(newColor)
    }
    
    setTimeout(() => setImageTransition(false), 300)
  }

  return (
    <div>
      {/* Image Gallery */}
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
              alt={`${product.title} ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Color Variant Switcher */}
      {product.colors && product.colors.length > 1 && (
        <div className="mt-6 p-4 border border-brand-200 rounded-sm bg-brand-50">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500 mb-3">
            Available Colors
          </p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => {
              const isOutOfStock = product.color_stock?.[color] === 0
              const isSelected = activeColor === color
              const colorHex = getColorHex(color)

              return (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  disabled={isOutOfStock}
                  className="group relative flex flex-col items-center gap-1.5 transition disabled:cursor-not-allowed"
                  title={isOutOfStock ? `${color} - Out of stock` : color}
                >
                  {/* Swatch Circle */}
                  <div className="relative transition-all h-12 w-12">
                    <div
                      className={`absolute inset-0 rounded-full border-2 transition-all ${
                        isOutOfStock
                          ? 'border-gray-300 opacity-40'
                          : isSelected
                          ? 'border-brand-900 ring-2 ring-brand-900/20'
                          : 'border-brand-200 hover:border-brand-900'
                      }`}
                      style={{
                        backgroundColor: isOutOfStock ? '#f3f4f6' : colorHex,
                      }}
                    />

                    {/* Selected Indicator */}
                    {isSelected && !isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}

                    {/* Out of Stock Strikethrough */}
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
                        ? 'text-brand-900'
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
