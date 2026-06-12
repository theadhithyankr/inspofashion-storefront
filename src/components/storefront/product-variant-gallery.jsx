'use client'

import { useMemo, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const galleryRef = useRef(null)

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

  // Reset image index when color changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [activeColor])

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  // Touch swipe handlers
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchEnd = (e) => setTouchEnd(e.changedTouches[0].clientX)

  useEffect(() => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) handleNextImage()
    if (isRightSwipe) handlePrevImage()
  }, [touchStart, touchEnd])

  if (galleryImages.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-black/5" />
    )
  }

  return (
    <div>
      {/* Slideshow container */}
      <div 
        ref={galleryRef}
        className="relative w-full overflow-hidden rounded-lg bg-black/5 aspect-[3/4]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main image */}
        <div className="relative w-full h-full">
          <Image
            src={galleryImages[currentImageIndex]}
            alt={`${product.title} - ${activeColor || `image ${currentImageIndex + 1}`}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-opacity duration-300"
          />
        </div>

        {/* Navigation buttons - Only show if multiple images */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors duration-300"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-1.5'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Color selection */}
      {colors.length > 0 && (
        <div className="mt-6 rounded-lg border border-black/10 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/60">Colour</p>
              <p className="mt-1 text-sm font-semibold text-black">
                {activeColor ? `Selected: ${getDisplayColor(product, activeColor)}` : 'Choose a colour'}
              </p>
            </div>
            {mappedImages.length > 0 && (
              <p className="text-xs text-black/60">{mappedImages.length} image{mappedImages.length > 1 ? 's' : ''} for this colour</p>
            )}
          </div>

          {preloadStatus === 'loading' && (
            <p className="mt-2 text-xs text-black/60">Loading images...</p>
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
                      ? 'border-black bg-black text-white'
                      : isOutOfStock
                        ? 'border-black/15 bg-black/5 text-black/40 cursor-not-allowed opacity-50'
                        : 'border-black/15 bg-white text-black hover:border-black'
                  }`}
                >
                  <span
                    className={`relative h-7 w-7 rounded-full border ${
                      isLightSwatch ? 'border-black/30' : 'border-white'
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