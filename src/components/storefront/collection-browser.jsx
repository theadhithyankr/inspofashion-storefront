'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { ProductGrid } from './product-grid'

export function CollectionBrowser({ products }) {
  const [size, setSize] = useState('All')
  const [color, setColor] = useState('All')
  const [sort, setSort] = useState('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const sizes = useMemo(() => ['All', ...Array.from(new Set(products.flatMap((p) => p.sizes || []))).sort()], [products])
  const colors = useMemo(() => ['All', ...Array.from(new Set(products.flatMap((p) => p.colors || []))).sort()], [products])

  const filtered = useMemo(() => {
    const next = products
      .filter((product) => size === 'All' || product.sizes?.includes(size))
      .filter((product) => color === 'All' || product.colors?.includes(color))

    return next.sort((a, b) => {
      if (sort === 'price-low') return Number(a.price) - Number(b.price)
      if (sort === 'price-high') return Number(b.price) - Number(a.price)
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    })
  }, [products, size, color, sort])

  const controls = (
    <div className="space-y-6">
      <FilterGroup label="Size" options={sizes} value={size} onChange={setSize} />
      <FilterGroup label="Colour" options={colors} value={color} onChange={setColor} />
      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Sort</span>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full border border-brand-200 bg-white px-3 py-3">
          <option value="newest">Newest first</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </label>
    </div>
  )

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="text-sm text-brand-500">{filtered.length} pieces</p>
        <button className="flex items-center gap-2 border border-brand-200 px-4 py-2 text-sm font-semibold lg:hidden" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{controls}</aside>
        <ProductGrid products={filtered} priorityCount={4} />
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} aria-label="Close filters" />
          <div className="absolute bottom-0 left-0 right-0 bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X className="h-6 w-6" />
              </button>
            </div>
            {controls}
          </div>
        </div>
      )}
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
