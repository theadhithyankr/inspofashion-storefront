'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { useCart } from './cart-context'

<<<<<<< HEAD
<<<<<<< HEAD
export function ProductPurchasePanel({ 
  product, 
  selectedColor, 
  onColorChange,
  selectedSize,
  onSizeChange,
  stockStatus,
  isCheckingStock = false,
}) {
  const availableSizes = useMemo(() => product.sizes?.filter(Boolean) || [], [product.sizes])
=======
export function ProductPurchasePanel({ product }) {
  const availableSizes = useMemo(() => product.sizes?.filter(Boolean) || [], [product.sizes])
  const [size, setSize] = useState(availableSizes[0] || 'One Size')
  const [color, setColor] = useState(product.colors?.[0] || '')
>>>>>>> parent of 51b12b0 (feat(storefront): refactor product detail layout with color-aware image gallery)
=======
export function ProductPurchasePanel({ product, selectedColor, onColorChange }) {
  const availableSizes = useMemo(() => product.sizes?.filter(Boolean) || [], [product.sizes])
  const [size, setSize] = useState(availableSizes[0] || 'One Size')
>>>>>>> parent of 72e6706 (docs(storefront): add implementation guide and project documentation)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const openCartAtCountRef = useRef(null)
  const { addToCart, totalItems } = useCart()

<<<<<<< HEAD
<<<<<<< HEAD
  // Use selected color and size from props
=======
  // Use selectedColor from props, fallback to first color
>>>>>>> parent of 72e6706 (docs(storefront): add implementation guide and project documentation)
  const color = selectedColor || product.colors?.[0] || ''

  // Handle color change - call parent callback
  const handleColorChange = (newColor) => {
    if (onColorChange) {
      onColorChange(newColor)
    }
  }

<<<<<<< HEAD
  // Handle size change
  const handleSizeChange = (newSize) => {
    setError('')
    if (onSizeChange) {
      onSizeChange(newSize)
    }
  }

=======
>>>>>>> parent of 51b12b0 (feat(storefront): refactor product detail layout with color-aware image gallery)
=======
>>>>>>> parent of 72e6706 (docs(storefront): add implementation guide and project documentation)
  useEffect(() => {
    if (!openCartAtCountRef.current || totalItems < openCartAtCountRef.current) return
    window.dispatchEvent(new CustomEvent('storefront:open-cart'))
    openCartAtCountRef.current = null
  }, [totalItems])

  const add = () => {
    if (product.is_sold_out) {
      setError('This product is sold out.')
      return false
    }

    if (!size) {
      setError('Choose a size before adding this piece.')
      return false
    }

    setError('')
    addToCart(product, { size, color, quantity })
    setAdded(true)
    openCartAtCountRef.current = totalItems + quantity
    window.setTimeout(() => setAdded(false), 1800)
    return true
  }

  return (
    <div className="lg:sticky lg:top-28">
      {product.is_sold_out && (
        <div className="mb-6 border border-orange-300 bg-orange-50 px-4 py-3">
          <p className="text-sm font-semibold text-orange-900">This product is currently sold out.</p>
        </div>
      )}
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">{product.category}</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-brand-900 sm:text-5xl">{product.title}</h1>
      <div className="mt-4 flex items-baseline gap-3">
        <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
        {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
          <p className="text-lg text-brand-400 line-through">{formatPrice(product.compare_at_price)}</p>
        )}
      </div>
      {product.description && <p className="mt-6 leading-7 text-brand-600">{product.description}</p>}

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-[0.16em]">Size</span>
          <a href="/size-guide" className="text-sm text-brand-500 underline">Size guide</a>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {availableSizes.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSize(option)
                setError('')
              }}
              className={`border px-3 py-3 text-sm font-semibold ${size === option ? 'border-brand-900 bg-brand-900 text-white' : 'border-brand-200 bg-white text-brand-900 hover:border-brand-900'}`}
            >
              {option}
            </button>
          ))}
        </div>
        {error && (
          <p className="mt-3 border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
      {/* Stock Status Display */}
      {stockStatus.isInStock && !isCheckingStock && stockStatus.quantity > 0 && size && (
        <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
          <div className="h-2 w-2 rounded-full bg-green-600" />
          <span>{stockStatus.quantity} in stock</span>
          {stockStatus.sku && <span className="text-gray-500">({stockStatus.sku})</span>}
=======
      {product.colors?.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-[0.16em]">Colour</span>
            {color && <span className="text-sm font-semibold text-brand-600">{color}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((option) => (
              <button
                key={option}
                onClick={() => setColor(option)}
                disabled={product.is_sold_out}
                className={`border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${color === option ? 'border-brand-900 bg-brand-900 text-white' : 'border-brand-200 bg-white text-brand-900 hover:border-brand-900'}`}
              >
                {option}
              </button>
            ))}
          </div>
>>>>>>> parent of 51b12b0 (feat(storefront): refactor product detail layout with color-aware image gallery)
        </div>
      )}

=======
>>>>>>> parent of 72e6706 (docs(storefront): add implementation guide and project documentation)
      <div className="mt-6">
        <span className="mb-3 block text-sm font-bold uppercase tracking-[0.16em]">Quantity</span>
        <div className="flex w-fit items-center border border-brand-200">
          <button 
            className="p-3 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50" 
            onClick={() => setQuantity(Math.max(1, quantity - 1))} 
            aria-label="Decrease quantity"
            disabled={product.is_sold_out}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button 
            className="p-3 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50" 
            onClick={() => setQuantity(quantity + 1)} 
            aria-label="Increase quantity"
            disabled={product.is_sold_out}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-200 bg-white/95 p-3 shadow-[0_-12px_40px_rgba(28,25,23,0.08)] backdrop-blur lg:static lg:mt-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        {product.is_sold_out ? (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 px-6 py-4 font-bold uppercase tracking-[0.16em] text-white bg-brand-300 cursor-not-allowed"
          >
            Sold Out
          </button>
        ) : (
          <button
            onClick={add}
            className={`flex w-full items-center justify-center gap-2 px-6 py-4 font-bold uppercase tracking-[0.16em] text-white transition duration-300 ${added ? 'bg-[#102820]' : 'bg-brand-900 hover:bg-brand-800'}`}
            aria-live="polite"
          >
            <ShoppingBag className="h-5 w-5" />
            {added ? 'Added to bag' : `Add to bag - ${formatPrice(Number(product.price) * quantity)}`}
          </button>
        )}
        {added && <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#102820]">Opening your bag...</p>}
      </div>

      <div className="mt-8 divide-y divide-brand-100 border-y border-brand-100 text-sm">
        <InfoRow label="Material" value={product.material || 'Premium fabric selected for comfort and everyday wear.'} />
        <InfoRow label="Fit notes" value={product.fit_notes || 'Designed for an easy regular fit. Choose your usual size.'} />
        <InfoRow label="Care" value={product.care_instructions || 'Gentle wash recommended. Dry in shade to preserve colour.'} />
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="py-4">
      <p className="font-bold uppercase tracking-[0.16em] text-brand-500">{label}</p>
      <p className="mt-2 leading-6 text-brand-700">{value}</p>
    </div>
  )
}

function getColorHex(colorName) {
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
