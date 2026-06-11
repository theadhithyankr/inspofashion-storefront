import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import { getCollectionSlug, getProductImages, getProductSlug, getProductVariantColors, slugify, extractColorsFromImages, extractColorsFromTags, createVariantMap } from './format'

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
  const variantMap = createVariantMap(product.variants)

  return {
    ...product,
    slug: product.slug || slugify(product.title),
    price: Number.parseFloat(product.price || 0),
    images,
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: colors.map((color) => color?.toString().trim()).filter(Boolean),
    tags: Array.isArray(product.tags) ? product.tags : [],
    quantity: Number(product.quantity || 0),
    is_sold_out: Number(product.quantity || 0) === 0,
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
