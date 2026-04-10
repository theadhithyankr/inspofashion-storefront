import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { ProductGrid } from '../components/products/ProductGrid'
import { ProductDetailModal } from '../components/products/ProductDetailModal'
import { CartDrawer } from '../components/cart/CartDrawer'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { products, loading, error } = useProducts()
  
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const handleOpenCart = () => setCartOpen(true)
    window.addEventListener('open-cart-checkout', handleOpenCart)
    return () => window.removeEventListener('open-cart-checkout', handleOpenCart)
  }, [])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [query])

  const filteredProducts = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    return products.filter((p) => 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }, [products, query])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onCartClick={() => setCartOpen(true)} />

      <main className="flex-1 bg-[#f5f4ef] py-16 sm:py-24">
        <div className="container-wide px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-semibold text-brand-900 mb-4">
              Search Results
            </h1>
            {query && (
              <p className="text-lg text-brand-600 max-w-2xl mx-auto">
                Shows results for "{query}"
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8 text-center">
              {error}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && query && !error && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No products found matching "{query}".</p>
            </div>
          )}

          {query ? (
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onProductClick={setSelectedProduct}
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">Please enter a search term.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onCartClick={() => setCartOpen(true)}
        />
      )}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
