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
        scrolled ? 'bg-cream-100/95 backdrop-blur-sm border-b border-border-light' : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-16">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo - Left */}
            <Link href="/" className="font-display text-2xl sm:text-3xl lg:text-4xl italic tracking-normal text-text-primary flex-shrink-0">
              {general?.store_name || 'Inspofashions'}
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-16 flex-1 justify-center">
              {navLinks.slice(0, 3).map((link) => (
                <Link 
                  key={`${link.name}-${link.url}`} 
                  href={sanitizeUrl(link.url)} 
                  className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Search & Cart - Right */}
            <div className="flex items-center justify-end gap-6 sm:gap-8 flex-shrink-0">
              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 hover:scale-105 transition-transform duration-200" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5 text-text-primary" />
              </button>

              {/* Search Icon - Mobile & Desktop */}
              <button 
                className="p-2 hover:scale-105 transition-transform duration-200" 
                onClick={() => setSearchOpen(true)} 
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-text-primary" />
              </button>

              {/* Cart Icon */}
              <button 
                className="relative p-2 hover:scale-105 transition-transform duration-200" 
                onClick={onCartClick} 
                aria-label="Open cart"
              >
                <ShoppingBag className="h-5 w-5 text-text-primary" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-400 text-white text-[9px] font-bold">
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
        {/* Dark overlay backdrop */}
        <button
          className="absolute inset-0 bg-black/45 transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
        
        {/* Side drawer - Fixed position */}
        <div className="fixed top-0 left-0 bottom-0 w-[82vw] max-w-xs flex flex-col bg-cream-100 backdrop-blur-sm z-50 animate-[slideInLeft_300ms_ease-out] shadow-lg">
          {/* Header with close button */}
          <div className="flex items-center justify-between border-b border-border-light px-6 py-4">
            <span className="font-display text-xl italic text-text-primary">{general?.store_name || 'Inspofashions'}</span>
            <button 
              className="rounded-full p-1.5 hover:bg-rose-100 transition-colors duration-300" 
              onClick={() => setMenuOpen(false)} 
              aria-label="Close menu"
            >
              <X className="h-4 w-4 text-text-primary" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto">
            <p className="px-6 pt-6 pb-3 text-xs font-bold uppercase tracking-[0.2em] text-text-light">Collections</p>
            
            {navLinks.map((link) => (
              <Link
                key={`${link.name}-${link.url}`}
                href={sanitizeUrl(link.url)}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-border-subtle px-6 py-4 text-sm font-semibold text-text-primary hover:bg-rose-50 transition-colors duration-300"
              >
                <span>{link.name}</span>
                <span className="text-text-light transition-all duration-300 group-hover:translate-x-1 group-hover:text-rose-400">→</span>
              </Link>
            ))}

            {/* Additional links section */}
            <div className="border-t border-border-light mt-4">
              <p className="px-6 pt-6 pb-3 text-xs font-bold uppercase tracking-[0.2em] text-text-light">Help</p>
              <Link 
                href="/shipping-returns" 
                onClick={() => setMenuOpen(false)} 
                className="group flex items-center justify-between border-b border-border-subtle px-6 py-4 text-sm font-semibold text-text-primary hover:bg-rose-50 transition-colors duration-300"
              >
                <span>Shipping & Returns</span>
                <span className="text-text-light transition-all duration-300 group-hover:translate-x-1 group-hover:text-rose-400">→</span>
              </Link>
              <Link 
                href="/size-guide" 
                onClick={() => setMenuOpen(false)} 
                className="group flex items-center justify-between border-b border-border-subtle px-6 py-4 text-sm font-semibold text-text-primary hover:bg-rose-50 transition-colors duration-300"
              >
                <span>Size Guide</span>
                <span className="text-text-light transition-all duration-300 group-hover:translate-x-1 group-hover:text-rose-400">→</span>
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setMenuOpen(false)} 
                className="group flex items-center justify-between px-6 py-4 text-sm font-semibold text-text-primary hover:bg-rose-50 transition-colors duration-300"
              >
                <span>Contact</span>
                <span className="text-text-light transition-all duration-300 group-hover:translate-x-1 group-hover:text-rose-400">→</span>
              </Link>
            </div>
          </nav>

          {/* Footer text */}
          <div className="border-t border-border-light px-6 py-6 text-xs leading-6 text-text-secondary">
            Premium clothing curated for easy everyday ordering.
          </div>
        </div>
      </div>
      )}

      {searchOpen && (
      <div className="fixed inset-0 z-50 bg-cream-100 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
          {/* Search header */}
          <div className="mb-8 flex items-center justify-between border-b border-border-light pb-6">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-light">Search</span>
            <button 
              className="rounded-full border border-border-light p-2 hover:bg-rose-50 transition" 
              onClick={() => setSearchOpen(false)} 
              aria-label="Close search"
            >
              <X className="h-5 w-5 text-text-primary" />
            </button>
          </div>

          {/* Search input */}
          <form onSubmit={submitSearch} className="mb-6 border-b border-text-secondary pb-3">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-text-light flex-shrink-0" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, categories..."
                className="w-full bg-transparent text-lg sm:text-2xl font-display outline-none placeholder:text-text-light"
              />
            </div>
          </form>

          {/* Results */}
          <div className="space-y-2">
            {query.trim() && suggestions.length === 0 && (
              <div className="rounded-sm bg-rose-50 px-4 py-5 text-sm text-text-secondary">
                No results found. Press Enter to search the full catalog.
              </div>
            )}
            {suggestions.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`} 
                onClick={() => setSearchOpen(false)} 
                className="block rounded-sm px-3 py-4 transition hover:bg-rose-50"
              >
                <span className="text-base font-semibold text-text-primary">{product.title}</span>
                <span className="ml-2 text-xs text-text-light">{product.category}</span>
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
    <footer className="bg-white border-t border-border-light text-text-primary">
      <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-16 py-16 sm:py-20">
        <div className="grid gap-12 md:gap-16 md:grid-cols-4">
          {/* Brand info */}
          <div>
            <div className="font-display text-2xl italic text-text-primary mb-4">
              {general?.store_name || 'Inspofashions'}
            </div>
            <p className="text-sm leading-6 text-text-secondary mb-6 max-w-sm">
              Premium clothing curated for easy everyday ordering.
            </p>
            {footer?.company_info?.email && (
              <p className="text-sm text-text-light">{footer?.company_info?.email || general?.support_email}</p>
            )}
          </div>

          {/* Footer sections */}
          {sections.map((section) => (
            <div key={section.id || section.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-text-primary">
                {section.title}
              </h3>
              <ul className="space-y-3 text-sm">
                {section.links?.map((link) => (
                  <li key={`${section.title}-${link.name}`}>
                    <Link 
                      href={sanitizeUrl(link.url)} 
                      className="text-text-secondary hover:text-rose-400 transition-colors duration-300"
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
        <div className="border-t border-border-light mt-16 pt-8 text-center text-xs text-text-light">
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
