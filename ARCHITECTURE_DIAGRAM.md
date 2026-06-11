# Product Variant Color System - Architecture Diagrams

## Current Architecture (Problematic)

```
BACKEND (Supabase)
├── products table
│   ├── id, title, price
│   ├── colors: ["Maroon", "Dark Blue", "Dark Green"]
│   ├── variants: [
│   │   { color: "Maroon", images: [...] },
│   │   { color: "Dark Blue", images: [...] },
│   │   { color: "Dark Green", images: [...] }
│   │]
│   └── NO color_code field ❌
│
↓ Data Flows Through
│
NORMALIZATION (storefront-data.js)
├── normalizeProduct()
├── extracts colors from 4 sources
└── Returns product with colors array
   └── NO color_code metadata ❌
│
↓ Component Receives
│
UI RENDERING (product-variant-gallery.jsx)
├── For each color: "Dark Green"
│   ├── getColorHex("Dark Green")  ← Lookup in hardcoded map
│   ├── colorMap lookup...
│   ├── Not found in map ❌
│   └── Fallback: "#e5e7eb" (GREY) 🔴
│
└── Result: Color buttons with wrong colors!
```

## Data Flow Issues

```
                BACKEND
                  |
                  | colors: ["Maroon", "Dark Green"]
                  ↓
            NORMALIZATION
                  |
                  | Returns same color names
                  ↓
            PRODUCT PAGE CLIENT
                  |
                  | useState(selectedColor="Dark Green")
                  ↓
            VARIANT GALLERY
                  |
                  | getColorHex("Dark Green")
                  |    ↓
                  | colorMap[key] → undefined
                  |    ↓
                  | return "#e5e7eb" (grey fallback)
                  |
                  ↓
            COLOR SWATCH
                  |
                  └─→ Display grey instead of green 🔴
```

## Component Dependency Graph

```
PRODUCT PAGE (src/app/products/[slug]/page.jsx)
    ├── ProductPageClient (product-page-client.jsx) ⚠️ Multiple renders
    │   ├── ProductVariantGallery (product-variant-gallery.jsx)
    │   │   ├── getProductVariantColors() ← Expensive scan ⚠️
    │   │   ├── getProductVariantImages() ← No memoization ⚠️
    │   │   ├── getColorHex() ← Hardcoded map ❌
    │   │   └── No image preloading ❌
    │   │
    │   └── ProductPurchasePanel (product-purchase-panel.jsx)
    │       ├── useCart() → cart-context.jsx
    │       ├── Stores color as string ⚠️
    │       └── No variant ID ❌
    │
    └── Related Products Section
        └── ProductGrid → ProductCard
```

## State Management Flow

```
CART CONTEXT (cart-context.jsx)
    ├── items: [
    │   {
    │     id: "123-S-Dark Green-1234567890",
    │     productId: 123,
    │     size: "S",
    │     color: "Dark Green",  ← String, not ID ⚠️
    │     price: 2999,
    │     imageUrl: "url/dark-green.jpg",
    │     quantity: 1
    │   }
    │]
    │
    ├── localStorage persistence ✅
    ├── Merges duplicate items ✅
    └── No backend verification ❌
```

## Image Loading Flow

```
USER CLICKS "Dark Blue" COLOR BUTTON
    ↓
State updates: selectedColor = "Dark Blue"
    ↓
Component re-renders
    ↓
getProductVariantImages(product, "Dark Blue")
    ├── Scans product.variants[] (O(n) operation) ⚠️
    ├── Finds matching color
    ├── Returns image URLs
    └── No preloading ❌
    ↓
Images load reactively
    ├── Network request initiated
    ├── Image loading... (delay)
    └── Flicker on display 🔴
    ↓
Gallery displays new images
```

## Color Hex Lookup (Current - PROBLEMATIC)

```
ColorName Input: "Dark Green"
    ↓
normalizeColorName: "dark green"
    ↓
colorMap lookup:
    {
        'red': '#dc2626',
        'blue': '#2563eb',
        'maroon': '#800000',  ← Found ✅
        'dark green': ← NOT FOUND ❌
    }
    ↓
Fallback: '#e5e7eb' (grey)
    ↓
Result: Grey swatch instead of green 🔴
```

---

# PROPOSED SOLUTION ARCHITECTURE

## New Data Flow (Fixed)

