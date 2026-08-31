'use client'

import { useMemo, useEffect, useState, useRef } from 'react'
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
  const [preloadStatus, setPreloadStatus] = useState('idle')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const containerRef = useRef(null)
  const sliderRef = useRef(null)
  const touchStartRef = useRef(0)
  const touchEndRef = useRef(0)

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

  // Reset when color changes
  useEffect(() => {
    setCurrentIndex(0)
    setIsAnimating(false)
  }, [activeColor])

  // Handle touch start
  const handleTouchStart = (e) => {
    touchStartRef.current = e.changedTouches[0].screenX
    touchEndRef.current = e.changedTouches[0].screenX
  }

  // Handle touch move
  const handleTouchMove = (e) => {
    touchEndRef.current = e.changedTouches[0].screenX
  }

  // Handle touch end - simple and reliable
  const handleTouchEnd = () => {
    if (isAnimating) return
    if (galleryImages.length <= 1) return

    const swipeThreshold = 50
    const diff = touchStartRef.current - touchEndRef.current

    if (Math.abs(diff) > swipeThreshold) {
      setIsAnimating(true)
      if (diff > 0) {
        // Swiped left - next image
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
      } else {
        // Swiped right - prev image
        setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
      }
      setTimeout(() => setIsAnimating(false), 500)
    }

    touchStartRef.current = 0
    touchEndRef.current = 0
  }

  if (galleryImages.length === 0) {
    return (
      <div className="w-full bg-cream-100 rounded-lg" style={{ aspectRatio: '3 / 4' }} />
    )
  }

  return (
    <div className="w-full">
      {/* Gallery Container */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-cream-100 cursor-grab active:cursor-grabbing select-none"
        style={{ aspectRatio: '3 / 4' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {galleryImages.map((image, idx) => (
            <div
              key={`${activeColor}-${idx}`}
              className="relative w-full h-full flex-shrink-0 flex items-center justify-center bg-cream-100"
            >
              <Image
                src={image}
                alt={`${product.title} - image ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 60vw"
                className="object-cover"
                draggable="false"
              />
            </div>
          ))}
        </div>

        {/* Counter */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 left-4 z-20 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded text-xs sm:text-sm font-medium">
            {currentIndex + 1}/{galleryImages.length}
          </div>
        )}

        {/* Dots */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-full">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setCurrentIndex(idx)
                    setTimeout(() => setIsAnimating(false), 500)
                  }
                }}
                className={`transition-all duration-300 rounded-full h-2 ${
                  idx === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Color Selection */}
      {colors.length > 0 && (
        <div className="mt-6 rounded-lg border border-border-light bg-cream-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Colour</p>
              <p className="mt-1 text-sm font-medium text-text-primary">
                {activeColor ? `Selected: ${getDisplayColor(product, activeColor)}` : 'Choose a colour'}
              </p>
            </div>
            {mappedImages.length > 0 && (
              <p className="text-xs text-text-light">{mappedImages.length} image{mappedImages.length > 1 ? 's' : ''}</p>
            )}
          </div>

          {preloadStatus === 'loading' && (
            <p className="mt-2 text-xs text-text-light">Loading images...</p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {colors.map((color) => {
              const normalizedColor = normalizeColorForCompare(color)
              const isActive = normalizedColor === normalizeColorForCompare(activeColor)
              const variant = variantMap[normalizedColor]
              
              let hex = null
              if (variant) {
                hex = getColorCodeWithFallback(variant, variant.images)
              } else {
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
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'border-rose-400 bg-rose-50 text-rose-400'
                      : isOutOfStock
                        ? 'border-border-light bg-cream-100 text-text-light cursor-not-allowed opacity-50'
                        : 'border-border-light bg-white text-text-primary hover:border-rose-250 hover:bg-rose-50'
                  }`}
                >
                  <span
                    className={`relative h-7 w-7 rounded-full border ${
                      isLightSwatch ? 'border-text-light/50' : 'border-rose-100'
                    } shadow-xs`}
                    style={{ backgroundColor: hex }}
                    aria-hidden="true"
                  >
                    {isActive && (
                      <span className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-rose-400 shadow-sm" />
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
