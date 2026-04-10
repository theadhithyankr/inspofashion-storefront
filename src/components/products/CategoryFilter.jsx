export function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="mb-10 sm:mb-12">
      {/* Horizontal scrollable on mobile */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
        <button
          onClick={() => onSelect('All')}
          className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            selected === 'All'
              ? 'bg-brand-900 text-white'
              : 'bg-transparent text-brand-600 hover:text-brand-900 border border-brand-200 hover:border-brand-400'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selected === category
                ? 'bg-brand-900 text-white'
                : 'bg-transparent text-brand-600 hover:text-brand-900 border border-brand-200 hover:border-brand-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
