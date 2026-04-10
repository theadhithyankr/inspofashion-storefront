import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CartContext = createContext({})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('cart', [])

  const addToCart = (product, size, quantity = 1) => {
    setItems((currentItems) => {
      const color = product.selectedColor || null
      const existingItemIndex = currentItems.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color === color
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      }

      const newItem = {
        id: `${product.id}-${size}-${color}-${Date.now()}`,
        productId: product.id,
        title: product.title,
        price: parseFloat(product.price),
        size,
        color,
        quantity,
        imageUrl: product.image_url,
      }

      return [...currentItems, newItem]
    })
  }

  const removeFromCart = (itemId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
