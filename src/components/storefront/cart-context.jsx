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
  const [items, setItems] = useState(readInitialCart)

  const persist = (nextItems) => {
    setItems(nextItems)
    saveCart(nextItems)
  }

  const addToCart = (product, options) => {
    const color = options.color || null
    const size = options.size
    const variantId = options.variantId || null  // ✅ NEW
    const sku = options.sku || null              // ✅ NEW
    const quantity = Number(options.quantity || 1)

    setItems((current) => {
      const existingIndex = current.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color === color
      )

      const next = [...current]
      if (existingIndex >= 0) {
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        }
      } else {
        next.push({
          id: `${product.id}-${size}-${variantId || 'default'}-${Date.now()}`,
          productId: product.id,
          variantId: variantId,  // ✅ NEW: Store variant ID
          slug: product.slug,
          title: product.title,
          price: Number(product.price),
          imageUrl: options.imageUrl || getVariantImageForColor(product, color) || product.images?.[0] || product.image_url,
          size,
          color,
          sku: sku,              // ✅ NEW: Store SKU
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
