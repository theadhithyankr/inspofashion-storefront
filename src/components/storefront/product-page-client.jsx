'use client'

import { useMemo, useState } from 'react'
import { ProductPurchasePanel } from './product-purchase-panel'
import { ProductVariantGallery } from './product-variant-gallery'

export function ProductPageClient({ product }) {
  const defaultColor = useMemo(() => {
    // Prefer the first in-stock variant from the variantMap (real product_variants data).
    // Fall back to the first variant regardless of stock, then to product.colors[0].
    const variantEntries = Object.values(product.variantMap || {})
    if (variantEntries.length > 0) {
      const inStock = variantEntries.find((v) => v.stock > 0)
      return (inStock || variantEntries[0]).color
    }
    return product.colors?.[0] || ''
  }, [product])

  const [selectedColor, setSelectedColor] = useState(defaultColor)

  return (
    <>
      <ProductVariantGallery
        product={product}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />
      <ProductPurchasePanel
        product={product}
        selectedColor={selectedColor}
      />
    </>
  )
}