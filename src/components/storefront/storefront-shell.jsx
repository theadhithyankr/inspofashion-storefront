'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { CartProvider, useCart } from './cart-context'
import { CartDrawer } from './cart-drawer'
import { sanitizeUrl } from '@/lib/format'

function Header({ menu, general, products, collections, onCartClick }) {
  const router = useRouter()
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchInputRef = useRef(null)

  const navLinks = menu?.links?.length
    ? menu.links
    : collections.slice(0, 5).map((collection) => ({
        name: collection.name,
        url: `/collections/${collection.slug}`,
      }))

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return products
      .filter((product) => `${product.title} ${product.category}`.toLowerCase().includes(term))
      .slice(0, 5)
  }, [products, query])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', menuOpen || searchOpen)
    return () => document.body.classList.remove('overflow-hidden')
  }, [menuOpen, searchOpen])

  useEffect(() => {
    if (!searchOpen) return
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 120)
    return () => window.clearTimeout(focusTimer)
  }, [searchOpen])

  useEffect(() => {
    const closePanels = (event) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      setSearchOpen(false)
    }

    window.addEventListener('keydown', closePanels)
    return () => window.removeEventListener('keydown', closePanels)
  }, [])

  const submitSearch = (event) => {
    event.preventDefault()
    const term = query.trim()
    if (!term) return
    setSearchOpen(false)
    setQuery('')
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <>
      <div className="bg-brand-900 px-3 py-1.5 text-center text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
        {menu?.announcement_text || 'New season pieces now available. Order directly on WhatsApp.'}
      </div>
      <header className="sticky top-0 z-40 border-b border-brand-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 sm:h-16 max-w-[1500px] items-center px-3 sm:px-6 lg:px-10 gap-3 sm:gap-6 relative">
          {/* Mobile Menu Button - Left */}
          <button className="p-2 lg:hidden flex-shrink-0 absolute left-3 sm:left-6" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop Navigation - Left */}
          <nav className="hidden flex-1 items-center gap-6 lg:flex">
            {navLinks.slice(0, 5).map((link) => (
              <Link key={`${link.name}-${link.url}`} href={sanitizeUrl(link.url)} className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700 hover:text-brand-900">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Brand Name - Center (Absolute Positioning) */}
          <Link href="/" className="absolute inset-x-0 mx-auto w-fit font-display text-xl italic tracking-normal text-brand-900 sm:text-2xl lg:left-1/2 lg:right-auto lg:mx-0 lg:-translate-x-1/2 lg:text-3xl">
            {general?.store_name || 'Inspofashions'}
          </Link>

          {/* Search & Cart - Right */}
          <div className="absolute right-3 flex flex-shrink-0 items-center justify-end gap-1 sm:right-6 sm:gap-3 lg:right-10">
            <button className="p-2 sm:p-2" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button className="relative p-2 sm:p-2" onClick={onCartClick} aria-label="Open cart">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6f1d1b] px-0.5 text-[8px] sm:text-[10px] font-bold text-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
      <div className="fixed inset-0 z-50 lg:hidden">
        <button
          className="absolute inset-0 bg-black/45"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
        <div className="relative flex h-full w-[88vw] max-w-sm flex-col bg-white p-4 shadow-2xl animate-[slideInMenu_260ms_ease-out]">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display text-2xl sm:text-3xl italic">{general?.store_name || 'Inspofashions'}</span>
            <button className="rounded-full border border-brand-200 p-1.5 transition hover:bg-brand-50" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          <p className="mb-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">Collections</p>
          <nav className="space-y-0">
            {navLinks.map((link) => (
              <Link
                key={`${link.name}-${link.url}`}
                href={sanitizeUrl(link.url)}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-brand-100 py-3 sm:py-4 text-base sm:text-lg font-semibold"
              >
                <span>{link.name}</span>
                <span className="text-brand-300 transition group-hover:translate-x-1 group-hover:text-brand-900">→</span>
              </Link>
            ))}
            <Link href="/shipping-returns" onClick={() => setMenuOpen(false)} className="block border-b border-brand-100 py-3 sm:py-4 text-base sm:text-lg font-semibold">
              Shipping & Returns
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="block border-b border-brand-100 py-3 sm:py-4 text-base sm:text-lg font-semibold">
              Contact
            </Link>
          </nav>
          <div className="mt-auto border-t border-brand-100 pt-4 text-xs sm:text-sm leading-5 sm:leading-6 text-brand-500">
            Browse the latest edit, choose your size, and confirm the order directly on WhatsApp.
          </div>
        </div>
      </div>
      )}

      {searchOpen && (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <div className="mx-auto max-w-3xl px-3 sm:px-4 py-4 sm:py-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-brand-500">Search the edit</span>
            <button className="rounded-full border border-brand-200 p-1.5 transition hover:bg-brand-50" onClick={() => setSearchOpen(false)} aria-label="Close search">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          <form onSubmit={submitSearch} className="flex items-center border-b border-brand-900 pb-2 mb-4">
            <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-brand-500 flex-shrink-0" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search shirts, co-ords..."
              className="w-full bg-transparent text-lg sm:text-2xl outline-none placeholder:text-brand-300"
            />
          </form>
          <div className="space-y-1 sm:space-y-2">
            {query.trim() && suggestions.length === 0 && (
              <div className="rounded-sm bg-brand-50 px-3 py-3 sm:px-4 sm:py-5 text-xs sm:text-sm text-brand-500">
                No matches yet. Press Enter to search the full catalog.
              </div>
            )}
            {suggestions.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} onClick={() => setSearchOpen(false)} className="block rounded-sm px-2 py-2 sm:px-3 sm:py-3 transition hover:bg-brand-50">
                <span className="text-sm sm:text-base font-semibold">{product.title}</span>
                <span className="ml-2 text-xs sm:text-sm text-brand-500">{product.category}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      )}
    </>
  )
}

