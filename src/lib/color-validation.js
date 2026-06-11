/**
 * Color validation and fallback utilities
 * Handles validation of color codes and provides comprehensive fallback strategies
 */

/**
 * Validates if a string is a valid hex color code
 * @param {string} hex - Color code to validate (e.g., "#006400")
 * @returns {boolean} true if valid hex format
 */
export function isValidHex(hex) {
  if (typeof hex !== 'string') return false
  return /^#[0-9A-Fa-f]{6}$/i.test(hex)
}

/**
 * Validates color code format and logs errors appropriately
 * @param {string} colorName - The color name (for logging)
 * @param {string} colorCode - The color code to validate
 * @returns {string|null} valid color code or null
 */
export function validateColorCode(colorName, colorCode) {
  if (!colorCode) {
    console.warn(`[Color Validation] Missing color code for: ${colorName}`)
    return null
  }

  if (!isValidHex(colorCode)) {
    console.error(`[Color Validation] Invalid hex format for ${colorName}: ${colorCode}`)
    return null
  }

  return colorCode
}

/**
 * Attempts to infer color from image URLs by looking for color keywords
 * @param {string[]} imageUrls - Array of image URLs
 * @returns {string|null} Inferred color name or null
 */
export function inferColorFromImages(imageUrls = []) {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return null

  const COLOR_PATTERNS = {
    '#006400': ['dark green', 'darkgreen', 'green', 'forest'],
    '#00008B': ['dark blue', 'darkblue', 'navy', 'blue'],
    '#800000': ['maroon', 'burgundy', 'oxblood'],
    '#E6E6FA': ['lavender', 'purple', 'violet'],
  }

  const firstImageUrl = imageUrls[0]?.toLowerCase() || ''

  for (const [hex, keywords] of Object.entries(COLOR_PATTERNS)) {
    if (keywords.some((keyword) => firstImageUrl.includes(keyword))) {
      return hex
    }
  }

  return null
}

/**
 * Gets color with comprehensive fallback chain
 * Priority: backend code → image inference → keyword detection → default
 * @param {object} variant - Variant object with color and color_code
 * @param {string[]} imageUrls - Optional image URLs for inference
 * @returns {string} Valid color hex code
 */
export function getColorCodeWithFallback(variant, imageUrls = []) {
  if (!variant) {
    console.warn('[Color Fallback] No variant provided, using default')
    return '#d1d5db'
  }

  // Priority 1: Backend color code
  if (variant.color_code) {
    const validated = validateColorCode(variant.color, variant.color_code)
    if (validated) return validated
  }

  // Priority 2: Image inference
  const inferredHex = inferColorFromImages(imageUrls)
  if (inferredHex) {
    console.warn(`[Color Fallback] Inferred color from image for ${variant.color}: ${inferredHex}`)
    return inferredHex
  }

  // Priority 3: Keyword-based fallback (minimal set for common colors)
  const keywordMap = {
    'red': '#dc2626',
    'blue': '#2563eb',
    'green': '#16a34a',
    'black': '#1f2937',
    'white': '#f5f5f5',
    'navy': '#001f3f',
    'maroon': '#800000',
    'dark green': '#006400',
    'dark blue': '#00008B',
    'lavender': '#e6e6fa',
  }

  const colorNameLower = variant.color?.toLowerCase() || ''
  const fallbackHex = keywordMap[colorNameLower]
  if (fallbackHex) {
    console.warn(`[Color Fallback] Using keyword fallback for ${variant.color}: ${fallbackHex}`)
    return fallbackHex
  }

  // Priority 4: Default grey
  console.warn(`[Color Fallback] No color code found for ${variant.color}, using default grey`)
  return '#d1d5db'
}

/**
 * Logs color code statistics for monitoring
 * @param {object} stats - Statistics object to populate
 */
export const colorCodeStats = {
  validated: 0,
  fallbackUsed: 0,
  errors: 0,

  logValidated() {
    this.validated++
  },

  logFallback() {
    this.fallbackUsed++
  },

  logError() {
    this.errors++
  },

  getStats() {
    const total = this.validated + this.fallbackUsed
    return {
      validated: this.validated,
      fallbackUsed: this.fallbackUsed,
      errors: this.errors,
      fallbackRate: total > 0 ? ((this.fallbackUsed / total) * 100).toFixed(2) + '%' : '0%',
    }
  },

  reset() {
    this.validated = 0
    this.fallbackUsed = 0
    this.errors = 0
  },
}

/**
 * Check if a color appears to be light (for contrast purposes)
 * @param {string} hex - Hex color code
 * @returns {boolean} true if color is considered light
 */
export function isLightColor(hex) {
  if (!isValidHex(hex)) return false

  const rgb = parseInt(hex.slice(1), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff

  // Using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6
}
