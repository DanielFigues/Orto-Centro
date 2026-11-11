import { type ReactNode, useEffect } from 'react'

interface ProductModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function ProductModal({ isOpen, title, onClose, children }: ProductModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 flex w-full max-w-6xl flex-col h-[90vh] overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <div className="mt-6 flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  )
}