```
BACKEND (Supabase) - ENHANCED SCHEMA
├── products table
│   ├── id, title, price
│   ├── colors: ["Maroon", "Dark Blue", "Dark Green"]
│   └── variants: [
│       {
│         id: 101,
│         color: "Maroon",
│         color_code: "#800000",  ← ✅ ADDED
│         sku: "ABC-001",
│         stock: 10,
│         images: ["maroon1.jpg", "maroon2.jpg"],
│         image_urls: [...]  ← Alternative format
│       },
│       {
│         id: 102,
│         color: "Dark Green",
│         color_code: "#006400",  ← ✅ ADDED
│         sku: "ABC-002",
│         stock: 5,
│         images: ["green1.jpg", "green2.jpg"]
│       }
│     ]
│
↓ Enhanced Data Flows Through
│
NORMALIZATION (storefront-data.js) - ENHANCED
├── normalizeProduct()
├── Validates color_code format
├── Creates color → variant ID map
├── Caches variant metadata
└── Returns enriched product ✅
│
↓ Enriched Component Receives
│
UI RENDERING (product-variant-gallery.jsx) - OPTIMIZED
├── For each variant (not just color string):
│   ├── variant = {
│   │   id: 102,
│   │   color: "Dark Green",
│   │   color_code: "#006400"  ← Use directly!
│   │}
│   ├── swatch backgroundColor = variant.color_code ✅
│   ├── Render with correct color
│   └── Preload images for this variant ✅
│
└── Result: All colors render correctly! ✅
```

## Proposed Component Architecture

```
PRODUCT PAGE
    ├── ProductPageClient
    │   ├── useProductVariants() ← New hook, memoized
    │   ├── useColorVariant(selectedColor) ← New hook
    │   ├── useImagePreloader() ← New hook
    │   │
    │   ├── ProductVariantGallery (ENHANCED)
    │   │   ├── Use backend color_code
    │   │   ├── Preload all variant images
    │   │   ├── Cache images in memory
    │   │   ├── Keyboard navigation ✅
    │   │   ├── Accessibility labels ✅
    │   │   └── Stock display per color ✅
    │   │
    │   └── ProductPurchasePanel (ENHANCED)
    │       ├── Store variantId instead of color
    │       ├── Display SKU per variant
    │       ├── Show stock per variant
    │       ├── Validate variant exists
    │       └── Error handling ✅
    │
    └── Related Products
```

## Proposed State Management

```
PRODUCT PAGE CLIENT STATE (Enhanced)
{
  selectedVariantId: 102,
  
  variantMap: {
    102: {
      id: 102,
      color: "Dark Green",
      color_code: "#006400",
      sku: "ABC-002",
      stock: 5,
      images: ["green1.jpg", "green2.jpg"]
    },
    101: { ... }
  },
  
  imageCache: {
    102: [preloaded Image objects],
    101: [preloaded Image objects]
  },
  
  selectedColor: "Dark Green"  ← Computed from variantId
}
```

## Image Preloading Strategy

```
PAGE LOAD
    ↓
ProductPageClient mounts
    ├── Get all variants for product
    ├── Create preload queue
    └── useImagePreloader() hook
        ├── For each variant:
        │   ├── Create <img> elements (hidden)
        │   ├── Set src to variant images
        │   └── Listen for load/error
        ├── Store in cache when ready
        ├── Show loading indicators
        └── Cache hits logged ✅
    ↓
USER CLICKS "Dark Green" COLOR
    ├── Update selectedVariantId state
    ├── Look up in imageCache
    ├── Images already loaded ✅
    ├── Display instantly (NO FLICKER)
    └── Log cache hit rate ✅
```

## Cart Integration (Enhanced)

```
CART ITEM STRUCTURE (Improved)
{
  id: "102-S-1234567890",  ← Variant ID based
  productId: 123,
  variantId: 102,  ← ✅ ADDED for verification
  slug: "nighty",
  title: "Nighty",
  price: 2999,
  
  imageUrl: "green.jpg",
  
  size: "S",
  color: "Dark Green",  ← For display
  
  sku: "ABC-002",  ← ✅ From variant
  stock_at_add: 5,  ← ✅ Validate later
  
  quantity: 1
}

BEFORE CHECKOUT
├── Validate variantId exists
├── Verify color_code matches
├── Check stock hasn't changed
└── Send to backend for confirmation ✅
```

## Error Handling Flow

```
GET COLOR CODE for variant
    ├── colorCode = variant.color_code
    ├── Is colorCode valid hex? (#RRGGBB)
    │   ├── YES → Use it ✅
    │   └── NO → FALLBACK CHAIN:
    │       1. Try getColorHex(colorName)
    │       2. Try extractColorFromImages()
    │       3. Fallback to '#e5e7eb'
    │       4. Log error
    │       5. Alert developer
    │
    └── ALWAYS return hex string (never crash)
```

