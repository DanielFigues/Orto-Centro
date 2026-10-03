import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import type { ProductInput } from '../../services/api'
import type { Product } from '../../types/product'
import { Icon } from '../ui/Icon'

interface ProductFormProps {
  product?: Product | null
  products?: Product[]
  onSubmit: (input: ProductInput) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
  submittingLabel?: string
}

interface FormState {
  name: string
  category: string
  categoryCustom: string
  subcategory: string
  subcategoryCustom: string
  brand: string
  brandCustom: string
  sizes: string
  sizesCustom: string
  description: string
  imageUrl: string
  imageFile1: File | null
  imageUrl2: string
  imageFile2: File | null
  imageUrl3: string
  imageFile3: File | null
  isActive: boolean
}

const EMPTY_FORM: FormState = {
  name: '',
  category: '',
  categoryCustom: '',
  subcategory: '',
  subcategoryCustom: '',
  brand: '',
  brandCustom: '',
  sizes: '',
  sizesCustom: '',
  description: '',
  imageUrl: '',
  imageFile1: null,
  imageUrl2: '',
  imageFile2: null,
  imageUrl3: '',
  imageFile3: null,
  isActive: true,
}

const FIELD_CLASS =
  'rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-sm'

const LABEL_CLASS = 'text-sm font-semibold text-slate-700'

