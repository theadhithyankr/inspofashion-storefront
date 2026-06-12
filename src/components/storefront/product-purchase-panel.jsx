'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { useCart } from './cart-context'

function normalizeColorForCompare(value = '') {
  return value?.toString().trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export function ProductPurchasePanel({ product, selectedColor }) {
  const availableSizes = useMemo(() => product.sizes?.filter(Boolean) || [], [product.sizes])
  const [size, setSize] = useState(availableSizes[0] || 'One Size')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const openCartAtCountRef = useRef(null)
  const { addToCart, totalItems } = useCart()

  // Use selectedColor from props, fallback to first color
  const color = selectedColor || product.colors?.[0] || ''

  // ✅ NEW: Get variant metadata
  const variantMap = useMemo(() => product.variantMap || {}, [product.variantMap])
  const variant = useMemo(() => {
    if (!color) return null
    const normalized = normalizeColorForCompare(color)
    return variantMap[normalized] || null
  }, [color, variantMap])

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

    // ✅ NEW: Validate variant exists
    if (!variant) {
      setError(`Color variant not available: ${color}`)
      return false
    }

    // ✅ NEW: Check stock per variant
    if (variant.stock <= 0) {
      setError(`${color} is currently out of stock.`)
      return false
    }

    if (!size) {
      setError('Choose a size before adding this piece.')
      return false
    }

    setError('')
    addToCart(product, {
      size,
      color,
      variantId: variant.id,    // ✅ NEW: Pass variant ID
      sku: variant.sku,          // ✅ NEW: Pass SKU
      quantity,
    })
    setAdded(true)
    openCartAtCountRef.current = totalItems + quantity
    window.setTimeout(() => setAdded(false), 1800)
    return true
  }

  return (
    <div className="lg:sticky lg:top-28">
      {product.is_sold_out && (
        <div className="mb-4 border border-orange-300 bg-orange-50 px-3 py-2">
          <p className="text-xs sm:text-sm font-semibold text-orange-900">This product is currently sold out.</p>
        </div>
      )}
      {variant?.stock === 0 && !product.is_sold_out && (
        <div className="mb-4 border border-orange-300 bg-orange-50 px-3 py-2">
          <p className="text-xs sm:text-sm font-semibold text-orange-900">{color} is currently out of stock, but other colours are available.</p>
        </div>
      )}
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/60">{product.category}</p>
      <h1 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl leading-tight text-black lg:mt-3">{product.title}</h1>
      <div className="mt-2 sm:mt-3 flex items-baseline gap-3">
        <p className="text-lg sm:text-xl font-semibold text-black">{formatPrice(product.price)}</p>
        {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
          <p className="text-sm sm:text-base text-black/40 line-through">{formatPrice(product.compare_at_price)}</p>
        )}
      </div>
      {product.description && <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-6 text-black/70">{product.description}</p>}

      <div className="mt-5 sm:mt-6">
        {color && (
          <div className="mb-4 rounded-lg border border-black/10 bg-black/2 px-3 py-2.5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/60">Selected colour</p>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-black">{color}</p>
            {variant?.sku && (
              <p className="mt-1.5 text-xs text-black/60">SKU: {variant.sku}</p>
            )}
            {variant && (
              <p className={`mt-1 text-xs font-medium ${variant.stock > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
              </p>
            )}
          </div>
        )}
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/60">Size</span>
          <a href="/size-guide" className="text-xs text-black/70 underline hover:text-black">Size guide</a>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2">
          {availableSizes.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSize(option)
                setError('')
              }}
              className={`border px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold transition ${size === option ? 'border-black bg-black text-white' : 'border-black/15 bg-white text-black hover:border-black'}`}
            >
              {option}
            </button>
          ))}
        </div>
        {error && (
          <p className="mt-2.5 border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700">
            {error}
          </p>
        )}
      </div>
      <div className="mt-4 sm:mt-5">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-black/60">Quantity</span>
        <div className="flex w-fit items-center border border-black/15">
          <button 
            className="px-2 sm:px-3 py-1.5 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50" 
            onClick={() => setQuantity(Math.max(1, quantity - 1))} 
            aria-label="Decrease quantity"
            disabled={product.is_sold_out}
          >
            <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold">{quantity}</span>
          <button 
            className="px-2 sm:px-3 py-1.5 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50" 
            onClick={() => setQuantity(quantity + 1)} 
            aria-label="Increase quantity"
            disabled={product.is_sold_out}
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-white/95 px-4 py-2.5 shadow-[0_-12px_40px_rgba(0,0,0,0.08)] backdrop-blur sm:px-6 sm:py-3 lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none">
        {product.is_sold_out || !variant || variant.stock === 0 ? (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 font-bold text-xs sm:text-sm uppercase tracking-[0.16em] text-white bg-black/30 cursor-not-allowed"
          >
            {!variant ? 'Color Not Available' : 'Out of Stock'}
          </button>
        ) : (
          <button
            onClick={add}
            className={`flex w-full items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 font-bold text-xs sm:text-sm uppercase tracking-[0.16em] text-white transition duration-300 ${added ? 'bg-green-700' : 'bg-black hover:bg-black/90'}`}
            aria-live="polite"
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            {added ? 'Added to bag' : `Add to bag - ${formatPrice(Number(product.price) * quantity)}`}
          </button>
        )}
        {added && <p className="mt-1.5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-green-700">Opening your bag...</p>}
      </div>

      <div className="mt-6 sm:mt-8 divide-y divide-black/10 border-y border-black/10 text-xs sm:text-sm">
        <InfoRow label="Material" value={product.material || 'Premium fabric selected for comfort and everyday wear.'} />
        <InfoRow label="Fit notes" value={product.fit_notes || 'Designed for an easy regular fit. Choose your usual size.'} />
        <InfoRow label="Care" value={product.care_instructions || 'Gentle wash recommended. Dry in shade to preserve colour.'} />
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="py-3 sm:py-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/60">{label}</p>
      <p className="mt-1.5 leading-5 sm:leading-6 text-black/70 text-xs sm:text-sm">{value}</p>
    </div>
  )
}
