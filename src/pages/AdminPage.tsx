import { useCallback, useState } from 'react'
import { AdminDashboard } from '../components/admin/AdminDashboard'
import { AdminGate } from '../components/admin/AdminGate'
import { ToastProvider } from '../components/admin/Toaster'

const UNLOCKED_KEY = 'admin-unlocked'

export function AdminPage() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(UNLOCKED_KEY) === 'yes',
  )

  const handleUnlock = useCallback(() => {
    sessionStorage.setItem(UNLOCKED_KEY, 'yes')
    setUnlocked(true)
  }, [])

  const handleLock = useCallback(() => {
    sessionStorage.removeItem(UNLOCKED_KEY)
    setUnlocked(false)
  }, [])

  return (
    <ToastProvider>
      <div className="min-h-svh px-4 py-10 sm:px-6">
        {unlocked ? <AdminDashboard onLock={handleLock} /> : <AdminGate onUnlock={handleUnlock} />}
      </div>
    </ToastProvider>
  )
}