import { useEffect, useMemo, useState, type FormEvent } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { categories as canonicalCategories } from '../../data/categories'
import type { ProductInput } from '../../services/api'
import type { Product } from '../../types/product'
import { ConfirmDialog } from './ConfirmDialog'
import { Icon } from '../ui/Icon'

interface ProductFormProps {
  product?: Product | null
  products?: Product[]
  onSubmit: (input: ProductInput) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
  submittingLabel?: string
}

interface TechnicalSpec {
  property: string
  value: string
}

interface FormState {
  name: string
  category: string
  categoryCustom: string
  subcategory: string
  subcategoryCustom: string
  brand: string
  brandCustom: string
  sizes: string[]
  shortDescription: string
  description: string
  imageUrl: string
  imageFile1: File | null
  imageUrl2: string
  imageFile2: File | null
  imageUrl3: string
  imageFile3: File | null
  specs: TechnicalSpec[]
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
  sizes: [],
  shortDescription: '',
  description: '',
  imageUrl: '',
  imageFile1: null,
  imageUrl2: '',
  imageFile2: null,
  imageUrl3: '',
  imageFile3: null,
  specs: [],
  isActive: true,
}

const PREDEFINED_SIZES = ['Único', 'PP', 'P', 'M', 'G', 'GG', 'XG']

type ImageFieldKey = 'imageUrl' | 'imageUrl2' | 'imageUrl3'

const IMAGE_FILE_FIELDS: Record<ImageFieldKey, 'imageFile1' | 'imageFile2' | 'imageFile3'> = {
  imageUrl: 'imageFile1',
  imageUrl2: 'imageFile2',
  imageUrl3: 'imageFile3',
}

const IMAGE_LABELS: Record<ImageFieldKey, string> = {
  imageUrl: 'Imagem 1',
  imageUrl2: 'Imagem 2',
  imageUrl3: 'Imagem 3',
}

function buildInitialForm(product: Product | null | undefined): FormState {
  if (!product) {
    return EMPTY_FORM
  }

  return {
    name: product.name || '',
    category: product.category || '',
    categoryCustom: '',
    subcategory: product.subcategory || '',
    subcategoryCustom: '',
    brand: product.brand || '',
    brandCustom: '',
    sizes: parseSizes(product.sizes),
    shortDescription: product.short_description || '',
    description: product.description || '',
    imageUrl: product.image_url || '',
    imageFile1: null,
    imageUrl2: product.image_url_2 || '',
    imageFile2: null,
    imageUrl3: product.image_url_3 || '',
    imageFile3: null,
    specs: parseSpecs(product.technical_specs),
    isActive: product.is_active,
  }
}

const FIELD_CLASS =
  'rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-sm'

const LABEL_CLASS = 'text-sm font-semibold text-slate-700'

const SECTION_TITLE_CLASS =
  'text-sm font-bold uppercase tracking-wide text-slate-500'

