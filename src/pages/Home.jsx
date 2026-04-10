import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useStoreSettings } from '../hooks/useStoreSettings'
import { useCollections } from '../hooks/useCollections'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { CategoryFilter } from '../components/products/CategoryFilter'
import { ProductGrid } from '../components/products/ProductGrid'
import { ProductDetailModal } from '../components/products/ProductDetailModal'
import { CartDrawer } from '../components/cart/CartDrawer'

export function Home() {
  const { products, loading, error } = useProducts()
  const { settings: heroSettings } = useStoreSettings('hero_section')
  const { collections } = useCollections()
  const navigate = useNavigate()
  
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const handleOpenCart = () => setCartOpen(true)
    window.addEventListener('open-cart-checkout', handleOpenCart)
    return () => window.removeEventListener('open-cart-checkout', handleOpenCart)
  }, [])

  const categories = useMemo(() => {
    if (!collections) return []
    return collections.map((c) => c.name).sort()
  }, [collections])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products
    }
    return products.filter((p) => p.category === selectedCategory)
  }, [products, selectedCategory])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onCartClick={() => setCartOpen(true)} />

      <main className="flex-1 bg-white">
        {/* Hero Section */}
        {heroSettings && (
          <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex flex-col justify-end items-center pb-12 sm:pb-20">
            <div className="absolute inset-0 z-0">
              <img
                src={heroSettings.image_url || "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"}
                alt="Shoes hero"
                className="w-full h-full object-cover object-center"
              />
              {/* Dark gradient overlay to make text pop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
            
            <div className="relative z-10 text-center px-4 w-full flex flex-col items-center">
              <p className="text-white font-medium tracking-[0.2em] uppercase text-sm mb-4">
                {heroSettings.subtitle || "The Dasher Collection"}
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-white leading-tight tracking-tight mb-8">
                {heroSettings.title || "Ready. Set. Take your time."}
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {heroSettings.button_men && (
                  <button onClick={() => navigate(heroSettings.button_men_url || `/collections/${encodeURIComponent(heroSettings.button_men)}`)} className="bg-white text-black font-bold px-10 py-3.5 rounded-full uppercase tracking-wider text-[13px] hover:bg-gray-100 transition-colors w-full sm:w-auto shadow-lg">
                    {heroSettings.button_men}
                  </button>
                )}
                {heroSettings.button_women && (
                  <button onClick={() => navigate(heroSettings.button_women_url || `/collections/${encodeURIComponent(heroSettings.button_women)}`)} className="bg-white text-black font-bold px-10 py-3.5 rounded-full uppercase tracking-wider text-[13px] hover:bg-gray-100 transition-colors w-full sm:w-auto shadow-lg">
                    {heroSettings.button_women}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Collections Strip */}
        <section className="px-4 py-12 sm:py-16 max-w-[1400px] mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-brand-900 tracking-tight">Explore Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {collections.slice(0, 4).map((collection) => (
              <div key={collection.id} onClick={() => {
                navigate(`/collections/${encodeURIComponent(collection.name)}`)
              }} className="bg-white rounded-2xl flex flex-col items-center justify-end aspect-[4/5] relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                <img src={collection.image_url || "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} alt={collection.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 lg:opacity-80 lg:group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 p-5 sm:p-6 w-full text-center transform translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-lg sm:text-xl uppercase tracking-wider mb-2 sm:mb-3">
                    {collection.name}
                  </h3>
                  <span className="inline-block text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest border-b-2 border-white pb-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    Shop Now
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shop Section */}
        <section id="shop" className="py-16 sm:py-24">
          <div className="container-wide">
            {/* Section Header */}
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold text-brand-900 mb-4">
                Our Collection
              </h2>
              <p className="text-lg text-brand-600 max-w-2xl mx-auto">
                Explore our carefully curated selection of premium clothing
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8 text-center">
                {error}
              </div>
            )}

            {/* Category Filter */}
            {!loading && categories.length > 0 && (
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            )}

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onProductClick={setSelectedProduct}
            />
          </div>
        </section>

        {/* Value Props Section */}
        <section className="bg-white py-16 sm:py-24">
          <div className="container-wide px-4">
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="bg-[#f5f4ef] rounded-lg p-8 shadow-sm text-left flex flex-col justify-start">
                <h3 className="text-[13px] tracking-widest font-bold text-black uppercase mb-4">
                  Wear All Day Comfort
                </h3>
                <p className="text-black text-sm leading-relaxed">
                  Lightweight, bouncy, and wildly comfortable, Inspofashions shoes make any outing feel effortless. Slip in, lace up, or slide them on and enjoy the comfy support.
                </p>
              </div>

              <div className="bg-[#f5f4ef] rounded-lg p-8 shadow-sm text-left flex flex-col justify-start">
                <h3 className="text-[13px] tracking-widest font-bold text-black uppercase mb-4">
                  Sustainability In Every Step
                </h3>
                <p className="text-black text-sm leading-relaxed">
                  From materials to transport, we're working to reduce our carbon footprint to near zero. Holding ourselves accountable and striving for climate goals isn't a 30-year goal—it's now.
                </p>
              </div>

              <div className="bg-[#f5f4ef] rounded-lg p-8 shadow-sm text-left flex flex-col justify-start">
                <h3 className="text-[13px] tracking-widest font-bold text-black uppercase mb-4">
                  Materials From The Earth
                </h3>
                <p className="text-black text-sm leading-relaxed">
                  We replace petroleum-based synthetics with natural alternatives wherever we can. Like using wool, tree fiber, and sugarcane. They're soft, breathable, and better for the planet—win, win, win.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
