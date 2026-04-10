import { X } from 'lucide-react'
import { useEffect } from 'react'

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    full: 'max-w-6xl',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          className="fixed inset-0 bg-brand-900/60 transition-opacity"
          onClick={onClose}
        />

        <div className={`relative bg-white sm:rounded-none shadow-xl ${sizes[size]} w-full max-h-[100vh] sm:max-h-[90vh] flex flex-col`}>
          {/* Close button - always visible */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-brand-400 hover:text-brand-600 focus:outline-none p-2 bg-white/80 backdrop-blur-sm rounded-full"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {title && (
            <div className="px-6 py-4 border-b border-brand-100">
              <h2 className="text-xl font-semibold text-brand-900 pr-10">{title}</h2>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
