import { ShoppingBag, Menu, X, Search, User, HelpCircle } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useStoreSettings } from '../../hooks/useStoreSettings'
import { useCollections } from '../../hooks/useCollections'
import { useProducts } from '../../hooks/useProducts'

export function Header({ onCartClick }) {
  const { totalItems } = useCart()
  const { settings: menuSettings } = useStoreSettings('menu_bar')
  const { settings: generalSettings } = useStoreSettings('general_settings')
  const { collections } = useCollections()
  const { products } = useProducts()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || !products) return []
    const q = searchQuery.toLowerCase()
    return products
      .filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 5) // Show top 5 suggestions
  }, [searchQuery, products])

  const handleSuggestionClick = (title) => {
    navigate(`/search?q=${encodeURIComponent(title)}`)
    setSearchOpen(false)
    setSearchQuery('')
  }

  const announcementText = menuSettings?.announcement_text || "Free Shipping on Orders over ₹75. Easy Returns."
  // Use MenuSettings links
  const navLinks = menuSettings?.links || [
        { name: "Men's", url: "/collections/Men's" },
      ]
  const storeName = generalSettings?.store_name || "inspofashions"

  return (
    <>
      <div className="bg-[#212121] text-white text-center py-2 relative z-50">
        <p className="text-xs font-medium tracking-wide">
          {announcementText}
        </p>
      </div>

      <header className="sticky top-0 z-40 bg-white font-sans text-brand-900 border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4 lg:px-6 w-full text-[14px]">
          {searchOpen ? (
            <div className="w-full flex items-center h-full animate-in fade-in slide-in-from-top-2 relative">
              <form onSubmit={handleSearch} className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 mx-2 transition-all">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, collections..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm w-full"
                  autoFocus
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-black ml-2 p-1">
                  <X className="w-4 h-4" />
                </button>
              </form>
              
              {/* Search Suggestions Dropdown */}
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-2 mx-2">
                  <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggested Results</p>
                  {searchSuggestions.map((product) => (
                    <button 
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.title)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                    >
                      <Search className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="flex-1 truncate">
                        <span className="text-sm font-medium text-brand-900">{product.title}</span>
                        <span className="text-xs text-gray-500 ml-2">in {product.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Left Navigation */}
              <div className="flex items-center space-x-4 sm:space-x-6 flex-1">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-1 -ml-1 hover:opacity-70"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              {/* Center Logo */}
              <div className="flex justify-center shrink-0 px-2">
                <a href="/" className="text-[26px] sm:text-3xl font-bold lowercase tracking-tighter hover:opacity-75 transition-opacity" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  {storeName}
                </a>
              </div>

              {/* Right Icons */}
              <div className="flex items-center space-x-4 lg:space-x-5 flex-1 justify-end">
                <button onClick={() => setSearchOpen(true)} className="hover:opacity-70 transition-opacity p-1">
                  <Search className="w-6 h-6" />
                </button>
                <button
                  onClick={onCartClick}
                  className="relative hover:opacity-70 transition-opacity p-1 flex items-center"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-900 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Secondary Navigation */}
        <div className="hidden lg:flex items-center justify-center space-x-8 bg-white py-3 text-[13px] font-bold tracking-widest uppercase">
          {navLinks.map((link) => (
            <a key={link.name} href={link.url} className="hover:underline underline-offset-4 decoration-1">
              {link.name}
            </a>
          ))}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 h-16 border-b border-brand-200">
              <span className="text-xl font-semibold text-brand-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-brand-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.url} className="block py-3 text-lg font-medium text-brand-900 border-b border-brand-100">
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
