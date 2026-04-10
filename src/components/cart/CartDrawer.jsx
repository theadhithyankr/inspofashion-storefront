import { useState, useEffect } from 'react'
import { X, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { CartItem } from './CartItem'
import { redirectToWhatsApp } from '../../utils/whatsapp'
import { useStoreSettings } from '../../hooks/useStoreSettings'

export function CartDrawer({ isOpen, onClose }) {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const { settings: generalSettings } = useStoreSettings('general_settings')
  
  const [isCheckout, setIsCheckout] = useState(false)
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  // Listen for the custom event to switch to checkout tab when "Buy Now" is clicked
  useEffect(() => {
    const handleOpenCheckout = () => {
      setIsCheckout(true)
    }
    
    window.addEventListener('open-cart-checkout', handleOpenCheckout)
    return () => window.removeEventListener('open-cart-checkout', handleOpenCheckout)
  }, [])
  
  // Use the admin configured number, fallback to env variable, then default
  const phoneNumber = generalSettings?.whatsapp_number || import.meta.env.VITE_WHATSAPP_PHONE || '919876543210'

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    redirectToWhatsApp(items, totalPrice, phoneNumber, customerData)
    setIsCheckout(false)
    onClose()
  }

  const handleClose = () => {
    setIsCheckout(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-900/60 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-100">
          <div className="flex items-center gap-3">
            {isCheckout && (
              <button
                onClick={() => setIsCheckout(false)}
                className="text-brand-500 hover:text-brand-900 focus:outline-none transition-colors"
                aria-label="Back to cart"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-brand-900">
              {isCheckout ? 'Checkout Details' : `Cart (${totalItems})`}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-brand-400 hover:text-brand-600 focus:outline-none p-1 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isCheckout ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-brand-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-900 focus:border-brand-900 text-sm"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-brand-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-900 focus:border-brand-900 text-sm"
                    placeholder="e.g. 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-1">Delivery Address</label>
                  <textarea
                    required
                    value={customerData.address}
                    onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-brand-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-900 focus:border-brand-900 text-sm"
                    placeholder="House/Flat No, Street, Landmark"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={customerData.city}
                      onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-900 focus:border-brand-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={customerData.state}
                      onChange={(e) => setCustomerData({ ...customerData, state: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-900 focus:border-brand-900 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={customerData.pincode}
                    onChange={(e) => setCustomerData({ ...customerData, pincode: e.target.value })}
                    className="w-full px-3 py-2 border border-brand-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-900 focus:border-brand-900 text-sm"
                  />
                </div>
              </form>
            </div>
            
            <div className="border-t border-brand-100 px-6 py-6 bg-warm-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-brand-900">Amount to Pay</span>
                <span className="text-lg font-semibold text-brand-900">₹{totalPrice.toFixed(0)}</span>
              </div>
              <button
                type="submit"
                form="checkout-form"
                className="w-full bg-[#25D366] text-white py-4 text-base font-medium hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 rounded-lg"
              >
                Send Order on WhatsApp
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-brand-200 mb-4" />
                  <p className="text-brand-600 text-lg font-medium mb-2">Your cart is empty</p>
                  <p className="text-brand-400 text-sm">Add some products to get started</p>
                </div>
              ) : (
                <div>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-100 px-6 py-6 space-y-4 bg-warm-50">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-600">Subtotal</span>
                  <span className="text-lg font-semibold text-brand-900">₹{totalPrice.toFixed(2)}</span>
                </div>

                {/* Shipping Note */}
                <p className="text-xs text-brand-500 text-center py-2">
                  {totalPrice >= 2000 ? (
                    <span className="text-accent-700 font-medium">Free shipping included!</span>
                  ) : (
                    <>Add ₹{(2000 - totalPrice).toFixed(2)} more for free shipping</>
                  )}
                </p>

                {/* Checkout Button */}
                <button
                  onClick={() => setIsCheckout(true)}
                  className="w-full bg-brand-900 text-white py-4 text-base font-medium hover:bg-brand-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                {/* Clear Cart */}
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      clearCart()
                    }
                  }}
                  className="w-full text-sm text-brand-500 hover:text-brand-700 transition-colors py-2"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
