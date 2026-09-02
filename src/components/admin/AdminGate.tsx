import { useState, type FormEvent } from 'react'
import { ADMIN_TOKEN } from '../../lib/adminApi'
import { Icon } from '../ui/Icon'

interface AdminGateProps {
  onUnlock: () => void
}

export function AdminGate({ onUnlock }: AdminGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password === ADMIN_TOKEN) {
      setError('')
      onUnlock()
    } else {
      setPassword('')
      setError('Senha incorreta. Tente novamente.')
    }
  }

  return (
    <div className="mx-auto flex min-h-[60svh] max-w-md items-center">
      <div className="w-full rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
          <Icon name="lock" className="h-6 w-6" />
        </span>

        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Área administrativa
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Digite a senha para gerenciar o catálogo.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Senha
            </span>
            <input
              type="password"
              autoFocus
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              placeholder="••••••••"
              className="rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600"
            />
          </label>

          {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50"
          >
            Entrar
            <Icon name="arrow-right" className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}