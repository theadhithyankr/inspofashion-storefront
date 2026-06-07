# Color Swatch Variant Dynamic Mapping - Implementation Guide

## 🎯 Overview

This implementation provides a premium color variant selector for the product detail page with:
- **URL Query Parameter Syncing** - `/products/frock-nighty?color=maroon`
- **Real-time Stock Validation** - Prevents purchases of out-of-stock variants
- **Dynamic Image Switching** - Shows color-specific product images
- **Premium UI** - Active color swatch has ring offset with white dot indicator

---

## 📁 File Structure

### New Files Created
```
src/lib/types.ts                          # TypeScript interfaces for variants & stock
```

### Updated Files
```
src/lib/storefront-data.js                # New variant query functions
src/components/storefront/product-detail-wrapper.jsx     # URL routing & stock logic
src/components/storefront/product-image-gallery.jsx      # Enhanced color swatches
src/components/storefront/product-purchase-panel.jsx     # Stock validation UI
```

---

## 🔧 Key Features Implemented

### 1. TypeScript Interfaces (`src/lib/types.ts`)

Provides type safety for:
- **ProductVariant** - Color + Size + Stock combination
- **ProductColorImage** - Color-specific images
- **ProductWithVariants** - Enhanced product data
- **StockCheckResult** - Real-time stock validation result

### 2. Supabase Data Fetching (`src/lib/storefront-data.js`)

New exported functions:

#### `getProductBySlugWithVariants(slug)`
- Fetches product with all variants and color images
- Parallel queries for performance
- Returns: `ProductWithVariants` with variants array and colorImages array

#### `checkVariantStock(productId, colorName, sizeLabel)`
- Real-time stock check for specific color + size combination
- Returns: `StockCheckResult` with inventory quantity and SKU
- Called on every color/size selection change

#### `getColorAvailability(productId)`
- Gets all colors with available inventory
- Useful for greying out out-of-stock colors

#### `getSizeAvailability(productId, colorName)`
- Gets all sizes available for a specific color
- Called when color changes to update size options

### 3. URL Routing (`product-detail-wrapper.jsx`)

**URL Format:** `?color=maroon`

**Implementation:**
```javascript
// Read from URL
const urlColor = searchParams.get('color')

// Write to URL
router.push(`?color=${newColor}`, { scroll: false })
```

**Benefits:**
- Selected color persists on page refresh
- Shareable product links with color pre-selected
- Browser back/forward navigation works naturally

### 4. Real-time Stock Validation

**Flow:**
1. User selects color
2. URL updates: `?color=navy`
3. ProductDetailWrapper captures selection
4. When size is selected, `checkVariantStock()` is called
5. Stock status returned from `product_variants` table
6. If `inventory_qty === 0`:
   - "Out of Stock" button appears
   - "Add to Bag" button is disabled
   - Error message shows: "Sorry, Navy in size M is out of stock"

### 5. Premium Color Swatch UI

**Active State:**
```css
/* Selected color has premium look */
border-black 
ring-2 ring-offset-2 ring-black 
shadow-sm
white dot in center
```

**Out of Stock:**
```css
opacity-40
diagonal strikethrough
cursor-not-allowed
disabled on click
```

---

## 🗄️ Required Supabase Tables

### `product_variants` table
```sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  color_name VARCHAR NOT NULL,           -- e.g., "Maroon", "Navy"
  size_label VARCHAR NOT NULL,           -- e.g., "S", "M", "L", "XL"
  sku VARCHAR NOT NULL UNIQUE,           -- e.g., "FROCK-MAROON-S"
  inventory_qty INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2),                   -- Optional per-variant price
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_color ON product_variants(color_name);
```

### `product_images` table
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  color_name VARCHAR NOT NULL,           -- Links to color_name in variants
  image_url VARCHAR NOT NULL,            -- Supabase Storage URL
  display_order INTEGER DEFAULT 1,       -- 1 = hero image, 2+ = gallery
  created_at TIMESTAMP DEFAULT now()
);

