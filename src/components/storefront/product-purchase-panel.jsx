'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { formatPrice, getColorHex } from '@/lib/format'
import { useCart } from './cart-context'

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
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const openCartAtCountRef = useRef(null)
  const { addToCart, totalItems } = useCart()

  // Use selected color and size from props
  const color = selectedColor || product.colors?.[0] || ''
  const size = selectedSize || availableSizes[0] || 'One Size'

  // Handle color change from purchase panel
  const handleColorChange = (newColor) => {
    if (onColorChange) {
      onColorChange(newColor)
    }
  }

  // Handle size change
  const handleSizeChange = (newSize) => {
    setError('')
    if (onSizeChange) {
      onSizeChange(newSize)
    }
  }

  useEffect(() => {
    if (!openCartAtCountRef.current || totalItems < openCartAtCountRef.current) return
    window.dispatchEvent(new CustomEvent('storefront:open-cart'))
    openCartAtCountRef.current = null
  }, [totalItems])

  const add = () => {
    // Check if product is sold out (overall)
    if (product.is_sold_out) {
      setError('This product is sold out.')
      return false
    }

    // Check if variant is out of stock (color + size combo)
    if (!stockStatus.isInStock) {
      setError(`Sorry, ${color} in size ${size} is out of stock.`)
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

  // Determine if add-to-cart button should be disabled
  const isAddDisabled = product.is_sold_out || !stockStatus.isInStock || isCheckingStock || !size

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

      {/* Color Variant Switcher - Mobile */}
      {product.colors && product.colors.length > 1 && (
        <div className="lg:hidden mt-6 p-3 border border-brand-200 rounded-sm bg-brand-50">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500 mb-2">Colors</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {product.colors.map((colorOption) => (
              <ColorSwatch
                key={colorOption}
                color={colorOption}
                isSelected={color === colorOption}
                isOutOfStock={product.color_stock?.[colorOption] === 0}
                onClick={() => handleColorChange(colorOption)}
                size="small"
              />
            ))}
          </div>
          {color && (
            <p className="text-xs font-semibold text-brand-900">Selected: <span className="text-brand-700">{color}</span></p>
          )}
        </div>
      )}

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-[0.16em]">Size</span>
          <a href="/size-guide" className="text-sm text-brand-500 underline">Size guide</a>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {availableSizes.map((option) => (
            <button
              key={option}
              onClick={() => handleSizeChange(option)}
              disabled={isCheckingStock}
              className={`border px-3 py-3 text-sm font-semibold transition-all ${
                size === option 
                  ? 'border-black bg-black text-white' 
                  : 'border-brand-200 bg-white text-brand-900 hover:border-black'
              } ${isCheckingStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={`${option}${size === option && stockStatus.quantity ? ` - ${stockStatus.quantity} in stock` : ''}`}
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

      {/* Stock Status Display */}
      {stockStatus.isInStock && !isCheckingStock && stockStatus.quantity > 0 && size && (
        <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
          <div className="h-2 w-2 rounded-full bg-green-600" />
          <span>{stockStatus.quantity} in stock</span>
          {stockStatus.sku && <span className="text-gray-500">({stockStatus.sku})</span>}
        </div>
      )}

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
        {product.is_sold_out || !stockStatus.isInStock ? (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 px-6 py-4 font-bold uppercase tracking-[0.16em] text-white bg-gray-400 cursor-not-allowed"
          >
            {product.is_sold_out ? 'Sold Out' : 'Out of Stock'}
          </button>
        ) : (
          <button
            onClick={add}
            disabled={isAddDisabled}
            className={`flex w-full items-center justify-center gap-2 px-6 py-4 font-bold uppercase tracking-[0.16em] text-white transition duration-300 ${
              isAddDisabled
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : added 
                ? 'bg-[#102820]' 
                : 'bg-black hover:bg-gray-900'
            }`}
            aria-live="polite"
            title={isCheckingStock ? 'Checking stock...' : isAddDisabled ? 'Please select a size' : 'Add to bag'}
          >
            <ShoppingBag className="h-5 w-5" />
            {isCheckingStock 
              ? 'Checking stock...' 
              : added 
              ? 'Added to bag' 
              : `Add to bag - ${formatPrice(Number(product.price) * quantity)}`
            }
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

function ColorSwatch({ color, isSelected, isOutOfStock, onClick, size = 'large' }) {
  const colorHex = getColorHex(color)
  const isMobile = size === 'small'

  return (
    <button
      onClick={onClick}
      disabled={isOutOfStock}
      className="group relative flex flex-col items-center gap-1.5 transition disabled:cursor-not-allowed"
      title={isOutOfStock ? `${color} - Out of stock` : color}
    >
      {/* Swatch Circle */}
      <div className={`relative transition-all ${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`}>
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all ${
            isOutOfStock
              ? 'border-gray-300 opacity-40'
              : isSelected
              ? 'border-brand-900 ring-2 ring-brand-900/20'
              : 'border-brand-200 hover:border-brand-900'
          }`}
          style={{
            backgroundColor: isOutOfStock ? '#f3f4f6' : colorHex,
          }}
        />

        {/* Selected Indicator */}
        {isSelected && !isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
        )}

        {/* Out of Stock Strikethrough */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-0.5 w-2/3 bg-gray-400 rotate-45" />
          </div>
        )}
      </div>

      {/* Color Label */}
      <span className={`font-medium transition ${
        isMobile 
          ? 'text-[10px]' 
          : 'text-xs'
      } ${
        isOutOfStock
          ? 'text-gray-400'
          : isSelected
          ? 'text-brand-900'
          : 'text-brand-700 group-hover:text-brand-900'
      }`}>
        {color}
      </span>
    </button>
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
