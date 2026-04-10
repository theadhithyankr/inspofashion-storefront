import { useState, useEffect } from 'react'
import { productService } from '../services/productService'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getActiveProducts()
      setProducts(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  }
}
