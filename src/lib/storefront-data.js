import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import { getCollectionSlug, getProductImages, getProductSlug, getProductVariantColors, slugify, extractColorsFromImages, extractColorsFromTags, createVariantMap } from './format'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance = null

function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables for storefront.')
  }

  // Reuse single Supabase instance to prevent connection pooling issues
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'X-Client-Info': 'storefront@1.0.0',
        },
      },
    })
  }

  return supabaseInstance
}

function normalizeProduct(product) {
  const images = getProductImages(product)
  
  // Try to auto-detect colors from explicit variants, image filename mappings, image names, or tags.
  let colors = Array.isArray(product.colors) ? product.colors : []

  if (colors.length === 0) {
    colors = getProductVariantColors(product)
  }

  if (colors.length === 0) {
    colors = extractColorsFromImages(images)
  }

  if (colors.length === 0 && Array.isArray(product.tags)) {
    colors = extractColorsFromTags(product.tags)
  }

  // ✅ NEW: Create variant map for efficient color lookups
  // product_variants is the joined key returned by Supabase; fall back to product.variants for any local/mock data
  const variants = product.product_variants || product.variants || []
  const variantMap = createVariantMap(variants)

  // For variant products, sold-out only when ALL variants have stock <= 0.
  // For non-variant products, use the product-level quantity.
  const hasVariants = variants.length > 0
  const isSoldOut = hasVariants
    ? variants.every((v) => !v || v.stock_quantity <= 0)  // all variants are out of stock
    : Number(product.quantity || 0) === 0  // no variants; use product quantity

  return {
    ...product,
    slug: product.slug || slugify(product.title),
    price: Number.parseFloat(product.price || 0),
    images,
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: colors.map((color) => color?.toString().trim()).filter(Boolean),
    tags: Array.isArray(product.tags) ? product.tags : [],
    quantity: Number(product.quantity || 0),
    is_sold_out: isSoldOut,
    variants,    // normalised variants array (product_variants or product.variants)
    variantMap, // ✅ NEW: Add variant metadata map
  }
}

function normalizeCollection(collection) {
  return {
    ...collection,
    slug: getCollectionSlug(collection),
  }
}

export const getProducts = cache(async () => {
  try {
    const { data, error } = await getSupabase()
      .from('products')
      .select('*, product_variants(*)', { count: 'estimated' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      throw error
    }

    // Filter variants to only active ones, then deduplicate products
    const seenIds = new Set()
    const deduped = (data || [])
      .filter((product) => {
        if (seenIds.has(product.id)) return false
        seenIds.add(product.id)
        return true
      })
      .map((product) => ({
        ...product,
        product_variants: (product.product_variants || []).filter((v) => v && v.is_active !== false),
      }))

    return deduped.map(normalizeProduct)
  } catch (err) {
    console.error('Failed to fetch products:', err)
    return []
  }
})

export const getCollections = cache(async () => {
  try {
    const { data, error } = await getSupabase()
      .from('collections')
      .select('*', { count: 'estimated' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching collections:', error)
      throw error
    }
    return (data || []).map(normalizeCollection)
  } catch (err) {
    console.error('Failed to fetch collections:', err)
    return []
  }
})

export const getSetting = cache(async (key) => {
  try {
    const { data, error } = await getSupabase()
      .from('store_settings')
      .select('value', { count: 'estimated' })
      .eq('key', key)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching setting:', error)
      throw error
    }
    return data?.value || null
  } catch (err) {
    console.error('Failed to fetch setting:', err)
    return null
  }
})

export const getStorefrontData = cache(async () => {
  try {
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
  } catch (err) {
    console.error('Failed to fetch storefront data:', err)
    return { products: [], collections: [], hero: null, menu: null, footer: null, valueProps: null, general: null }
  }
})

export async function getProductBySlug(slug) {
  const products = await getProducts()
  return products.find((product) => getProductSlug(product) === slug) || null
}

export async function getCollectionBySlug(slug) {
  const collections = await getCollections()
  return collections.find((collection) => collection.slug === slug) || null
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
