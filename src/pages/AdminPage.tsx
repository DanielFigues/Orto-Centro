import { useCallback, useEffect, useState } from 'react'
import { AdminDashboard } from '../components/admin/AdminDashboard'
import { AdminGate } from '../components/admin/AdminGate'
import { ToastProvider } from '../components/admin/Toaster'
import { clearToken, readToken, saveToken } from '../lib/adminSession'
import { ApiError, listAllProducts } from '../services/api'

type SessionStatus = 'validating' | 'authenticated' | 'anonymous'

interface Session {
  token: string
  status: SessionStatus
}

const ANONYMOUS: Session = { token: '', status: 'anonymous' }

export function AdminPage() {
  const [session, setSession] = useState<Session>(() => {
    const stored = readToken()
    return {
      token: stored,
      status: stored === '' ? 'anonymous' : 'validating',
    }
  })

  useEffect(() => {
    if (session.status !== 'validating') {
      return
    }

    let cancelled = false

    listAllProducts(session.token)
      .then(() => {
        if (!cancelled) {
          setSession((current) =>
            current.status === 'validating'
              ? { token: current.token, status: 'authenticated' }
              : current,
          )
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return
        }
        if (error instanceof ApiError && error.status === 401) {
          clearToken()
        }
        setSession(ANONYMOUS)
      })

    return () => {
      cancelled = true
    }
  }, [session.status, session.token])

  const handleUnlock = useCallback((token: string) => {
    saveToken(token)
    setSession({ token, status: 'authenticated' })
  }, [])

  const handleLock = useCallback(() => {
    clearToken()
    setSession(ANONYMOUS)
  }, [])

  return (
    <ToastProvider>
      <div className="min-h-svh bg-gray-50 px-4 py-10 sm:px-6">
        {session.status === 'validating' ? (
          <div className="flex min-h-[60svh] items-center justify-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-600" />
            Validando sessão...
          </div>
        ) : session.status === 'authenticated' ? (
          <AdminDashboard token={session.token} onLock={handleLock} />
        ) : (
          <AdminGate onUnlock={handleUnlock} />
        )}
      </div>
    </ToastProvider>
  )
}
