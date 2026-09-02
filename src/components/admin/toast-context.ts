import { createContext } from 'react'

export type ToastType = 'success' | 'error'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

export interface ToastContextValue {
  toast: (type: ToastType, message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)