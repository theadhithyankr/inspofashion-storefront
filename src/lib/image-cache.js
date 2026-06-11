/**
 * Image preloading and caching utilities
 * Handles preloading variant images for instant switching without flicker
 */

const imageCache = new Map()
const preloadedImages = new Set()

/**
 * Preload a single image URL
 * @param {string} src - Image URL to preload
 * @returns {Promise} Resolves when image is loaded
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No image source provided'))
      return
    }

    // If already preloading, return existing promise
    if (preloadedImages.has(src)) {
      resolve({ cached: true, src })
      return
    }

    // If already cached, resolve immediately
    if (imageCache.has(src)) {
      resolve(imageCache.get(src))
      return
    }

    preloadedImages.add(src)

    const img = new Image()
    const startTime = performance.now()

    img.onload = () => {
      const loadTime = performance.now() - startTime
      const cacheEntry = { cached: true, loadTime, src, timestamp: Date.now() }
      imageCache.set(src, cacheEntry)
      preloadedImages.delete(src)
      resolve(cacheEntry)
    }

    img.onerror = () => {
      preloadedImages.delete(src)
      console.warn(`[Image Preload] Failed to load image: ${src}`)
      reject(new Error(`Failed to load image: ${src}`))
    }

    img.src = src
  })
}

/**
 * Preload multiple images in parallel
 * @param {string[]} imageUrls - Array of image URLs
 * @returns {Promise} Resolves when all images are loaded (or at least attempted)
 */
export async function preloadImages(imageUrls = []) {
  if (!Array.isArray(imageUrls)) return { loaded: 0, failed: 0 }

  const results = await Promise.allSettled(
    imageUrls.map((url) => preloadImage(url))
  )

  const stats = {
    loaded: results.filter((r) => r.status === 'fulfilled').length,
    failed: results.filter((r) => r.status === 'rejected').length,
    total: imageUrls.length,
  }

  if (stats.failed > 0) {
    console.warn(`[Image Preload] ${stats.failed} of ${stats.total} images failed to preload`)
  }

  return stats
}

/**
 * Preload all images from variant objects
 * @param {object[]} variants - Array of variant objects with images
 * @returns {Promise} Stats object
 */
export async function preloadVariantImages(variants = []) {
  if (!Array.isArray(variants)) return { loaded: 0, failed: 0 }

  const allImages = []
  variants.forEach((variant) => {
    if (variant.images && Array.isArray(variant.images)) {
      allImages.push(...variant.images)
    }
  })

  return preloadImages(allImages)
}

/**
 * Get cached image entry
 * @param {string} src - Image URL
 * @returns {object|null} Cache entry or null
 */
export function getCachedImage(src) {
  return imageCache.get(src) || null
}

/**
 * Check if image is cached
 * @param {string} src - Image URL
 * @returns {boolean}
 */
export function isImageCached(src) {
  return imageCache.has(src)
}

/**
 * Get cache metrics
 * @returns {object} Cache statistics
 */
export function getImageCacheMetrics() {
  const entries = Array.from(imageCache.values())
  const totalLoadTime = entries.reduce((sum, entry) => sum + (entry.loadTime || 0), 0)

  return {
    cached: imageCache.size,
    totalLoadTime: totalLoadTime.toFixed(2) + 'ms',
    averageLoadTime: entries.length > 0 ? (totalLoadTime / entries.length).toFixed(2) + 'ms' : '0ms',
    oldestEntry: entries.length > 0 ? new Date(Math.min(...entries.map((e) => e.timestamp))).toLocaleTimeString() : 'N/A',
  }
}

/**
 * Clear all cached images
 */
export function clearImageCache() {
  imageCache.clear()
  preloadedImages.clear()
}

/**
 * Clear specific image from cache
 * @param {string} src - Image URL to clear
 */
export function clearCachedImage(src) {
  imageCache.delete(src)
  preloadedImages.delete(src)
}

/**
 * React hook for preloading variant images
 * Usage: useImagePreloader(product.variants)
 * @param {object[]} variants - Array of variants with images
 */
export function useImagePreloader(variants) {
  const { useEffect } = require('react')

  useEffect(() => {
    if (!variants?.length) return

    preloadVariantImages(variants).then((stats) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Image Preload] Variant images preloaded:', stats)
      }
    })
  }, [variants])
}
