'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { formatCartMessage, generateWhatsAppUrl, validateCheckout } from '@/lib/whatsapp'
import { useCart } from './cart-context'

const initialCustomer = {
  name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
}

export function CartDrawer({ isOpen, onClose, whatsappNumber }) {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const [checkout, setCheckout] = useState(false)
  const [customer, setCustomer] = useState(initialCustomer)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen)
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen, onClose])

  const submit = (event) => {
    event.preventDefault()
    
    // Validate stock before checkout
    const stockErrors = {}
    items.forEach((item) => {
      if (item.stock != null && item.quantity > item.stock) {
        stockErrors[`stock-${item.id}`] = `Only ${item.stock} in stock for ${item.title}${item.color ? ` (${item.color})` : ''}.`
      }
    })
    
    if (Object.keys(stockErrors).length > 0) {
      setErrors(stockErrors)
      return
    }
    
    const nextErrors = validateCheckout(customer)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const message = formatCartMessage(items, totalPrice, customer)
    const url = generateWhatsAppUrl(whatsappNumber || '919876543210', message)
    window.open(url, '_blank', 'noopener,noreferrer')
    setCheckout(false)
    clearCart()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close cart"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl animate-[slideInCart_260ms_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-light px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">{checkout ? 'Details' : 'Shopping Bag'}</p>
            <h2 className="text-lg font-display font-normal text-text-primary mt-1">{checkout ? 'Send order on WhatsApp' : `${totalItems} item${totalItems === 1 ? '' : 's'}`}</h2>
          </div>
          <button className="rounded-lg border border-border-light p-2 hover:bg-cream-100 transition-colors" onClick={onClose} aria-label="Close cart">
            <X className="h-5 w-5 text-text-primary" />
          </button>
        </div>

        {!checkout ? (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <ShoppingBag className="mb-4 h-12 w-12 text-text-muted" />
                  <p className="text-lg font-display font-normal text-text-primary">Your bag is empty</p>
                  <p className="mt-2 text-sm text-text-secondary">Add a piece and checkout directly through WhatsApp.</p>
                </div>
              ) : (
                <div className="space-y-6 py-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b border-border-light last:border-b-0">
                      <div className="relative h-28 w-20 flex-none overflow-hidden bg-cream-100 rounded-lg">
                        {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill sizes="80px" className="object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${item.slug}`} onClick={onClose} className="text-sm font-medium text-text-primary hover:text-rose-400 transition-colors">
                          {item.title}
                        </Link>
                        <p className="mt-1.5 text-xs text-text-secondary">Size {item.size}{item.color ? ` / ${item.color}` : ''}</p>
                        {item.sku && (
                          <p className="text-xs text-text-light mt-0.5">SKU: {item.sku}</p>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border border-border-light rounded-md overflow-hidden">
                            <button 
                              className="p-2 hover:bg-cream-100 transition-colors" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5 text-text-primary" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-text-primary border-l border-r border-border-light">{item.quantity}</span>
                            <button 
                              className="p-2 hover:bg-cream-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50" 
                              onClick={() => updateQuantity(item.id, Math.min(item.stock ?? Infinity, item.quantity + 1))} 
                              aria-label="Increase quantity"
                              disabled={item.stock != null && item.quantity >= item.stock}
                            >
                              <Plus className="h-3.5 w-3.5 text-text-primary" />
                            </button>
                          </div>
                          <div className="text-right">
                            <button 
                              className="text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary hover:text-rose-400 transition-colors" 
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </button>
                            <p className="text-sm font-semibold text-rose-400 mt-2">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout section */}
            {items.length > 0 && (
              <div className="border-t border-border-light bg-cream-50 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">Subtotal</span>
                  <span className="text-xl font-semibold text-rose-400">{formatPrice(totalPrice)}</span>
                </div>
                <button 
                  className="w-full bg-rose-400 text-white px-5 py-3 font-semibold text-sm uppercase tracking-[0.16em] hover:bg-rose-300 active:bg-rose-500 transition-all duration-200 rounded-md" 
                  onClick={() => setCheckout(true)}
                >
                  Continue to WhatsApp
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            {/* Stock validation errors */}
            {Object.entries(errors).some(([key]) => key.startsWith('stock-')) && (
              <div className="border-b border-border-light bg-red-50 px-6 py-4">
                {Object.entries(errors).map(([key, message]) => 
                  key.startsWith('stock-') ? (
                    <p key={key} className="text-xs text-red-700 font-medium mb-2 last:mb-0">
                      {message}
                    </p>
                  ) : null
                )}
              </div>
            )}
            
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {Object.entries(initialCustomer).map(([field]) => (
                <label key={field} className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
                    {field === 'pincode' ? 'PIN Code' : field}
                  </span>
                  {field === 'address' ? (
                    <textarea
                      value={customer[field]}
                      onChange={(event) => setCustomer({ ...customer, [field]: event.target.value })}
                      rows={3}
                      className="w-full border border-border-light bg-cream-50 px-3 py-3 text-sm rounded-md text-text-primary focus:border-rose-250 focus:bg-white focus:ring-1 focus:ring-rose-100 outline-none transition-all"
                    />
                  ) : (
                    <input
                      value={customer[field]}
                      onChange={(event) => setCustomer({ ...customer, [field]: event.target.value })}
                      className="w-full border border-border-light bg-cream-50 px-3 py-3 text-sm rounded-md text-text-primary focus:border-rose-250 focus:bg-white focus:ring-1 focus:ring-rose-100 outline-none transition-all"
                    />
                  )}
                  {errors[field] && <span className="mt-1 block text-xs text-rose-400">{errors[field]}</span>}
                </label>
              ))}
            </div>

            {/* Checkout footer */}
            <div className="border-t border-border-light bg-cream-50 p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">Total</span>
                <span className="text-xl font-semibold text-rose-400">{formatPrice(totalPrice)}</span>
              </div>
              <button 
                className="w-full bg-[#128c7e] text-white px-5 py-3 font-semibold text-sm uppercase tracking-[0.16em] hover:bg-[#0f6d57] transition-all duration-200 rounded-md"
              >
                Send order on WhatsApp
              </button>
              <button 
                type="button" 
                className="mt-3 w-full py-3 text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary hover:text-rose-400 transition" 
                onClick={() => setCheckout(false)}
              >
                Back to cart
              </button>
            </div>
          </form>
        )}
      </aside>
    </div>
  )
}
