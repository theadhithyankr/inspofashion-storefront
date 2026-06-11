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
  const [scrolled, setScrolled] = useState(false)
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      {/* Sticky Header - Transparent overlay */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-black/10' : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-16">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo - Left */}
            <Link href="/" className="font-display text-2xl sm:text-3xl lg:text-4xl italic tracking-normal text-black flex-shrink-0">
              {general?.store_name || 'Inspofashions'}
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-16 flex-1 justify-center">
              {navLinks.slice(0, 3).map((link) => (
                <Link 
                  key={`${link.name}-${link.url}`} 
                  href={sanitizeUrl(link.url)} 
                  className="text-xs font-bold uppercase tracking-[0.2em] text-black/80 hover:text-black transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Search & Cart - Right */}
            <div className="flex items-center justify-end gap-8 flex-shrink-0">
              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 hover:bg-white/20 rounded transition-colors" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5 text-black" />
              </button>

              {/* Desktop Icons */}
              <button 
                className="hidden sm:block p-2 hover:bg-white/20 rounded transition-colors" 
                onClick={() => setSearchOpen(true)} 
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-black" />
              </button>
              <button 
                className="relative p-2 hover:bg-white/20 rounded transition-colors" 
                onClick={onCartClick} 
                aria-label="Open cart"
              >
                <ShoppingBag className="h-5 w-5 text-black" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black text-white text-[9px] font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
      <div className="fixed inset-0 z-50 lg:hidden">
        <button
          className="absolute inset-0 bg-black/30"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
        <div className="relative flex h-full w-[85vw] max-w-sm flex-col bg-white p-6 sm:p-8 shadow-2xl animate-[slideInMenu_260ms_ease-out]">
          {/* Header with close button */}
          <div className="mb-8 flex items-center justify-between border-b border-[#EAE0E0] pb-6">
            <span className="font-display text-2xl sm:text-3xl italic text-black">{general?.store_name || 'Inspofashions'}</span>
            <button 
              className="rounded-full border border-black/20 p-2 transition hover:bg-[#FAF5F5]" 
              onClick={() => setMenuOpen(false)} 
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 space-y-0">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-black/60">Collections</p>
            {navLinks.map((link) => (
              <Link
                key={`${link.name}-${link.url}`}
                href={sanitizeUrl(link.url)}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-[#F0EDED] py-4 text-base font-semibold text-black hover:text-black/70 transition-colors"
              >
                <span>{link.name}</span>
                <span className="text-black/30 transition group-hover:translate-x-1 group-hover:text-black">→</span>
              </Link>
            ))}

            {/* Additional links */}
            <div className="space-y-0 border-t border-[#EAE0E0] mt-6 pt-6">
              <Link 
                href="/shipping-returns" 
                onClick={() => setMenuOpen(false)} 
                className="block border-b border-[#F0EDED] py-4 text-base font-semibold text-black hover:text-black/70"
              >
                Shipping & Returns
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setMenuOpen(false)} 
                className="block py-4 text-base font-semibold text-black hover:text-black/70"
              >
                Contact
              </Link>
            </div>
          </nav>

          {/* Footer text */}
          <div className="border-t border-[#EAE0E0] pt-6 text-xs leading-6 text-black/60">
            Premium clothing curated for easy everyday ordering. Choose your fit, send the order on WhatsApp.
          </div>
        </div>
      </div>
      )}

      {searchOpen && (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
          {/* Search header */}
          <div className="mb-8 flex items-center justify-between border-b border-[#EAE0E0] pb-6">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-black/60">Search</span>
            <button 
              className="rounded-full border border-black/20 p-2 hover:bg-[#FAF5F5] transition" 
              onClick={() => setSearchOpen(false)} 
              aria-label="Close search"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>

          {/* Search input */}
          <form onSubmit={submitSearch} className="mb-6 border-b border-black pb-3">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-black/40 flex-shrink-0" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, categories..."
                className="w-full bg-transparent text-lg sm:text-2xl font-display outline-none placeholder:text-black/30"
              />
            </div>
          </form>

          {/* Results */}
          <div className="space-y-2">
            {query.trim() && suggestions.length === 0 && (
              <div className="rounded-sm bg-[#FAF5F5] px-4 py-5 text-sm text-black/60">
                No results found. Press Enter to search the full catalog.
              </div>
            )}
            {suggestions.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`} 
                onClick={() => setSearchOpen(false)} 
                className="block rounded-sm px-3 py-4 transition hover:bg-[#FAF5F5]"
              >
                <span className="text-base font-semibold text-black">{product.title}</span>
                <span className="ml-2 text-xs text-black/60">{product.category}</span>
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
    <footer className="bg-white border-t border-gray-200 text-black">
      <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-16 py-16 sm:py-20">
        <div className="grid gap-12 md:gap-16 md:grid-cols-4">
          {/* Brand info */}
          <div>
            <div className="font-display text-2xl italic text-black mb-4">
              {general?.store_name || 'Inspofashions'}
            </div>
            <p className="text-sm leading-6 text-black/70 mb-6 max-w-sm">
              Premium clothing curated for easy everyday ordering.
            </p>
            {footer?.company_info?.email && (
              <p className="text-sm text-black/60">{footer?.company_info?.email || general?.support_email}</p>
            )}
          </div>

          {/* Footer sections */}
          {sections.map((section) => (
            <div key={section.id || section.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-black/80">
                {section.title}
              </h3>
              <ul className="space-y-3 text-sm">
                {section.links?.map((link) => (
                  <li key={`${section.title}-${link.name}`}>
                    <Link 
                      href={sanitizeUrl(link.url)} 
                      className="text-black/70 hover:text-black transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-16 pt-8 text-center text-xs text-black/50">
          © {new Date().getFullYear()} {general?.store_name || 'Inspofashions'}. WhatsApp checkout only.
        </div>
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
