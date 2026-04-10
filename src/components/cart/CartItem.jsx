import { Minus, Plus, X } from 'lucide-react'

export function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex gap-4 py-6 border-b border-brand-100">
      {/* Image */}
      <div className="w-24 h-24 bg-warm-100 flex-shrink-0">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div className="pr-4">
            <h3 className="text-sm font-medium text-brand-900 mb-1">{item.title}</h3>
            <p className="text-sm text-brand-500">Size: {item.size}</p>
            {item.color && <p className="text-sm text-brand-500">Color: {item.color}</p>}
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-brand-400 hover:text-brand-600 transition-colors p-1 h-fit"
            aria-label="Remove item"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-brand-200">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-2 text-brand-600 hover:text-brand-900 hover:bg-brand-50 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm text-brand-900">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-2 text-brand-600 hover:text-brand-900 hover:bg-brand-50 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price */}
          <p className="text-sm font-medium text-brand-900">
            ₹{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