function uniqueSorted(items: (string | undefined)[]): string[] {
  const set = new Set<string>()
  for (const item of items) {
    if (item && item.trim() !== '') {
      set.add(item.trim())
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

function parseSizes(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
}

function parseSpecs(raw: string | undefined): TechnicalSpec[] {
  if (!raw || raw.trim() === '') return []

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((item): item is Record<string, unknown> =>
        typeof item === 'object' && item !== null,
      )
      .map((item) => ({
        property: typeof item.property === 'string' ? item.property.trim() : '',
        value: typeof item.value === 'string' ? item.value.trim() : '',
      }))
      .filter((spec) => spec.property !== '' || spec.value !== '')
  } catch {
    return []
  }
}

function useObjectUrl(file: File | null, url: string): string {
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  if (file) return objectUrl
  return url.trim()
}

interface ImageFieldProps {
  label: string
  preview: string
  url: string
  onUrlChange: (value: string) => void
  onFileChange: (file: File) => void
  onRemove: () => void
}

function ImageField({ label, preview, url, onUrlChange, onFileChange, onRemove }: ImageFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex min-h-7 items-center justify-between gap-2">
        <span className={LABEL_CLASS}>{label}</span>
        {preview !== '' && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            <Icon name="trash" className="h-3.5 w-3.5" />
            Remover
          </button>
        )}
      </div>

      <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
        {preview !== '' ? (
          <img
            src={preview}
            alt={`Pré-visualização de ${label}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="px-4 text-center text-sm text-slate-400">
            Nenhuma imagem
          </span>
        )}
      </div>

      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
        <Icon name="tools" className="h-4 w-4 text-slate-400" />
        Selecionar arquivo
        <input type="file" accept="image/*" hidden onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileChange(file)
        }} />
      </label>

      <input
        type="text"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://..."
        aria-label={`URL de ${label}`}
        className={FIELD_CLASS}
      />
    </div>
  )
}

export function ProductForm({
  product,
  products = [],
  onSubmit,
  onCancel,
  submitLabel = 'Adicionar produto',
  submittingLabel = 'Adicionando...',
}: ProductFormProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialForm(product))
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pendingImage, setPendingImage] = useState<ImageFieldKey | null>(null)
  const [pendingSpecIndex, setPendingSpecIndex] = useState<number | null>(null)

  const categories = useMemo(
    () =>
      uniqueSorted([
        ...canonicalCategories.map((category) => category.name),
        ...products.map((p) => p.category),
      ]),
    [products],
  )
  const subcategories = useMemo(() => {
    const selectedCategoryName =
      form.category === 'Adicionar nova...'
        ? form.categoryCustom.trim()
        : form.category.trim()
    const canonical = canonicalCategories.find(
      (category) => category.name === selectedCategoryName,
    )
    const fromCategory = canonical
      ? canonical.subcategories.map((subcategory) => subcategory.name)
      : []
    const fromProducts = products
      .filter((p) => selectedCategoryName === '' || p.category === selectedCategoryName)
      .map((p) => p.subcategory)
    return uniqueSorted([...fromCategory, ...fromProducts])
  }, [form.category, form.categoryCustom, products])
  const brands = useMemo(() => uniqueSorted(products.map((p) => p.brand)), [products])

  const sizeOptions = useMemo(() => {
    const extras = form.sizes.filter((s) => !PREDEFINED_SIZES.includes(s))
    return [...PREDEFINED_SIZES, ...extras]
  }, [form.sizes])

  const image1Preview = useObjectUrl(form.imageFile1, form.imageUrl)
  const image2Preview = useObjectUrl(form.imageFile2, form.imageUrl2)
  const image3Preview = useObjectUrl(form.imageFile3, form.imageUrl3)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleSize(size: string) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  function addSpec() {
    setForm((prev) => ({ ...prev, specs: [...prev.specs, { property: '', value: '' }] }))
  }

  function updateSpec(index: number, key: 'property' | 'value', value: string) {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.map((spec, i) => (i === index ? { ...spec, [key]: value } : spec)),
    }))
  }

  function removeSpec(index: number) {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }))
  }

  function removeImage(field: 'imageUrl' | 'imageUrl2' | 'imageUrl3', fileField: 'imageFile1' | 'imageFile2' | 'imageFile3') {
    setForm((prev) => ({ ...prev, [field]: '', [fileField]: null }))
  }

  function confirmRemoveImage() {
    if (!pendingImage) return
    removeImage(pendingImage, IMAGE_FILE_FIELDS[pendingImage])
    setPendingImage(null)
  }

  const pendingSpec = pendingSpecIndex !== null ? form.specs[pendingSpecIndex] ?? null : null

  function confirmRemoveSpec() {
    if (pendingSpecIndex === null) return
    removeSpec(pendingSpecIndex)
    setPendingSpecIndex(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const category = form.category === 'Adicionar nova...' ? form.categoryCustom.trim() : form.category.trim()
    const subcategory = form.subcategory === 'Adicionar nova...' ? form.subcategoryCustom.trim() : form.subcategory.trim()
    const brand = form.brand === 'Adicionar nova...' ? form.brandCustom.trim() : form.brand.trim()

    const specs = form.specs
      .filter((spec) => spec.property.trim() !== '')
      .map((spec) => ({ property: spec.property.trim(), value: spec.value.trim() }))

    const input: ProductInput = {
      name: form.name.trim(),
      category,
      short_description: form.shortDescription.trim(),
      description: form.description,
      technical_specs: JSON.stringify(specs),
      sizes: form.sizes.join(','),
      is_active: form.isActive,
    }

    if (subcategory !== '') input.subcategory = subcategory
    if (brand !== '') input.brand = brand

    if (form.imageFile1) input.image_url = form.imageFile1
    else if (form.imageUrl.trim() !== '') input.image_url = form.imageUrl.trim()

    if (form.imageFile2) input.image_url_2 = form.imageFile2
    else if (form.imageUrl2.trim() !== '') input.image_url_2 = form.imageUrl2.trim()

    if (form.imageFile3) input.image_url_3 = form.imageFile3
    else if (form.imageUrl3.trim() !== '') input.image_url_3 = form.imageUrl3.trim()

    setSubmitting(true)
    setErrorMessage(null)
    try {
      await onSubmit(input)
      if (!product) {
        setForm(EMPTY_FORM)
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o produto. Verifique os dados e tente novamente.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pr-2">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h3 className={SECTION_TITLE_CLASS}>Informações Básicas</h3>
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

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <span className={LABEL_CLASS}>Tamanhos</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Tamanhos disponíveis">
              {sizeOptions.map((size) => {
                const selected = form.sizes.includes(size)
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      selected
                        ? 'border-cyan-600 bg-cyan-600 text-white shadow-sm'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-cyan-400 hover:bg-cyan-50'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-slate-400">
              Selecione um ou mais tamanhos.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className={SECTION_TITLE_CLASS}>Descrição</h3>
        <div className="grid gap-5">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASS}>Resumo do Produto (Aparece abaixo do título na página do produto)</span>
            <textarea
              rows={3}
              maxLength={300}
              value={form.shortDescription}
              onChange={(e) => update('shortDescription', e.target.value)}
              placeholder="Breve resumo que aparece abaixo do título do produto."
              className={FIELD_CLASS}
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL_CLASS}>Descrição Detalhada</span>
            <div className="overflow-hidden rounded-xl border border-slate-300 bg-white">
              <ReactQuill
                theme="snow"
                value={form.description}
                onChange={(value: string) => update('description', value)}
                placeholder="Descrição detalhada do produto..."
                className="text-base text-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className={SECTION_TITLE_CLASS}>Imagens do Produto</h3>
        <div className="grid gap-5 md:grid-cols-3">
          <ImageField
            label="Imagem 1"
            preview={image1Preview}
            url={form.imageUrl}
            onUrlChange={(value) => update('imageUrl', value)}
            onFileChange={(file) => update('imageFile1', file)}
            onRemove={() => setPendingImage('imageUrl')}
          />
          <ImageField
            label="Imagem 2 (opcional)"
            preview={image2Preview}
            url={form.imageUrl2}
            onUrlChange={(value) => update('imageUrl2', value)}
            onFileChange={(file) => update('imageFile2', file)}
            onRemove={() => setPendingImage('imageUrl2')}
          />
          <ImageField
            label="Imagem 3 (opcional)"
            preview={image3Preview}
            url={form.imageUrl3}
            onUrlChange={(value) => update('imageUrl3', value)}
            onFileChange={(file) => update('imageFile3', file)}
            onRemove={() => setPendingImage('imageUrl3')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className={SECTION_TITLE_CLASS}>Especificações Técnicas (Opcional)</h3>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Adicione características técnicas do produto em pares de propriedade e valor.
            </p>
            <button
              type="button"
              onClick={addSpec}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-cyan-600 px-3 py-2 text-sm font-semibold text-cyan-700 transition-colors hover:bg-cyan-50"
            >
              <Icon name="plus" className="h-4 w-4" />
              Adicionar Especificação
            </button>
          </div>

          {form.specs.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">
              Nenhuma especificação adicionada.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {form.specs.map((spec, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    type="text"
                    value={spec.property}
                    onChange={(e) => updateSpec(index, 'property', e.target.value)}
                    placeholder="Propriedade (Ex.: Comprimento)"
                    className={FIELD_CLASS}
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    placeholder="Valor (Ex.: 110cm)"
                    className={FIELD_CLASS}
                  />
                  <button
                    type="button"
                    onClick={() => setPendingSpecIndex(index)}
                    aria-label={`Remover especificação ${index + 1}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 text-white shadow-sm transition-colors hover:bg-red-700"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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

      <ConfirmDialog
        isOpen={pendingImage !== null}
        title="Remover imagem"
        message={
          <>
            Tem certeza que deseja remover a{' '}
            <strong className="font-semibold">
              {pendingImage ? IMAGE_LABELS[pendingImage].toLowerCase() : 'imagem'}
            </strong>
            ? A imagem atual será descartada.
          </>
        }
        confirmLabel="Remover"
        onConfirm={confirmRemoveImage}
        onCancel={() => setPendingImage(null)}
      />

      <ConfirmDialog
        isOpen={pendingSpecIndex !== null && pendingSpec !== null}
        title="Remover especificação"
        message={
          <>
            Tem certeza que deseja remover a especificação
            {pendingSpec && pendingSpec.property.trim() !== '' ? (
              <>
                {' '}
                <strong className="font-semibold">
                  "{pendingSpec.property.trim()}"
                </strong>
                ?
              </>
            ) : (
              ' em branco?'
            )}{' '}
            Esta ação não pode ser desfeita.
          </>
        }
        confirmLabel="Remover"
        onConfirm={confirmRemoveSpec}
        onCancel={() => setPendingSpecIndex(null)}
      />
    </form>
  )
}