## Performance Optimization Flow

```
OPTIMIZATION STRATEGIES
│
├── 1. MEMOIZATION
│   ├── useMemo(getProductVariantColors())
│   ├── useMemo(variant metadata)
│   └── Prevents recalculation
│
├── 2. IMAGE PRELOADING
│   ├── On mount: preloadAllVariantImages()
│   ├── Store in imageCache
│   ├── Instant display on selection
│   └── Eliminate flickering
│
├── 3. CACHING
│   ├── In-memory variant metadata cache
│   ├── Image blob cache
│   ├── Browser cache headers
│   └── localStorage for color selection
│
├── 4. CODE SPLITTING
│   ├── Lazy load non-critical images
│   ├── Defer image preloading if slow
│   └── Progressive enhancement
│
└── 5. METRICS
    ├── Track image load times
    ├── Cache hit/miss rates
    ├── Color code fallback frequency
    ├── Accessibility usage
    └── Monitor via console logs
```

---

## File Modification Map

```
EXISTING FILES TO MODIFY
│
├── src/lib/storefront-data.js
│   ├── Add color_code validation
│   ├── Create variant metadata cache
│   └── Map colors to variant IDs
│
├── src/lib/format.js
│   ├── Remove hardcoded getColorHex()
│   ├── Add getColorCodeFromVariant()
│   ├── Add validateColorCode()
│   ├── Add image preloading utilities
│   └── Add color normalization helpers
│
├── src/components/storefront/product-page-client.jsx
│   ├── Add useVariantMetadata() hook
│   ├── Add useImagePreloader() hook
│   ├── Memoize color lookups
│   └── Preload images on mount
│
├── src/components/storefront/product-variant-gallery.jsx
│   ├── Use backend color_code directly
│   ├── Preload variant images
│   ├── Cache images in state
│   ├── Add per-color stock display
│   ├── Add keyboard navigation
│   ├── Add accessibility labels
│   └── Add error state UI
│
├── src/components/storefront/product-purchase-panel.jsx
│   ├── Store variantId in cart
│   ├── Display SKU from variant
│   ├── Show stock per variant
│   ├── Validate variant before add
│   └── Error handling for invalid variants
│
├── src/components/storefront/cart-context.jsx
│   ├── Add variantId to cart item
│   ├── Add variant metadata
│   ├── Validate on add
│   └── Verify on checkout
│
└── src/components/storefront/cart-drawer.jsx
    ├── Display SKU in cart item
    ├── Show variant metadata
    └── Verify variant before WhatsApp

NEW FILES TO CREATE
│
├── src/lib/image-cache.js
│   ├── Preload image URLs
│   ├── Cache management
│   ├── Load tracking
│   └── Error handling
│
└── src/lib/color-validation.js
    ├── Validate hex format
    ├── Fallback detection
    ├── Error logging
    └── Metrics tracking
```

---

## Deployment Timeline

```
WEEK 1: BACKEND PREPARATION
├── Day 1: Analyze current Supabase schema
├── Day 2: Design color_code field structure
├── Day 3: Add color_code to variants table
└── Day 4: Backfill existing data with color codes

WEEK 2: FRONTEND DATA LAYER
├── Day 1: Implement storefront-data.js changes
├── Day 2: Implement format.js utilities
├── Day 3: Add color validation
└── Day 4: Testing data layer in isolation

WEEK 3: FRONTEND COMPONENTS
├── Day 1: Refactor product-page-client.jsx
├── Day 2: Refactor product-variant-gallery.jsx
├── Day 3: Refactor product-purchase-panel.jsx
└── Day 4: Image preloading implementation

WEEK 4: INTEGRATION & TESTING
├── Day 1: End-to-end testing
├── Day 2: Edge case testing
├── Day 3: Performance testing
├── Day 4: QA + deployment prep

WEEK 5: DEPLOYMENT
├── Day 1: Staging deployment
├── Day 2: Monitoring + adjustments
├── Day 3: Production deployment
└── Day 4: Post-deployment monitoring
```

---

## Success Criteria

```
✓ All color variants display with correct colors
✓ New backend colors render without frontend code changes
✓ No grey swatches for unmapped colors
✓ Image switching is instant (< 100ms)
✓ No flickering on color change
✓ Images preload on page load
✓ Cache hit rate > 95%
✓ Keyboard navigation works
✓ Accessibility score improves
✓ Error rate < 0.1%
✓ Zero hardcoded colors in UI
✓ Backward compatible with old data
```

