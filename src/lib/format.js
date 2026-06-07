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

  // Common color patterns in image filenames
  const colorPatterns = [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'gray', 'grey',
    'brown', 'beige', 'navy', 'cream', 'gold', 'silver', 'bronze', 'copper', 'rose', 'maroon',
    'coral', 'teal', 'mint', 'sage', 'khaki', 'olive', 'tan', 'peach', 'lavender', 'indigo',
  ]

  const detectedColors = new Set()

  images.forEach((image) => {
    if (!image) return
    const filename = image.toLowerCase()

    colorPatterns.forEach((color) => {
      // Match color word boundaries (e.g., "red-shirt" or "red_shirt" or "red.jpg")
      if (filename.match(new RegExp(`\\b${color}\\b|[-_]${color}[-_.]|^${color}[-_.]`))) {
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
