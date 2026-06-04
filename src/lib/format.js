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
