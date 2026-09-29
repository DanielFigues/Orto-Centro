import { useState, type FormEvent } from 'react'
import type { ProductInput } from '../../services/api'
import { Icon } from '../ui/Icon'

interface ProductFormProps {
  onCreate: (input: ProductInput) => Promise<void>
}

interface FormState {
  name: string
  category: string
  subcategory: string
  imageUrl: string
  isActive: boolean
}

const EMPTY_FORM: FormState = {
  name: '',
  category: '',
  subcategory: '',
  imageUrl: '',
  isActive: true,
}

const FIELD_CLASS =
  'rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600'

const LABEL_CLASS = 'text-sm font-medium text-neutral-700 dark:text-neutral-300'

export function ProductForm({ onCreate }: ProductFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const input: ProductInput = {
      name: form.name.trim(),
      category: form.category.trim(),
      is_active: form.isActive,
    }

    const subcategory = form.subcategory.trim()
    if (subcategory !== '') {
      input.subcategory = subcategory
    }

    const imageUrl = form.imageUrl.trim()
    if (imageUrl !== '') {
      input.image_url = imageUrl
    }

    setSubmitting(true)
    try {
      await onCreate(input)
      setForm(EMPTY_FORM)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
          <Icon name="plus" className="h-4 w-4" />
        </span>
        Adicionar produto
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>Nome *</span>
          <input
            type="text"
            required
            maxLength={120}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Ex.: Cadeira de rodas leve"
            className={FIELD_CLASS}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>Categoria *</span>
          <input
            type="text"
            required
            maxLength={80}
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            placeholder="Ex.: Mobilidade"
            className={FIELD_CLASS}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>Subcategoria</span>
          <input
            type="text"
            maxLength={80}
            value={form.subcategory}
            onChange={(e) => update('subcategory', e.target.value)}
            placeholder="Ex.: Cadeiras de Rodas"
            className={FIELD_CLASS}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>URL da imagem</span>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => update('imageUrl', e.target.value)}
            placeholder="https://..."
            className={FIELD_CLASS}
          />
        </label>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => update('isActive', e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 accent-sky-600"
          />
          Ativo (visível no site)
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Adicionando...
            </>
          ) : (
            <>
              <Icon name="plus" className="h-4 w-4" />
              Adicionar
            </>
          )}
        </button>
      </form>
    </section>
  )
}
