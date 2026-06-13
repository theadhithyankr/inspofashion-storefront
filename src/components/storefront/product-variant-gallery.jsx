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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  
  const containerRef = useRef(null)
  const carouselRef = useRef(null)
  const touchStartXRef = useRef(0)
  const touchStartTimeRef = useRef(0)
  const transitionTimeoutRef = useRef(null)

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

  // Create infinite loop array
  const infiniteImages = galleryImages.length > 1 
    ? [galleryImages[galleryImages.length - 1], ...galleryImages, galleryImages[0]]
    : galleryImages

  // Reset when color changes
  useEffect(() => {
    setCurrentIndex(1)
    setIsTransitioning(false)
    setDragX(0)
    setIsDragging(false)
  }, [activeColor])

  // Update carousel transform
  useEffect(() => {
    if (!carouselRef.current) return

    const offset = isDragging ? dragX : 0
    const translateValue = -currentIndex * 100 + (offset / (containerRef.current?.offsetWidth || 1)) * 100
    
    carouselRef.current.style.transform = `translateX(calc(${translateValue}% + 0px))`

    if (isTransitioning) {
      carouselRef.current.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    } else {
      carouselRef.current.style.transition = 'none'
    }
  }, [currentIndex, isDragging, dragX, isTransitioning])

  // Handle infinite loop wrapping
  useEffect(() => {
    if (!carouselRef.current || isTransitioning || isDragging) return

    if (currentIndex === 0 || currentIndex === infiniteImages.length - 1) {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
      
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(currentIndex === 0 ? galleryImages.length : 1)
      }, 500)
    }
  }, [currentIndex, isTransitioning, isDragging, galleryImages.length, infiniteImages.length])

  const handleTouchStart = (e) => {
    if (isTransitioning) return
    touchStartXRef.current = e.touches[0].clientX
    touchStartTimeRef.current = Date.now()
    setIsDragging(true)
    setDragX(0)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const currentX = e.touches[0].clientX
    const diff = currentX - touchStartXRef.current
    setDragX(diff)
  }

  const handleTouchEnd = (e) => {
    if (!isDragging) return
    
    const elapsedTime = Date.now() - touchStartTimeRef.current
    const distance = dragX
    const velocity = Math.abs(distance) / elapsedTime

    setIsDragging(false)

    // Minimum swipe distance is 20px OR minimum velocity
    if (Math.abs(distance) > 20 || velocity > 0.3) {
      setIsTransitioning(true)
      if (distance > 0) {
        // Swiped right - go to previous
        setCurrentIndex(prev => prev - 1)
      } else {
        // Swiped left - go to next
        setCurrentIndex(prev => prev + 1)
      }
    }
    
    setDragX(0)
  }

  if (galleryImages.length === 0) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-black/5" />
    )
  }

  const displayIndex = currentIndex === 0 ? galleryImages.length : currentIndex === infiniteImages.length - 1 ? 1 : currentIndex

  return (
    <div>
      {/* Carousel */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black/5 aspect-[3/4] cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel wrapper with infinite loop */}
        <div
          ref={carouselRef}
          className="flex h-full"
          style={{
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitPerspective: '1000px',
            perspective: '1000px',
          }}
        >
          {infiniteImages.map((image, idx) => (
            <div
              key={idx}
              className="relative w-full h-full flex-shrink-0"
            >
              <Image
                src={image}
                alt={`Product image ${idx}`}
                fill
                priority={idx <= 2}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover pointer-events-none"
                draggable="false"
              />
            </div>
          ))}
        </div>

        {/* Counter */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 left-4 z-20 bg-black/50 text-white px-3 py-1.5 rounded text-sm font-medium pointer-events-none">
            {displayIndex}/{galleryImages.length}
          </div>
        )}

        {/* Dots */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 right-4 z-20 flex gap-2">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (!isTransitioning && !isDragging) {
                    setIsTransitioning(true)
                    setCurrentIndex(idx + 1)
                  }
                }}
                className={`transition-all duration-300 rounded-full ${
                  idx === displayIndex - 1
                    ? 'w-8 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
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
