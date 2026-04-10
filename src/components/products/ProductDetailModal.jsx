import { useState } from 'react'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'

export function ProductDetailModal({ product, isOpen, onClose }) {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [colorError, setColorError] = useState(false)
  const { addToCart } = useCart()

  if (!isOpen || !product) return null

  const handleAddToCart = () => {
    let hasError = false
    if (!selectedSize) {
      setSizeError(true)
      hasError = true
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setColorError(true)
      hasError = true
    }

    if (hasError) return false

    // Pass the color to the cart if available
    const productWithColor = selectedColor ? { ...product, selectedColor } : product
    addToCart(productWithColor, selectedSize, quantity)
    
    onClose()
    setSelectedSize('')
    setSelectedColor('')
    setQuantity(1)
    setSizeError(false)
    setColorError(false)
    return true
  }

  const handleClose = () => {
    onClose()
    setSelectedSize('')
    setSelectedColor('')
    setQuantity(1)
    setSizeError(false)
    setColorError(false)
  }

  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    setSizeError(false)
  }

  const handleColorSelect = (color) => {
    setSelectedColor(color)
    setColorError(false)
  }

  const displayImages = product?.images && product.images.length > 0
    ? product.images
    : [product?.image_url].filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-brand-900/60 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal Content */}
        <div className="relative bg-white w-full min-h-screen sm:min-h-0 sm:max-w-5xl sm:mx-auto sm:my-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 text-brand-500 hover:text-brand-900 focus:outline-none p-2 bg-white/80 backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid sm:grid-cols-2">
            {/* Product Image Gallery */}
            <div className="relative bg-warm-100 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar h-[50vh] sm:h-full">
              {displayImages.map((imgUrl, i) => (
                <div key={i} className="flex-none w-full h-full snap-center relative">
                  <img
                    src={imgUrl}
                    alt={`${product.title} - Image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Dots Indicator */}
                  {displayImages.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {displayImages.map((_, dotIdx) => (
                        <div key={dotIdx} className={`w-2 h-2 rounded-full ${i === dotIdx ? 'bg-brand-900' : 'bg-white/50 border border-brand-900'}`} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Product Info */}
            <div className="p-6 sm:p-10 flex flex-col">
              <div className="flex-1">
                {/* Category */}
                <p className="text-xs text-brand-500 uppercase tracking-widest mb-2">
                  {product.category}
                </p>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-brand-900 mb-4">
                  {product.title}
                </h2>

                {/* Price */}
                <p className="text-2xl text-brand-900 mb-6">
                  ₹{parseFloat(product.price).toFixed(2)}
                </p>

                {/* Description */}
                {product.description && (
                  <p className="text-brand-600 leading-relaxed mb-8">
                    {product.description}
                  </p>
                )}

                {/* Size Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-brand-900">
                      Select Size
                    </label>
                    <button className="text-sm text-brand-500 underline hover:text-brand-700">
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`py-3 text-sm font-medium transition-all duration-200 ${
                          selectedSize === size
                            ? 'bg-brand-900 text-white'
                            : 'bg-white text-brand-900 border border-brand-200 hover:border-brand-900'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {sizeError && (
                    <p className="mt-2 text-sm text-red-600">Please select a size</p>
                  )}
                </div>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-brand-900 mb-3">
                      Select Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorSelect(color)}
                          className={`px-4 py-2 text-sm font-medium border rounded-md transition-all duration-200 ${
                            selectedColor === color
                              ? 'bg-brand-900 text-white border-brand-900'
                              : 'bg-white text-brand-900 border-brand-200 hover:border-brand-900'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                    {colorError && (
                      <p className="mt-2 text-sm text-red-600">Please select a color</p>
                    )}
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-brand-900 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center border border-brand-200 w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-brand-600 hover:text-brand-900 hover:bg-brand-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-brand-900 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-brand-600 hover:text-brand-900 hover:bg-brand-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand-900 border border-brand-900 text-white py-4 text-base font-medium hover:bg-brand-800 hover:border-brand-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    const success = handleAddToCart()
                    if (success) {
                      window.dispatchEvent(new CustomEvent('open-cart-checkout'))
                    }
                  }}
                  className="flex-1 bg-white border border-brand-900 text-brand-900 py-4 text-base font-bold hover:bg-brand-50 transition-colors flex items-center justify-center"
                >
                  Buy Now - ₹{(parseFloat(product.price) * quantity).toFixed(2)}
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-brand-100 space-y-3">
                <p className="text-sm text-brand-500 flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent-500 rounded-full" />
                  Free shipping on orders over ₹2000
                </p>
                <p className="text-sm text-brand-500 flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent-500 rounded-full" />
                  30-day easy returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
