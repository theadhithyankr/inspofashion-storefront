'use client'

import { useState } from 'react'
import { ProductImageGallery } from './product-image-gallery'
import { ProductPurchasePanel } from './product-purchase-panel'

export function ProductDetailWrapper({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '')

  return (
    <>
      <ProductImageGallery 
        product={product} 
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />
      <ProductPurchasePanel 
        product={product}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />
    </>
  )
}