function Footer({ footer, general }) {
  if (footer?.is_visible === false) return null
  const sections = footer?.sections?.length ? footer.sections : [
    { id: 'shop', title: 'Shop', links: [{ name: 'All products', url: '/search' }] },
    { id: 'help', title: 'Help', links: [{ name: 'Shipping & Returns', url: '/shipping-returns' }, { name: 'Size Guide', url: '/size-guide' }] },
    { id: 'brand', title: 'Brand', links: [{ name: 'About', url: '/about' }, { name: 'Contact', url: '/contact' }] },
  ]

  return (
    <footer className="bg-brand-900 text-white">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 lg:px-10">
        <div className="md:col-span-5">
          <div className="font-display text-4xl italic">{general?.store_name || 'Inspofashions'}</div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-brand-200">
            Premium clothing curated for easy everyday ordering. Choose your fit, send the order on WhatsApp, and we will confirm availability directly.
          </p>
          <p className="mt-6 text-sm text-brand-300">{footer?.company_info?.email || general?.support_email || 'help@inspofashions.com'}</p>
        </div>
        {sections.map((section) => (
          <div key={section.id || section.title} className="md:col-span-2">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-400">{section.title}</h3>
            <ul className="space-y-3 text-sm">
              {section.links?.map((link) => (
                <li key={`${section.title}-${link.name}`}>
                  <Link href={sanitizeUrl(link.url)} className="text-brand-100 hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-brand-400">
        © {new Date().getFullYear()} {general?.store_name || 'Inspofashions'}. WhatsApp checkout only. No online payment is collected.
      </div>
    </footer>
  )
}

function Chrome({ children, data }) {
  const [cartOpen, setCartOpen] = useState(false)
  useEffect(() => {
    const openCart = () => setCartOpen(true)
    window.addEventListener('storefront:open-cart', openCart)
    return () => window.removeEventListener('storefront:open-cart', openCart)
  }, [])

  return (
    <CartProvider>
      <Header
        menu={data.menu}
        general={data.general}
        products={data.products}
        collections={data.collections}
        onCartClick={() => setCartOpen(true)}
      />
      {children}
      <Footer footer={data.footer} general={data.general} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} whatsappNumber={data.general?.whatsapp_number} />
    </CartProvider>
  )
}

export function StorefrontShell({ children, data }) {
  return <Chrome data={data}>{children}</Chrome>
}
