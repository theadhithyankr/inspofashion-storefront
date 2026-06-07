'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { ProductGrid } from './product-grid'

export function CollectionBrowser({ products }) {
  const [category, setCategory] = useState('All')
  const [size, setSize] = useState('All')
  const [color, setColor] = useState('All')
  const [sort, setSort] = useState('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [expandedFilter, setExpandedFilter] = useState(null)

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort()], [products])
  const sizes = useMemo(() => ['All', ...Array.from(new Set(products.flatMap((p) => p.sizes || []))).sort()], [products])
  const colors = useMemo(() => ['All', ...Array.from(new Set(products.flatMap((p) => p.colors || []))).sort()], [products])

  const filtered = useMemo(() => {
    const next = products
      .filter((product) => category === 'All' || product.category === category)
      .filter((product) => size === 'All' || product.sizes?.includes(size))
      .filter((product) => color === 'All' || product.colors?.includes(color))

    return next.sort((a, b) => {
      if (sort === 'price-low') return Number(a.price) - Number(b.price)
      if (sort === 'price-high') return Number(b.price) - Number(a.price)
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    })
  }, [products, category, size, color, sort])

  const controls = (
    <div className="space-y-6">
      <FilterGroup label="Category" options={categories} value={category} onChange={setCategory} />
      <FilterGroup label="Size" options={sizes} value={size} onChange={setSize} />
      <ColorFilterGroup colors={colors} value={color} onChange={setColor} />
      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Sort</span>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full border border-brand-200 bg-white px-3 py-3 text-sm">
          <option value="newest">Newest first</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </label>
    </div>
  )

  return (
    <div>
      {/* Desktop view */}
      <div className="mb-8 hidden items-center justify-between gap-4 lg:flex">
        <p className="text-sm text-brand-500">{filtered.length} pieces</p>
      </div>

      <div className="hidden gap-10 lg:grid lg:grid-cols-[240px_1fr]">
        <aside className="lg:block">{controls}</aside>
        <ProductGrid products={filtered} priorityCount={4} />
      </div>

      {/* Mobile view with fixed filter bar */}
      <div className="lg:hidden">
        {/* Fixed filter bar at top */}
        <div className="sticky top-0 z-40 border-b border-brand-200 bg-white">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <p className="text-xs font-semibold text-brand-500">{filtered.length} pieces</p>
            <button 
              className="flex items-center gap-1 border border-brand-200 rounded px-3 py-2 text-xs font-semibold transition hover:bg-brand-50"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              <ChevronDown className={`h-3.5 w-3.5 transition ${filtersOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable compact filter options */}
          {filtersOpen && (
            <div className="border-t border-brand-200 bg-white px-4 py-3 space-y-3">
              <CompactFilterGroup 
                label="Category" 
                options={categories} 
                value={category} 
                onChange={setCategory}
                isExpanded={expandedFilter === 'category'}
                onToggle={() => setExpandedFilter(expandedFilter === 'category' ? null : 'category')}
              />
              <CompactFilterGroup 
                label="Size" 
                options={sizes} 
                value={size} 
                onChange={setSize}
                isExpanded={expandedFilter === 'size'}
                onToggle={() => setExpandedFilter(expandedFilter === 'size' ? null : 'size')}
              />
              <CompactFilterGroup 
                label="Colour" 
                options={colors} 
                value={color} 
                onChange={setColor}
                isExpanded={expandedFilter === 'color'}
                onToggle={() => setExpandedFilter(expandedFilter === 'color' ? null : 'color')}
              />
              <div>
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-brand-500">Sort</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full border border-brand-200 bg-white px-2 py-2 text-xs">
                    <option value="newest">Newest first</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                  </select>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Products grid */}
        <ProductGrid products={filtered} priorityCount={4} />
      </div>
    </div>
  )
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-brand-500">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`border px-3 py-2 text-sm ${value === option ? 'border-brand-900 bg-brand-900 text-white' : 'border-brand-200 bg-white text-brand-700'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorFilterGroup({ colors, value, onChange }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Colour</span>
      <div className="flex flex-wrap gap-2">
        {colors.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`border px-3 py-2 text-sm ${value === option ? 'border-brand-900 bg-brand-900 text-white' : 'border-brand-200 bg-white text-brand-700'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function CompactFilterGroup({ label, options, value, onChange, isExpanded, onToggle }) {
  return (
    <div className="border-b border-brand-100 pb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 hover:text-brand-900"
      >
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      {isExpanded && (
        <div className="flex flex-wrap gap-1 py-2">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`border text-xs px-2 py-1 rounded transition ${
                value === option 
                  ? 'border-brand-900 bg-brand-900 text-white' 
                  : 'border-brand-200 bg-white text-brand-700 hover:border-brand-900'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