-- Indexes
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_color ON product_images(color_name);
```

---

## 🎨 Design Tokens Used

### Color Swatches
- **Not Selected**: `border-brand-200 hover:border-brand-900`
- **Selected**: `border-black ring-2 ring-offset-2 ring-black shadow-sm`
- **Out of Stock**: `border-gray-300 opacity-40`

### Size Selector
- **Not Selected**: `border-brand-200 bg-white text-brand-900 hover:border-black`
- **Selected**: `border-black bg-black text-white`

### Add-to-Bag Button
- **Enabled**: `bg-black hover:bg-gray-900`
- **Checking Stock**: `bg-gray-400 cursor-not-allowed opacity-70`
- **Out of Stock**: `bg-gray-400 cursor-not-allowed`

---

## 🚀 Usage Flow

### User Perspective

1. **Visit Product Page**
   - Page loads with first color selected by default
   - All color swatches display with availability status

2. **Click Color Swatch**
   - URL updates to `?color=maroon` (no page reload)
   - Gallery images change to maroon-specific photos
   - Images fade smoothly (300ms transition)
   - Size selector updates to show available sizes for maroon

3. **Select Size**
   - Real-time stock check runs
   - "In stock" badge appears if available
   - "Add to Bag" button enables/disables based on stock

4. **Add to Cart**
   - If stock available: adds product to cart
   - If out of stock: shows error message with specific variant

### Developer Perspective

```javascript
// In ProductDetailWrapper
const handleColorChange = (newColor) => {
  setSelectedColor(newColor)
  // URL syncs automatically
  router.push(`?color=${encodeURIComponent(newColor)}`)
}

// Stock check runs automatically via useEffect
useEffect(() => {
  if (selectedSize && selectedColor) {
    checkVariantStock(product.id, selectedColor, selectedSize)
      .then(setStockStatus)
  }
}, [selectedColor, selectedSize])
```

---

## 🔄 Data Flow Diagram

```
ProductDetailWrapper (SSR Safe with Suspense)
    ↓
    ├─→ ProductImageGallery
    │   ├─ Gets color from selectedColor prop
    │   ├─ Finds matching colorImages from product_images table
    │   ├─ Shows color swatches with availability
    │   └─ On click → calls onColorChange(newColor)
    │
    └─→ ProductPurchasePanel
        ├─ Gets selectedColor & stockStatus props
        ├─ Displays sizes with real-time availability
        ├─ Shows stock quantity from checkVariantStock()
        └─ Disables add-to-cart if !stockStatus.isInStock
        
URL State
    ↓
router.push(`?color=${newColor}`)
    ↓
searchParams.get('color') → re-renders gallery with new images
```

---

## ⚠️ Important Notes

### Server-Side Rendering (SSR) Safety
- `ProductDetailWrapper` uses Suspense boundary
- `useSearchParams()` is only called in client component
- Prevents "useSearchParams() should be wrapped in suspense boundary" error

### Performance
- All Supabase queries use parallel execution with `Promise.all()`
- `useMemo` prevents unnecessary re-renders
- Color change debouncing: handled via URL router
- Stock check only runs when both color AND size are selected

### Fallbacks
- If `product_images` table has no color-specific images, uses main `product.images`
- If stock check fails, assumes product is in stock (safe fallback)
- If no variants exist, falls back to legacy `product.colors` array

---

## 🧪 Testing Checklist

- [ ] Color swatch click updates URL to `?color=maroon`
- [ ] Page refresh preserves selected color from URL
- [ ] Gallery images change when color swatch clicked
- [ ] Image fade transition plays (300ms)
- [ ] Size selector updates based on selected color
- [ ] Stock badge shows correct quantity
- [ ] "Out of Stock" button appears when inventory_qty = 0
- [ ] Size selector disabled for out-of-stock colors
- [ ] Add-to-Bag button shows "Checking stock..." while validating
- [ ] Error message shows when variant is out of stock
- [ ] Mobile responsive: color swatches display correctly
- [ ] Desktop: ring offset active state displays correctly
- [ ] Browser back/forward navigation works with color in URL

---

## 🐛 Troubleshooting

### "useSearchParams() should be wrapped in suspense boundary"
**Solution:** Already fixed - ProductDetailWrapper uses Suspense boundary

### Stock check returns 0 for all variants
**Check:**
- [ ] `product_variants` table has data for this product
- [ ] Queries are filtering by correct `product_id`
- [ ] `inventory_qty` column has non-zero values

### Color images not showing
**Check:**
- [ ] `product_images` table has records for this product
- [ ] `color_name` values match variant `color_name` exactly (case-sensitive)
- [ ] `image_url` is valid Supabase Storage URL

### URL doesn't update on color click
**Check:**
- [ ] `onColorChange` callback is being called
- [ ] `router` object from `useRouter()` is available
- [ ] Browser console for any client-side errors

---

## 📚 Related Documentation

- **Next.js App Router:** https://nextjs.org/docs/app
- **Supabase JS Client:** https://supabase.com/docs/reference/javascript/latest
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Suspense:** https://react.dev/reference/react/Suspense

---

## 🎉 Implementation Complete!

All files have been created and updated. The build passes successfully. The system is ready for:
1. Supabase tables to be created with sample variant data
2. Testing in development environment
3. Deployment to Vercel

**Next Steps:**
1. Create `product_variants` and `product_images` tables in Supabase
2. Populate with sample data for testing
3. Test color selection flow
4. Monitor stock status in real-time
