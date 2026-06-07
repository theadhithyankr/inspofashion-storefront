import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import { getCollectionSlug, getProductImages, getProductSlug, slugify, extractColorsFromImages, extractColorsFromTags } from './format'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables for storefront.')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

function normalizeProduct(product) {
  const images = getProductImages(product)
  
  // Try to auto-detect colors from various sources
  let colors = Array.isArray(product.colors) ? product.colors : []
  
  // If no colors in database, try to detect from images or tags
  if (colors.length === 0) {
    colors = extractColorsFromImages(images)
  }
  
  if (colors.length === 0 && Array.isArray(product.tags)) {
    colors = extractColorsFromTags(product.tags)
  }

  return {
    ...product,
    slug: product.slug || slugify(product.title),
    price: Number.parseFloat(product.price || 0),
    images,
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: colors.filter(Boolean),
    tags: Array.isArray(product.tags) ? product.tags : [],
    quantity: Number(product.quantity || 0),
    is_sold_out: Number(product.quantity || 0) === 0,
  }
}

function normalizeCollection(collection) {
  return {
    ...collection,
    slug: getCollectionSlug(collection),
  }
}

export const getProducts = cache(async () => {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(normalizeProduct)
})

export const getCollections = cache(async () => {
  const { data, error } = await getSupabase()
    .from('collections')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(normalizeCollection)
})

export const getSetting = cache(async (key) => {
  const { data, error } = await getSupabase()
    .from('store_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data?.value || null
})

export const getStorefrontData = cache(async () => {
  const [products, collections, hero, menu, footer, valueProps, general] = await Promise.all([
    getProducts(),
    getCollections(),
    getSetting('hero_section'),
    getSetting('menu_bar'),
    getSetting('footer_settings'),
    getSetting('value_props'),
    getSetting('general_settings'),
  ])

  return { products, collections, hero, menu, footer, valueProps, general }
})

export async function getProductBySlug(slug) {
  const products = await getProducts()
  return products.find((product) => getProductSlug(product) === slug) || null
}

export async function getCollectionBySlug(slug) {
  const collections = await getCollections()
  return collections.find((collection) => getCollectionSlug(collection) === slug) || null
}

export async function getProductsForCollection(slug) {
  const [products, collection] = await Promise.all([getProducts(), getCollectionBySlug(slug)])
  const label = collection?.name || slug
  return products.filter((product) => slugify(product.category) === slugify(label))
}

export function searchProducts(products, query) {
  const term = query?.trim().toLowerCase()
  if (!term) return []

  return products.filter((product) => {
    const haystack = [
      product.title,
      product.description,
      product.category,
      product.material,
      ...(product.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(term)
  })
}

/**
 * Enhanced: Fetch product with variants and color-specific images
 * Joins product_variants and product_images tables for rich variant data
 */
export async function getProductBySlugWithVariants(slug) {
  const supabase = getSupabase()
  const products = await getProducts()
  const baseProduct = products.find((p) => getProductSlug(p) === slug)
  
  if (!baseProduct) return null

  // Fetch all variants for this product (parallel)
  const [variantsResponse, imagesResponse] = await Promise.all([
    supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', baseProduct.id),
    supabase
      .from('product_images')
      .select('*')
      .eq('product_id', baseProduct.id)
      .order('color_name', { ascending: true })
      .order('display_order', { ascending: true }),
  ])

  const variants = variantsResponse.data || []
  const colorImages = imagesResponse.data || []

  return {
    ...baseProduct,
    variants,
    colorImages,
  }
}

/**
 * Real-time stock check for a specific color + size combination
 * Returns inventory quantity, SKU, and any price override
 */
export async function checkVariantStock(productId, colorName, sizeLabel) {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('product_variants')
    .select('id, inventory_qty, sku, price, product_id, color_name, size_label')
    .eq('product_id', productId)
    .eq('color_name', colorName)
    .eq('size_label', sizeLabel)
    .single()

  if (error || !data) {
    return {
      isInStock: false,
      quantity: 0,
      sku: '',
      product_id: productId,
      color_name: colorName,
      size_label: sizeLabel,
    }
  }

  return {
    isInStock: data.inventory_qty > 0,
    quantity: data.inventory_qty,
    sku: data.sku,
    price: data.price,
    product_id: productId,
    color_name: colorName,
    size_label: sizeLabel,
  }
}

/**
 * Get all available colors for a product with their stock status
 * Useful for greying out out-of-stock colors
 */
export async function getColorAvailability(productId) {
  const supabase = getSupabase()

  const { data } = await supabase
    .from('product_variants')
    .select('color_name, inventory_qty')
    .eq('product_id', productId)
    .gt('inventory_qty', 0)

  const availableColors = new Set(data?.map((v) => v.color_name) || [])
  return availableColors
}

/**
 * Get all available sizes for a product with their stock status
 * Useful for greying out out-of-stock sizes
 */
export async function getSizeAvailability(productId, colorName) {
  const supabase = getSupabase()

  const { data } = await supabase
    .from('product_variants')
    .select('size_label, inventory_qty')
    .eq('product_id', productId)
    .eq('color_name', colorName)
    .gt('inventory_qty', 0)

  const availableSizes = new Set(data?.map((v) => v.size_label) || [])
  return availableSizes
}
