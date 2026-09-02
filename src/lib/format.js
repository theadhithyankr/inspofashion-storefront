export function slugify(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function formatPrice(value) {
  const amount = Number.parseFloat(value || 0)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function normalizePhoneNumber(value = '') {
  return value.toString().replace(/[^\d]/g, '')
}

export function sanitizeUrl(value = '#') {
  const url = value?.toString().trim()
  if (!url) return '#'
  if (url.startsWith('/') || url.startsWith('#')) return url

  try {
    const parsed = new URL(url)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? url : '#'
  } catch {
    return '#'
  }
}

export function getProductSlug(product) {
  return product?.slug || slugify(product?.title || product?.id || 'product')
}

export function getCollectionSlug(collection) {
  return collection?.slug || slugify(collection?.name || collection?.id || 'collection')
}

export function getProductImages(product) {
  const images = Array.isArray(product?.images) ? product.images.filter(Boolean) : []
  if (images.length > 0) return images
  return product?.image_url ? [product.image_url] : []
}

export const COLOR_KEYWORDS = [
  'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'gray', 'grey',
  'brown', 'beige', 'navy', 'cream', 'gold', 'silver', 'bronze', 'copper', 'rose', 'maroon',
  'coral', 'teal', 'mint', 'sage', 'khaki', 'olive', 'tan', 'peach', 'lavender', 'indigo',
]

const VARIANT_IMAGE_MAP_KEYS = [
  'variant_images',
  'variant_image_map',
  'color_images',
  'color_image_map',
  'option_images',
  'option_image_map',
]

function normalizeColorName(value = '') {
  return value?.toString().trim().toLowerCase().replace(/[_-]+/g, ' ') || ''
}

function compactColorName(value = '') {
  return normalizeColorName(value).replace(/\s+/g, ' ').trim()
}

function escapeRegExp(value = '') {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function imageContainsColor(image = '', color = '') {
  const normalizedImage = image?.toString().toLowerCase().replace(/[_-]+/g, ' ') || ''
  const normalizedColor = compactColorName(color)
  if (!normalizedColor) return false

  const pattern = new RegExp(`(^|\\s)${escapeRegExp(normalizedColor)}(\\s|$)`)
  return pattern.test(normalizedImage)
}

function readImageList(value) {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map((item) => {
        // If item is already a string, use it
        if (typeof item === 'string') return item.trim()
        // If item is an object, try to extract URL from common fields
        if (typeof item === 'object' && item !== null) {
          return item.url || item.image_url || item.imageUrl || item.src || item.href || ''
        }
        return String(item).trim()
      })
      .filter(Boolean)
  }
  if (typeof value === 'string') return value.trim() ? [value.trim()] : []
  if (typeof value === 'object') {
    if (Array.isArray(value.images)) return readImageList(value.images)
    if (Array.isArray(value.imageUrls)) return readImageList(value.imageUrls)

    const directImage = value.image_url ?? value.imageUrl ?? value.image ?? value.url
    if (directImage) return [String(directImage).trim()].filter(Boolean)
  }
  return []
}

function getVariantImages(variant = {}) {
  // variant_images is the actual Supabase column name on product_variants rows.
  // variant.images is kept as a fallback for any legacy/mock data.
  return readImageList(
    variant.variant_images ??
    variant.images ??
    variant.image_urls ??
    variant.imageUrls ??
    [variant.image_url ?? variant.imageUrl ?? variant.image]
  )
}

function getVariantColorName(variant = {}) {
  return variant.color_name ?? variant.color ?? variant.name ?? variant.option1 ?? variant.option_value ?? variant.option1_value ?? variant.option2 ?? variant.option2_value ?? variant.value
}

function getVariantImageMap(product = {}) {
  const map = {}

  VARIANT_IMAGE_MAP_KEYS.forEach((key) => {
    const source = product[key]

    if (Array.isArray(source)) {
      source.forEach((variant) => {
        const color = getVariantColorName(variant)
        if (!color) return

        const images = getVariantImages(variant)
        if (images.length > 0) map[compactColorName(color)] = images
      })
      return
    }

    if (source && typeof source === 'object') {
      Object.entries(source).forEach(([color, images]) => {
        const normalizedColor = compactColorName(color)
        if (!normalizedColor) return

        map[normalizedColor] = readImageList(images)
      })
    }
  })

  return map
}

function getMappedVariantImages(product, color) {
  const map = getVariantImageMap(product)
  const normalizedColor = compactColorName(color)
  return map[normalizedColor] || []
}

function getVariantImagesForColor(product, color) {
  if (!Array.isArray(product?.variants)) return []

  const normalizedColor = compactColorName(color)
  const images = product.variants
    .filter((variant) => compactColorName(getVariantColorName(variant)) === normalizedColor)
    .flatMap(getVariantImages)

  return images.filter(Boolean)
}

function getImageInferredForColor(product, color) {
  const images = getProductImages(product)
  return images.filter((image) => imageContainsColor(image, color))
}

export function getProductVariantImages(product, color) {
  const mappedImages = getMappedVariantImages(product, color)
  if (mappedImages.length > 0) return mappedImages

  const variantImages = getVariantImagesForColor(product, color)
  if (variantImages.length > 0) return variantImages

  return getImageInferredForColor(product, color)
}

export function getVariantImageForColor(product, color) {
  return getProductVariantImages(product, color)[0] || null
}

export function getProductVariantColors(product = {}) {
  const colors = new Set()

  if (Array.isArray(product.colors)) {
    product.colors.forEach((color) => {
      const normalizedColor = compactColorName(color)
      if (normalizedColor) colors.add(normalizedColor)
    })
  }

  if (Array.isArray(product.variants)) {
    product.variants.forEach((variant) => {
      const normalizedColor = compactColorName(getVariantColorName(variant))
      if (normalizedColor) colors.add(normalizedColor)
    })
  }

  const imageMap = getVariantImageMap(product)
  Object.keys(imageMap).forEach((color) => {
    if (color) colors.add(color)
  })

  getProductImages(product).forEach((image) => {
    COLOR_KEYWORDS.forEach((color) => {
      if (imageContainsColor(image, color)) colors.add(color)
    })
  })

  return Array.from(colors).filter(Boolean)
}

export function clampText(value = '', fallback = '') {
  return value?.toString().trim() || fallback
}

/**
 * Create a normalized map of color names to variant metadata
 * Enables efficient color → variant lookups
 * @param {object[]} variants - Array of variant objects
 * @returns {object} Map of normalized color names to variant metadata
 */
export function createVariantMap(variants = []) {
  const map = {}
  
  if (!Array.isArray(variants)) return map
  
  variants.forEach((variant) => {
    if (!variant) return
    
    // Check multiple possible color field names from database
    const colorName = variant.color_name || variant.color || variant.name || variant.option1 || ''
    if (!colorName) return
    
    const normalized = compactColorName(colorName)
    if (!normalized) return
    
    // Store variant metadata keyed by normalized color name
    // variant_images is the Supabase column; fall back to variant.images for legacy data
    // stock_quantity is the Supabase column; fall back to variant.stock for legacy data
    const variantImages = variant.variant_images ?? variant.images
    const variantStock = variant.stock_quantity ?? variant.stock ?? 0
    map[normalized] = {
      id: variant.id,
      color: colorName,
      color_code: variant.color_code || null,
      sku: variant.sku || null,
      stock: variantStock,
      images: Array.isArray(variantImages) ? variantImages : [],
      price: variant.price || null,
    }
  })
  
  return map
}

/**
 * Get variant by color name (case-insensitive)
 * @param {object} variantMap - Map created by createVariantMap()
 * @param {string} colorName - Color name to look up
 * @returns {object|null} Variant metadata or null
 */
export function getVariantByColorName(variantMap, colorName) {
  if (!variantMap || typeof variantMap !== 'object') return null
  
  const normalized = compactColorName(colorName)
  return variantMap[normalized] || null
}

/**
 * DEPRECATED: Use getColorCodeFromVariant() instead
 * This function is kept for backward compatibility only
 * @deprecated Use variant.color_code from backend data
 */
export function getColorHex(colorName) {
  console.warn('[DEPRECATED] getColorHex() is deprecated. Use backend color_code instead.')
  
  // Minimal fallback for compatibility (removed full map)
  const fallbackMap = {
    'red': '#dc2626', 'blue': '#2563eb', 'green': '#16a34a',
    'black': '#1f2937', 'white': '#f5f5f5', 'navy': '#001f3f',
    'maroon': '#800000', 'dark green': '#006400', 'dark blue': '#00008B',
  }
  return fallbackMap[colorName?.toLowerCase()] || '#d1d5db'
}

/**
 * Get color code directly from variant object (PRIMARY METHOD)
 * This should be used instead of getColorHex()
 * @param {object} variant - Variant object with color_code
 * @returns {string|null} Valid hex color code or null
 */
export function getColorCodeFromVariant(variant) {
  if (!variant?.color_code) return null
  
  const hex = variant.color_code
  if (!/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
    console.error(`[Color] Invalid hex format: ${hex}`)
    return null
  }
  
  return hex
}

export function extractColorsFromImages(images = []) {
  if (!Array.isArray(images) || images.length === 0) return []

  const detectedColors = new Set()

  images.forEach((image) => {
    if (!image) return

    COLOR_KEYWORDS.forEach((color) => {
      if (imageContainsColor(image, color)) {
        detectedColors.add(color.charAt(0).toUpperCase() + color.slice(1))
      }
    })
  })

  return Array.from(detectedColors).sort()
}

export function extractColorsFromTags(tags = []) {
  if (!Array.isArray(tags)) return []

  const colorKeywords = ['color', 'colour', 'shade', 'hue', 'tone']
  const colors = new Set()

  tags.forEach((tag) => {
    if (!tag) return
    const tagLower = tag.toLowerCase()

    // Check if tag contains color-related keywords
    if (colorKeywords.some((keyword) => tagLower.includes(keyword))) {
      // Extract the actual color value
      const colorValue = tag.replace(new RegExp(colorKeywords.join('|'), 'gi'), '').trim()
      if (colorValue) colors.add(colorValue)
    }
  })

  return Array.from(colors).sort()
}
