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
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  if (typeof value === 'string') return value.trim() ? [value.trim()] : []
  if (typeof value === 'object') {
    if (Array.isArray(value.images)) return value.images.filter(Boolean).map(String)
    if (Array.isArray(value.imageUrls)) return value.imageUrls.filter(Boolean).map(String)

    const directImage = value.image_url ?? value.imageUrl ?? value.image ?? value.url
    if (directImage) return [String(directImage).trim()].filter(Boolean)
  }
  return []
}

function getVariantImages(variant = {}) {
  return readImageList(variant.images ?? variant.image_urls ?? variant.imageUrls ?? [variant.image_url ?? variant.imageUrl ?? variant.image])
}

function getVariantColorName(variant = {}) {
  return variant.color ?? variant.name ?? variant.option1 ?? variant.option_value ?? variant.option1_value ?? variant.option2 ?? variant.option2_value ?? variant.value
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

export function getColorHex(colorName) {
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
