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
        className="absolute inset-0 bg-brand-900/50"
        onClick={onClose}
        aria-label="Close cart"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-[slideInCart_260ms_ease-out]">
        <div className="flex items-center justify-between border-b border-brand-100 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">{checkout ? 'Checkout' : 'Cart'}</p>
            <h2 className="text-xl font-semibold">{checkout ? 'Send order on WhatsApp' : `${totalItems} item${totalItems === 1 ? '' : 's'}`}</h2>
          </div>
          <button className="rounded-full border border-brand-200 p-2 transition hover:bg-brand-50" onClick={onClose} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!checkout ? (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 h-12 w-12 text-brand-300" />
                  <p className="text-lg font-semibold">Your bag is empty</p>
                  <p className="mt-2 text-sm text-brand-500">Add a piece and checkout directly through WhatsApp.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-brand-100 py-5">
                    <div className="relative h-24 w-20 flex-none overflow-hidden bg-brand-100">
                      {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill sizes="80px" className="object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/products/${item.slug}`} onClick={onClose} className="font-semibold leading-tight hover:underline">
                        {item.title}
                      </Link>
                      <p className="mt-1 text-sm text-brand-500">Size {item.size}{item.color ? ` / ${item.color}` : ''}</p>
                      {item.sku && (
                        <p className="text-xs text-brand-400">SKU: {item.sku}</p>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-brand-200 bg-white">
                          <button className="p-2 transition hover:bg-brand-50" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button className="p-2 transition hover:bg-brand-50" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button className="text-xs font-bold uppercase tracking-wider text-brand-500 transition hover:text-brand-900" onClick={() => removeFromCart(item.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-brand-100 bg-brand-50 p-5">
                <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <button className="w-full bg-brand-900 px-5 py-4 font-bold uppercase tracking-[0.14em] text-white transition hover:bg-brand-800" onClick={() => setCheckout(true)}>
                  Continue to WhatsApp
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {Object.entries(initialCustomer).map(([field]) => (
                <label key={field} className="block">
                  <span className="mb-1 block text-sm font-semibold capitalize">{field === 'pincode' ? 'PIN code' : field}</span>
                  {field === 'address' ? (
                    <textarea
                      value={customer[field]}
                      onChange={(event) => setCustomer({ ...customer, [field]: event.target.value })}
                      rows={3}
                      className="w-full border border-brand-200 px-3 py-3 outline-none focus:border-brand-900"
                    />
                  ) : (
                    <input
                      value={customer[field]}
                      onChange={(event) => setCustomer({ ...customer, [field]: event.target.value })}
                      className="w-full border border-brand-200 px-3 py-3 outline-none focus:border-brand-900"
                    />
                  )}
                  {errors[field] && <span className="mt-1 block text-xs text-red-700">{errors[field]}</span>}
                </label>
              ))}
            </div>
            <div className="border-t border-brand-100 bg-brand-50 p-5">
              <div className="mb-4 flex items-center justify-between font-semibold">
                <span>Amount to confirm</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <button className="w-full bg-[#128c7e] px-5 py-4 font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#0f766b]">
                Send order on WhatsApp
              </button>
              <button type="button" className="mt-3 w-full py-2 text-sm text-brand-500" onClick={() => setCheckout(false)}>
                Back to cart
              </button>
            </div>
          </form>
        )}
      </aside>
    </div>
  )
}
