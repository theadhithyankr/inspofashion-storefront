'use client'

import { createContext, useContext, useState } from 'react'
import { getVariantImageForColor } from '@/lib/format'

const CartContext = createContext(null)

function readInitialCart() {
  if (typeof window === 'undefined') return []

  try {
    const saved = window.localStorage.getItem('inspofashions_cart')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    window.localStorage.setItem('inspofashions_cart', JSON.stringify(items))
  } catch {
    // Cart should still work in memory if a mobile browser blocks localStorage.
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readInitialCart())

  const persist = (nextItems) => {
    setItems(nextItems)
    saveCart(nextItems)
  }

  const addToCart = (product, options) => {
    const color = options.color || null
    const size = options.size
    const variantId = options.variantId || null
    const sku = options.sku || null
    const quantity = Number(options.quantity || 1)
    // Use the caller-supplied price (effectivePrice) when present; fall back to product price
    const price = options.price != null ? Number(options.price) : Number(product.price)
    // Use the caller-supplied image when present; fall back to variant inference then product images
    const imageUrl = options.image || getVariantImageForColor(product, color) || product.images?.[0] || product.image_url || null
    // Stock cap — null means no cap (non-variant product)
    const stock = options.stock != null ? Number(options.stock) : null

    setItems((current) => {
      // Two items are the same line when they share productId + size + variant.
      // When a variantId is present on both sides use it as the identity key
      // (two different colours of the same product have different variantIds).
      // Fall back to color matching for products without variants.
      const sameVariant = (item) => {
        if (item.productId !== product.id || item.size !== size) return false
        if (variantId && item.variantId) return item.variantId === variantId
        return item.color === color
      }
      const existingIndex = current.findIndex(sameVariant)

      const next = [...current]
      if (existingIndex >= 0) {
        const existing = next[existingIndex]
        const merged = existing.quantity + quantity
        // Never exceed the variant's stock cap
        const capped = stock != null ? Math.min(merged, stock) : merged
        // Update price and image to the latest values (in case variant or product changed)
        next[existingIndex] = { ...existing, quantity: capped, price, imageUrl }
      } else {
        next.push({
          id: `${product.id}-${size}-${variantId || 'default'}-${Date.now()}`,
          productId: product.id,
          variantId,
          slug: product.slug,
          title: product.title,
          price,
          imageUrl,
          size,
          color,
          sku,
          stock,    // stored so the cart drawer can enforce the same cap
          quantity,
        })
      }

      saveCart(next)
      return next
    })
  }

  const updateQuantity = (itemId, quantity) => {
    const next = quantity <= 0
      ? items.filter((item) => item.id !== itemId)
      : items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    persist(next)
  }

  const removeFromCart = (itemId) => {
    persist(items.filter((item) => item.id !== itemId))
  }

  const clearCart = () => persist([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const value = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
