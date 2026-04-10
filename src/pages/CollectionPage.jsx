import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { ProductGrid } from '../components/products/ProductGrid'
import { ProductDetailModal } from '../components/products/ProductDetailModal'
import { CartDrawer } from '../components/cart/CartDrawer'

export function CollectionPage() {
  const { collectionName } = useParams()
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
  }, [collectionName])

  const filteredProducts = useMemo(() => {
    // If the collectionName is literal category, just filter it
    return products.filter((p) => p.category.toLowerCase() === decodeURIComponent(collectionName).toLowerCase())
  }, [products, collectionName])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onCartClick={() => setCartOpen(true)} />

      <main className="flex-1 bg-[#f5f4ef] py-16 sm:py-24">
        <div className="container-wide px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-semibold text-brand-900 mb-4 capitalize">
              {decodeURIComponent(collectionName)}
            </h1>
            <p className="text-lg text-brand-600 max-w-2xl mx-auto">
              Explore our {decodeURIComponent(collectionName)} collection
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8 text-center">
              {error}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && !error && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No products found in this collection yet.</p>
            </div>
          )}

          <ProductGrid
            products={filteredProducts}
            loading={loading}
            onProductClick={setSelectedProduct}
          />
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
