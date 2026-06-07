/**
 * Product Variant - represents a specific color + size combination
 * One row in product_variants table = one inventory unit
 */
export interface ProductVariant {
  id: string
  product_id: string
  color_name: string          // e.g., "Maroon", "Navy", "Black"
  size_label: string          // e.g., "S", "M", "L", "XL", "One Size"
  sku: string                 // e.g., "FROCK-MAROON-S"
  inventory_qty: number       // Stock count for this specific variant
  price?: number              // Price override per variant (optional, falls back to base_price)
  created_at: string
  updated_at?: string
}

/**
 * Product Image for a specific color
 * Multiple images can exist for the same color (different angles/views)
 */
export interface ProductColorImage {
  id: string
  product_id: string
  color_name: string          // Links to ProductVariant.color_name
  image_url: string           // Supabase Storage URL
  display_order: number       // 1 = main/hero image, 2+ = gallery
  created_at: string
}

/**
 * Enhanced Product Type with variant and image relationships
 * Extends the basic product data with inventory and color-specific assets
 */
export interface ProductWithVariants {
  id: string
  title: string
  slug: string
  description?: string
  base_price: number
  compare_at_price?: number
  category: string
  material?: string
  fit_notes?: string
  care_instructions?: string
  image_url?: string          // Fallback primary image
  images: string[]            // Default images array
  colors: string[]            // Unique list of available colors
  sizes: string[]             // Unique list of available sizes
  is_active: boolean
  quantity?: number           // Overall product quantity (legacy)
  is_sold_out?: boolean       // Overall sold out status (legacy)
  tags?: string[]
  // NEW: Variant data relationships
  variants: ProductVariant[]
  colorImages: ProductColorImage[]
  created_at: string
  updated_at?: string
}

/**
 * Stock Check Result - response from real-time stock validation
 * Used to determine UI state (button disabled, out of stock badge, etc.)
 */
export interface StockCheckResult {
  isInStock: boolean
  quantity: number
  sku: string
  price?: number              // Variant-specific price if available
  product_id: string
  color_name: string
  size_label: string
}

/**
 * Color Swatch Display Data
 * Combines variant stock info with visual metadata
 */
export interface ColorSwatchData {
  name: string
  hex_value?: string
  is_available: boolean
  total_stock: number         // Sum of all sizes for this color
  variant_count: number       // Number of sizes available in this color
}

/**
 * Size Option Display Data
 * Tracks availability for a specific size across colors
 */
export interface SizeOptionData {
  label: string
  is_available: boolean
  total_stock: number         // Sum of all colors for this size
  variant_count: number       // Number of colors available in this size
}
