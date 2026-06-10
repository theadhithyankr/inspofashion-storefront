'use client'

import { useMemo, useState } from 'react'
import { getProductVariantColors } from '@/lib/format'
import { ProductPurchasePanel } from './product-purchase-panel'
import { ProductVariantGallery } from './product-variant-gallery'

export function ProductPageClient({ product }) {
  const defaultColor = useMemo(() => product.colors?.[0] || getProductVariantColors(product)?.[0] || '', [product])
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