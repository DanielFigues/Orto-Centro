import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Icon } from '../ui/Icon'
import { ToastContext, type Toast, type ToastType } from './toast-context'

const TOAST_DURATION_MS = 4200

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (type: ToastType, message: string) => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, type, message }])
      timers.current.add(setTimeout(() => dismiss(id), TOAST_DURATION_MS))
    },
    [dismiss],
  )

  useEffect(
    () => () => {
      timers.current.forEach((timer) => clearTimeout(timer))
      timers.current.clear()
    },
    [],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur ${
              t.type === 'success'
                ? 'border-emerald-200 bg-emerald-50/95 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/95 dark:text-emerald-200'
                : 'border-red-200 bg-red-50/95 text-red-800 dark:border-red-900 dark:bg-red-950/95 dark:text-red-200'
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
                t.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            >
              <Icon name={t.type === 'success' ? 'check' : 'x'} className="h-3 w-3" />
            </span>
            <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Fechar notificação"
              className="shrink-0 rounded p-0.5 transition-colors hover:opacity-70"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}