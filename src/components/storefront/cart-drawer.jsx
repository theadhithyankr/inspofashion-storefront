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
        <div className="flex items-center justify-between border-b border-[#EAE0E0] px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/60">{checkout ? 'Details' : 'Shopping Bag'}</p>
            <h2 className="text-lg font-bold text-black mt-1">{checkout ? 'Send order on WhatsApp' : `${totalItems} item${totalItems === 1 ? '' : 's'}`}</h2>
          </div>
          <button className="rounded-full border border-black/20 p-2 hover:bg-[#FAF5F5] transition" onClick={onClose} aria-label="Close cart">
            <X className="h-5 w-5 text-black" />
          </button>
        </div>

        {!checkout ? (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <ShoppingBag className="mb-4 h-12 w-12 text-black/20" />
                  <p className="text-lg font-semibold text-black">Your bag is empty</p>
                  <p className="mt-2 text-sm text-black/60">Add a piece and checkout directly through WhatsApp.</p>
                </div>
              ) : (
                <div className="space-y-6 py-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b border-[#F0EDED] last:border-b-0">
                      <div className="relative h-28 w-20 flex-none overflow-hidden bg-[#FAFAFA]">
                        {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill sizes="80px" className="object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${item.slug}`} onClick={onClose} className="text-sm font-semibold text-black hover:text-black/70">
                          {item.title}
                        </Link>
                        <p className="mt-1.5 text-xs text-black/60">Size {item.size}{item.color ? ` / ${item.color}` : ''}</p>
                        {item.sku && (
                          <p className="text-xs text-black/40 mt-0.5">SKU: {item.sku}</p>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border border-black/20">
                            <button 
                              className="p-2 hover:bg-[#FAF5F5] transition" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5 text-black" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-black">{item.quantity}</span>
                            <button 
                              className="p-2 hover:bg-[#FAF5F5] transition" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5 text-black" />
                            </button>
                          </div>
                          <div className="text-right">
                            <button 
                              className="text-xs font-bold uppercase tracking-[0.12em] text-black/60 hover:text-black transition" 
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </button>
                            <p className="text-sm font-bold text-black mt-2">{formatPrice(item.price * item.quantity)}</p>
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
              <div className="border-t border-[#EAE0E0] bg-[#FAFAFA] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-[0.12em] text-black/60">Subtotal</span>
                  <span className="text-xl font-bold text-black">{formatPrice(totalPrice)}</span>
                </div>
                <button 
                  className="w-full bg-black text-white px-5 py-4 font-bold text-sm uppercase tracking-[0.18em] hover:bg-black/80 transition-colors duration-300" 
                  onClick={() => setCheckout(true)}
                >
                  Continue to WhatsApp
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {Object.entries(initialCustomer).map(([field]) => (
                <label key={field} className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-black/60">
                    {field === 'pincode' ? 'PIN Code' : field}
                  </span>
                  {field === 'address' ? (
                    <textarea
                      value={customer[field]}
                      onChange={(event) => setCustomer({ ...customer, [field]: event.target.value })}
                      rows={3}
                      className="w-full border border-[#EAE0E0] px-3 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                    />
                  ) : (
                    <input
                      value={customer[field]}
                      onChange={(event) => setCustomer({ ...customer, [field]: event.target.value })}
                      className="w-full border border-[#EAE0E0] px-3 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black/10"
                    />
                  )}
                  {errors[field] && <span className="mt-1 block text-xs text-red-600">{errors[field]}</span>}
                </label>
              ))}
            </div>

            {/* Checkout footer */}
            <div className="border-t border-[#EAE0E0] bg-[#FAFAFA] p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.12em] text-black/60">Total</span>
                <span className="text-xl font-bold text-black">{formatPrice(totalPrice)}</span>
              </div>
              <button 
                className="w-full bg-[#128c7e] text-white px-5 py-4 font-bold text-sm uppercase tracking-[0.18em] hover:bg-[#0f766b] transition-colors duration-300"
              >
                Send order on WhatsApp
              </button>
              <button 
                type="button" 
                className="mt-3 w-full py-3 text-xs font-bold uppercase tracking-[0.12em] text-black/60 hover:text-black transition" 
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