function uniqueSorted(items: (string | undefined)[]): string[] {
  const set = new Set<string>()
  for (const item of items) {
    if (item && item.trim() !== '') {
      set.add(item.trim())
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

function getPreviewUrl(file: File | null, url: string): string {
  if (file) return URL.createObjectURL(file)
  if (url.trim() !== '') return url.trim()
  return ''
}

export function ProductForm({
  product,
  products = [],
  onSubmit,
  onCancel,
  submitLabel = 'Adicionar produto',
  submittingLabel = 'Adicionando...',
}: ProductFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const categories = useMemo(() => uniqueSorted(products.map((p) => p.category)), [products])
  const subcategories = useMemo(() => uniqueSorted(products.map((p) => p.subcategory)), [products])
  const brands = useMemo(() => uniqueSorted(products.map((p) => p.brand)), [products])
  const sizesOptions = useMemo(() => {
    const all = products.flatMap((p) => p.sizes?.split(',') || [])
    return uniqueSorted(all.map((s) => s.trim()))
  }, [products])

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        category: product.category || '',
        categoryCustom: '',
        subcategory: product.subcategory || '',
        subcategoryCustom: '',
        brand: product.brand || '',
        brandCustom: '',
        sizes: product.sizes || '',
        sizesCustom: '',
        description: product.description || '',
        imageUrl: product.image_url || '',
        imageFile1: null,
        imageUrl2: product.image_url_2 || '',
        imageFile2: null,
        imageUrl3: product.image_url_3 || '',
        imageFile3: null,
        isActive: product.is_active,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [product])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileChange = (field: 'imageFile1' | 'imageFile2' | 'imageFile3') => (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      update(field, file)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const category = form.category === 'Adicionar nova...' ? form.categoryCustom.trim() : form.category.trim()
    const subcategory = form.subcategory === 'Adicionar nova...' ? form.subcategoryCustom.trim() : form.subcategory.trim()
    const brand = form.brand === 'Adicionar nova...' ? form.brandCustom.trim() : form.brand.trim()
    const sizes = form.sizes === 'Adicionar nova...' ? form.sizesCustom.trim() : form.sizes.trim()

    const input: ProductInput = {
      name: form.name.trim(),
      category,
      is_active: form.isActive,
    }

    if (subcategory !== '') input.subcategory = subcategory
    if (brand !== '') input.brand = brand
    if (sizes !== '') input.sizes = sizes
    if (form.description.trim() !== '') input.description = form.description.trim()

    if (form.imageFile1) input.image_url = form.imageFile1
    else if (form.imageUrl.trim() !== '') input.image_url = form.imageUrl.trim()

    if (form.imageFile2) input.image_url_2 = form.imageFile2
    else if (form.imageUrl2.trim() !== '') input.image_url_2 = form.imageUrl2.trim()

    if (form.imageFile3) input.image_url_3 = form.imageFile3
    else if (form.imageUrl3.trim() !== '') input.image_url_3 = form.imageUrl3.trim()

    setSubmitting(true)
    try {
      await onSubmit(input)
      if (!product) {
        setForm(EMPTY_FORM)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-2">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-1.5 md:col-span-2">
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
          <select
            required
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className={FIELD_CLASS}
          >
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="Adicionar nova...">Adicionar nova...</option>
          </select>
          {form.category === 'Adicionar nova...' && (
            <input
              type="text"
              required
              value={form.categoryCustom}
              onChange={(e) => update('categoryCustom', e.target.value)}
              placeholder="Nova categoria"
              className={`${FIELD_CLASS} mt-2`}
            />
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>Subcategoria</span>
          <select
            value={form.subcategory}
            onChange={(e) => update('subcategory', e.target.value)}
            className={FIELD_CLASS}
          >
            <option value="">Selecione...</option>
            {subcategories.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="Adicionar nova...">Adicionar nova...</option>
          </select>
          {form.subcategory === 'Adicionar nova...' && (
            <input
              type="text"
              value={form.subcategoryCustom}
              onChange={(e) => update('subcategoryCustom', e.target.value)}
              placeholder="Nova subcategoria"
              className={`${FIELD_CLASS} mt-2`}
            />
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>Marca</span>
          <select
            value={form.brand}
            onChange={(e) => update('brand', e.target.value)}
            className={FIELD_CLASS}
          >
            <option value="">Selecione...</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
            <option value="Adicionar nova...">Adicionar nova...</option>
          </select>
          {form.brand === 'Adicionar nova...' && (
            <input
              type="text"
              value={form.brandCustom}
              onChange={(e) => update('brandCustom', e.target.value)}
              placeholder="Nova marca"
              className={`${FIELD_CLASS} mt-2`}
            />
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>Tamanhos</span>
          <select
            value={form.sizes}
            onChange={(e) => update('sizes', e.target.value)}
            className={FIELD_CLASS}
          >
            <option value="">Selecione...</option>
            {sizesOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="Adicionar nova...">Adicionar nova...</option>
          </select>
          {form.sizes === 'Adicionar nova...' && (
            <input
              type="text"
              value={form.sizesCustom}
              onChange={(e) => update('sizesCustom', e.target.value)}
              placeholder="Separado por vírgulas (Ex.: P,M,G,GG)"
              className={`${FIELD_CLASS} mt-2`}
            />
          )}
        </label>

        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className={LABEL_CLASS}>Descrição</span>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Descrição detalhada do produto"
            className={FIELD_CLASS}
          />
        </label>
      </div>

      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <span className={LABEL_CLASS}>URL da Imagem 1</span>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              placeholder="https://..."
              className={FIELD_CLASS}
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
              <span>Selecionar Imagem...</span>
              <input type="file" accept="image/*" hidden onChange={handleFileChange('imageFile1')} />
            </label>
            {getPreviewUrl(form.imageFile1, form.imageUrl) && (
              <div className="mt-3 flex flex-col items-start gap-2">
                <img
                  src={getPreviewUrl(form.imageFile1, form.imageUrl)}
                  alt="Pré-visualização imagem 1"
                  className="h-48 w-auto max-w-full rounded-xl border border-slate-200 object-contain bg-white/50 shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className={LABEL_CLASS}>URL da Imagem 2 (opcional)</span>
            <input
              type="url"
              value={form.imageUrl2}
              onChange={(e) => update('imageUrl2', e.target.value)}
              placeholder="https://..."
              className={FIELD_CLASS}
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
              <span>Selecionar Imagem...</span>
              <input type="file" accept="image/*" hidden onChange={handleFileChange('imageFile2')} />
            </label>
            {getPreviewUrl(form.imageFile2, form.imageUrl2) && (
              <div className="mt-3 flex flex-col items-start gap-2">
                <img
                  src={getPreviewUrl(form.imageFile2, form.imageUrl2)}
                  alt="Pré-visualização imagem 2"
                  className="h-48 w-auto max-w-full rounded-xl border border-slate-200 object-contain bg-white/50 shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <span className={LABEL_CLASS}>URL da Imagem 3 (opcional)</span>
            <input
              type="url"
              value={form.imageUrl3}
              onChange={(e) => update('imageUrl3', e.target.value)}
              placeholder="https://..."
              className={FIELD_CLASS}
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
              <span>Selecionar Imagem...</span>
              <input type="file" accept="image/*" hidden onChange={handleFileChange('imageFile3')} />
            </label>
            {getPreviewUrl(form.imageFile3, form.imageUrl3) && (
              <div className="mt-3 flex flex-col items-start gap-2">
                <img
                  src={getPreviewUrl(form.imageFile3, form.imageUrl3)}
                  alt="Pré-visualização imagem 3"
                  className="h-48 w-auto max-w-full rounded-xl border border-slate-200 object-contain bg-white/50 shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => update('isActive', e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
        />
        Ativo (visível no site)
      </label>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 transition-all hover:-translate-y-0.5 hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              {submittingLabel}
            </>
          ) : (
            <>
              <Icon name="plus" className="h-4 w-4" />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
