'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductImageGallery } from './product-image-gallery'
import { ProductPurchasePanel } from './product-purchase-panel'
import { checkVariantStock } from '@/lib/storefront-data'

/**
 * Inner component that uses hooks
 * Wrapped in Suspense to handle useSearchParams
 */
function ProductDetailContent({ product }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get color from URL query, fallback to first color
  const urlColor = searchParams.get('color')
  const [selectedColor, setSelectedColor] = useState(
    urlColor || product.colors?.[0] || ''
  )
  const [selectedSize, setSelectedSize] = useState('')
  const [stockStatus, setStockStatus] = useState({
    isInStock: true,
    quantity: 0,
    sku: '',
    product_id: product.id,
    color_name: selectedColor,
    size_label: '',
  })
  const [isCheckingStock, setIsCheckingStock] = useState(false)

  /**
   * Handle color change - updates state and URL query parameter
   * Router.push with scroll: false prevents jumping to top
   */
  const handleColorChange = useCallback((newColor) => {
    setSelectedColor(newColor)
    // Update URL without full page reload
    router.push(`?color=${encodeURIComponent(newColor)}`, { scroll: false })
  }, [router])

  /**
   * Real-time stock validation
   * Triggers whenever color or size changes
   * Fetches from product_variants table to check inventory_qty
   */
  useEffect(() => {
    if (!selectedSize || !selectedColor) {
      setStockStatus({
        isInStock: true,
        quantity: 0,
        sku: '',
        product_id: product.id,
        color_name: selectedColor,
        size_label: selectedSize,
      })
      return
    }

    setIsCheckingStock(true)

    checkVariantStock(product.id, selectedColor, selectedSize)
      .then((result) => {
        setStockStatus(result)
      })
      .catch((err) => {
        console.error('Stock check failed:', err)
        // Fallback to assuming in stock if check fails
        setStockStatus({
          isInStock: true,
          quantity: 0,
          sku: '',
          product_id: product.id,
          color_name: selectedColor,
          size_label: selectedSize,
        })
      })
      .finally(() => setIsCheckingStock(false))
  }, [selectedColor, selectedSize, product.id])

  return (
    <>
      <ProductImageGallery 
        product={product} 
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
      />
      <ProductPurchasePanel 
        product={product}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        stockStatus={stockStatus}
        isCheckingStock={isCheckingStock}
      />
    </>
  )
}

/**
 * ProductDetailWrapper
 * Server-safe wrapper that defers hook usage to client component
 * Uses Suspense to handle useSearchParams safely
 */
export function ProductDetailWrapper({ product }) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent product={product} />
    </Suspense>
  )
}

/**
 * Simple loading skeleton while suspense resolves
 */
function ProductDetailSkeleton() {
  return (
    <>
      <div className="animate-pulse">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="aspect-[4/5] bg-gray-200 sm:col-span-2 rounded" />
          <div className="aspect-[4/5] bg-gray-200 rounded" />
          <div className="aspect-[4/5] bg-gray-200 rounded" />
        </div>
      </div>
      <div className="lg:sticky lg:top-28">
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    </>
  )
}
