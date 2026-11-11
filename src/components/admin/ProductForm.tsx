import { useEffect, useMemo, useState, type FormEvent } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { categories as canonicalCategories } from '../../data/categories'
import type { ProductInput } from '../../services/api'
import { validateVideoFile } from '../../services/api'
import type { Product } from '../../types/product'
import { ConfirmDialog } from './ConfirmDialog'
import { Icon } from '../ui/Icon'

interface ProductFormProps {
  product?: Product | null
  products?: Product[]
  onSubmit: (input: ProductInput) => Promise<void>
  onUploadVideo: (file: File) => Promise<string>
  onCancel?: () => void
  submitLabel?: string
  submittingLabel?: string
}

interface TechnicalSpec {
  property: string
  value: string
}

interface ImageSlot {
  url: string
  file: File | null
}

interface VideoSlot {
  url: string
  file: File | null
  uploading: boolean
  error: string | null
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
  imageSlots: ImageSlot[]
  videoSlots: VideoSlot[]
  showPrice: boolean
  priceInput: string
  specs: TechnicalSpec[]
  isActive: boolean
}

const MAX_IMAGE_SLOTS = 5
const MAX_EXTRA_IMAGE_SLOTS = 2
const MAX_VIDEO_SLOTS = 3
const MAX_EXTRA_VIDEO_SLOTS = 2

function createEmptyImageSlot(): ImageSlot {
  return { url: '', file: null }
}

function createEmptyVideoSlot(): VideoSlot {
  return { url: '', file: null, uploading: false, error: null }
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
  imageSlots: [createEmptyImageSlot()],
  videoSlots: [createEmptyVideoSlot()],
  showPrice: false,
  priceInput: '',
  specs: [],
  isActive: true,
}

const PREDEFINED_SIZES = ['Único', 'PP', 'P', 'M', 'G', 'GG', 'XG']

function formatPriceInput(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function parsePriceInput(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') return null

  const normalized = trimmed
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function getPriceFieldError(showPrice: boolean, priceInput: string): string | null {
  if (!showPrice) return null

  const trimmed = priceInput.trim()
  if (trimmed === '') {
    return 'Informe um preço válido maior que zero ou remova o preço.'
  }

  const parsed = parsePriceInput(trimmed)
  if (parsed === null || parsed <= 0) {
    return 'Informe um preço válido maior que zero.'
  }
  if (parsed > 9999999.99) {
    return 'O preço deve ser menor que 9.999.999,99.'
  }

  return null
}

function buildInitialImageSlots(product: Product | null | undefined): ImageSlot[] {
  if (!product) return [createEmptyImageSlot()]

  const urls = [
    product.image_url,
    product.image_url_2,
    product.image_url_3,
    product.image_url_4,
    product.image_url_5,
  ]
    .map((url) => (typeof url === 'string' ? url.trim() : ''))
    .filter((url) => url !== '')

  if (urls.length === 0) return [createEmptyImageSlot()]
  return urls.map((url) => ({ url, file: null }))
}

function buildInitialVideoSlots(product: Product | null | undefined): VideoSlot[] {
  if (!product) return [createEmptyVideoSlot()]

  const urls = [product.video_url, product.video_url_2, product.video_url_3]
    .map((url) => (typeof url === 'string' ? url.trim() : ''))
    .filter((url) => url !== '')

  if (urls.length === 0) return [createEmptyVideoSlot()]
  return urls.map((url) => ({ url, file: null, uploading: false, error: null }))
}

function buildInitialForm(product: Product | null | undefined): FormState {
  if (!product) {
    return EMPTY_FORM
  }

  const hasPrice = typeof product.price === 'number' && Number.isFinite(product.price) && product.price > 0

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
    imageSlots: buildInitialImageSlots(product),
    videoSlots: buildInitialVideoSlots(product),
    showPrice: hasPrice,
    priceInput: hasPrice ? formatPriceInput(product.price as number) : '',
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

interface ImageFieldProps {
  label: string
  slot: ImageSlot
  onUrlChange: (value: string) => void
  onFileChange: (file: File) => void
  onRemove: () => void
}

function ImageField({ label, slot, onUrlChange, onFileChange, onRemove }: ImageFieldProps) {
  const objectUrl = useMemo(
    () => (slot.file ? URL.createObjectURL(slot.file) : ''),
    [slot.file],
  )

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  const preview = slot.file ? objectUrl : slot.url.trim()

  return (
    <div className="space-y-2">
      <div className="flex min-h-7 items-center justify-between gap-2">
        <span className={LABEL_CLASS}>{label}</span>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
        >
          <Icon name="trash" className="h-3.5 w-3.5" />
          Remover
        </button>
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
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileChange(file)
          }}
        />
      </label>

      <input
        type="text"
        value={slot.url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://..."
        aria-label={`URL de ${label}`}
        className={FIELD_CLASS}
      />
    </div>
  )
}

interface VideoFieldProps {
  label: string
  slot: VideoSlot
  onUrlChange: (value: string) => void
  onFileChange: (file: File) => void
  onRemove: () => void
}

function VideoField({ label, slot, onUrlChange, onFileChange, onRemove }: VideoFieldProps) {
  const objectUrl = useMemo(
    () => (slot.file ? URL.createObjectURL(slot.file) : ''),
    [slot.file],
  )

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  const preview = slot.file ? objectUrl : slot.url.trim()

  return (
    <div className="space-y-2">
      <div className="flex min-h-7 items-center justify-between gap-2">
        <span className={LABEL_CLASS}>{label}</span>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
        >
          <Icon name="trash" className="h-3.5 w-3.5" />
          Remover
        </button>
      </div>

      <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
        {preview !== '' ? (
          <video
            src={preview}
            controls
            preload="metadata"
            className="h-full w-full object-contain"
            aria-label={`Pré-visualização de ${label}`}
          />
        ) : (
          <span className="px-4 text-center text-sm text-slate-400">
            Nenhum vídeo
          </span>
        )}
      </div>

      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
        <Icon name="play" className="h-4 w-4 text-slate-400" />
        Selecionar vídeo
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileChange(file)
            e.currentTarget.value = ''
          }}
        />
      </label>

      <input
        type="text"
        value={slot.url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://... ou /uploads/video.mp4"
        aria-label={`URL de ${label}`}
        className={FIELD_CLASS}
      />

      {slot.error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {slot.error}
        </p>
      ) : null}
    </div>
  )
}

export function ProductForm({
  product,
  products = [],
  onSubmit,
  onUploadVideo,
  onCancel,
  submitLabel = 'Adicionar produto',
  submittingLabel = 'Adicionando...',
}: ProductFormProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialForm(product))
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [pendingImageIndex, setPendingImageIndex] = useState<number | null>(null)
  const [pendingVideoIndex, setPendingVideoIndex] = useState<number | null>(null)
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

  function updateImageSlot(index: number, patch: Partial<ImageSlot>) {
    setForm((prev) => ({
      ...prev,
      imageSlots: prev.imageSlots.map((slot, i) =>
        i === index ? { ...slot, ...patch } : slot,
      ),
    }))
  }

  function confirmRemoveImage() {
    if (pendingImageIndex === null) return
    setForm((prev) => {
      const nextSlots = prev.imageSlots.filter((_, i) => i !== pendingImageIndex)
      return {
        ...prev,
        imageSlots: nextSlots.length > 0 ? nextSlots : [createEmptyImageSlot()],
      }
    })
    setPendingImageIndex(null)
  }

  const activeImageCount = form.imageSlots.filter(
    (slot) => slot.file !== null || slot.url.trim() !== '',
  ).length
  const canAddImageSlot =
    form.imageSlots.length < MAX_IMAGE_SLOTS &&
    form.imageSlots.length < activeImageCount + MAX_EXTRA_IMAGE_SLOTS

  function addImageSlot() {
    if (!canAddImageSlot) return
    setForm((prev) => ({
      ...prev,
      imageSlots: [...prev.imageSlots, createEmptyImageSlot()],
    }))
  }

  function updateVideoSlot(index: number, patch: Partial<VideoSlot>) {
    setForm((prev) => ({
      ...prev,
      videoSlots: prev.videoSlots.map((slot, i) =>
        i === index ? { ...slot, ...patch } : slot,
      ),
    }))
  }

  function confirmRemoveVideo() {
    if (pendingVideoIndex === null) return
    setForm((prev) => {
      const nextSlots = prev.videoSlots.filter((_, i) => i !== pendingVideoIndex)
      return {
        ...prev,
        videoSlots: nextSlots.length > 0 ? nextSlots : [createEmptyVideoSlot()],
      }
    })
    setPendingVideoIndex(null)
  }

  const activeVideoCount = form.videoSlots.filter(
    (slot) => slot.file !== null || slot.url.trim() !== '',
  ).length
  const canAddVideoSlot =
    form.videoSlots.length < MAX_VIDEO_SLOTS &&
    form.videoSlots.length < activeVideoCount + MAX_EXTRA_VIDEO_SLOTS

  function addVideoSlot() {
    if (!canAddVideoSlot) return
    setForm((prev) => ({
      ...prev,
      videoSlots: [...prev.videoSlots, createEmptyVideoSlot()],
    }))
  }

  const pendingSpec = pendingSpecIndex !== null ? form.specs[pendingSpecIndex] ?? null : null

  function confirmRemoveSpec() {
    if (pendingSpecIndex === null) return
    removeSpec(pendingSpecIndex)
    setPendingSpecIndex(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextPriceError = getPriceFieldError(form.showPrice, form.priceInput)
    if (nextPriceError) {
      setPriceError(nextPriceError)
      return
    }

    const category = form.category === 'Adicionar nova...' ? form.categoryCustom.trim() : form.category.trim()
    const subcategory = form.subcategory === 'Adicionar nova...' ? form.subcategoryCustom.trim() : form.subcategory.trim()
    const brand = form.brand === 'Adicionar nova...' ? form.brandCustom.trim() : form.brand.trim()

    const specs = form.specs
      .filter((spec) => spec.property.trim() !== '')
      .map((spec) => ({ property: spec.property.trim(), value: spec.value.trim() }))

    const parsedPrice = form.showPrice ? parsePriceInput(form.priceInput) : null
    const imageValues = form.imageSlots.map((slot) => slot.file ?? slot.url.trim())

    setSubmitting(true)
    setErrorMessage(null)
    setPriceError(null)
    try {
      const videoValues: string[] = []
      for (let index = 0; index < form.videoSlots.length; index += 1) {
        const slot = form.videoSlots[index]
        if (slot.file) {
          setForm((prev) => ({
            ...prev,
            videoSlots: prev.videoSlots.map((item, i) =>
              i === index ? { ...item, uploading: true, error: null } : item,
            ),
          }))
          try {
            const uploadedUrl = await onUploadVideo(slot.file)
            videoValues.push(uploadedUrl)
            setForm((prev) => ({
              ...prev,
              videoSlots: prev.videoSlots.map((item, i) =>
                i === index
                  ? { ...item, url: uploadedUrl, file: null, uploading: false, error: null }
                  : item,
              ),
            }))
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Não foi possível enviar o vídeo.'
            setForm((prev) => ({
              ...prev,
              videoSlots: prev.videoSlots.map((item, i) =>
                i === index ? { ...item, uploading: false, error: message } : item,
              ),
            }))
            throw error
          }
        } else {
          videoValues.push(slot.url.trim())
        }
      }

      const input: ProductInput = {
        name: form.name.trim(),
        category,
        short_description: form.shortDescription.trim(),
        description: form.description,
        technical_specs: JSON.stringify(specs),
        sizes: form.sizes.join(','),
        price: parsedPrice,
        is_active: form.isActive,
        image_url: imageValues[0] ?? '',
        image_url_2: imageValues[1] ?? '',
        image_url_3: imageValues[2] ?? '',
        image_url_4: imageValues[3] ?? '',
        image_url_5: imageValues[4] ?? '',
        video_url: videoValues[0] ?? '',
        video_url_2: videoValues[1] ?? '',
        video_url_3: videoValues[2] ?? '',
      }

      if (subcategory !== '') input.subcategory = subcategory
      if (brand !== '') input.brand = brand

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
        <div className="flex items-center justify-between gap-3">
          <h3 className={SECTION_TITLE_CLASS}>Imagens do Produto</h3>
          {canAddImageSlot ? (
            <button
              type="button"
              onClick={addImageSlot}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-cyan-600 px-3 py-2 text-sm font-semibold text-cyan-700 transition-colors hover:bg-cyan-50"
            >
              <Icon name="plus" className="h-4 w-4" />
              Adicionar imagem
            </button>
          ) : null}
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {form.imageSlots.map((slot, index) => (
            <ImageField
              key={index}
              label={`Imagem ${index + 1}${index === 0 ? '' : ' (opcional)'}`}
              slot={slot}
              onUrlChange={(value) => updateImageSlot(index, { url: value })}
              onFileChange={(file) => updateImageSlot(index, { file })}
              onRemove={() => setPendingImageIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className={SECTION_TITLE_CLASS}>Vídeos do Produto (Opcional)</h3>
          {canAddVideoSlot ? (
            <button
              type="button"
              onClick={addVideoSlot}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-cyan-600 px-3 py-2 text-sm font-semibold text-cyan-700 transition-colors hover:bg-cyan-50"
            >
              <Icon name="plus" className="h-4 w-4" />
              Adicionar vídeo
            </button>
          ) : null}
        </div>
        <p className="text-sm text-slate-500">
          Envie vídeos curtos (MP4, WebM ou MOV, até 100 MB) ou informe uma URL.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {form.videoSlots.map((slot, index) => (
            <VideoField
              key={index}
              label={`Vídeo ${index + 1}${index === 0 ? '' : ' (opcional)'}`}
              slot={slot}
              onUrlChange={(value) => updateVideoSlot(index, { url: value, error: null })}
              onFileChange={(file) => {
                const validationError = validateVideoFile(file)
                updateVideoSlot(index, {
                  file: validationError ? null : file,
                  error: validationError,
                  ...(validationError ? {} : {}),
                })
              }}
              onRemove={() => setPendingVideoIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className={SECTION_TITLE_CLASS}>Preço (Opcional)</h3>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Deixe sem preço se o valor for consultado diretamente com a loja.
            </p>
            {!form.showPrice ? (
              <button
                type="button"
                onClick={() => {
                  setPriceError(null)
                  setForm((prev) => ({ ...prev, showPrice: true }))
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-cyan-600 px-3 py-2 text-sm font-semibold text-cyan-700 transition-colors hover:bg-cyan-50"
              >
                <Icon name="plus" className="h-4 w-4" />
                Adicionar preço
              </button>
            ) : null}
          </div>

          {form.showPrice ? (
            <div className="mt-3">
              <div className="flex items-center gap-3">
                <div className="flex w-full max-w-xs items-center overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/30">
                  <span className="px-3 text-sm font-semibold text-slate-500">R$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    aria-label="Preço em reais"
                    value={form.priceInput}
                    onChange={(e) => {
                      const value = e.target.value
                      setForm((prev) => ({ ...prev, priceInput: value }))
                      if (priceError) setPriceError(null)
                    }}
                    onBlur={() => {
                      const parsed = parsePriceInput(form.priceInput)
                      if (parsed !== null && parsed > 0 && parsed <= 9999999.99) {
                        setForm((prev) => ({
                          ...prev,
                          priceInput: formatPriceInput(parsed),
                        }))
                        setPriceError(null)
                        return
                      }
                      if (form.priceInput.trim() !== '') {
                        setPriceError(getPriceFieldError(true, form.priceInput))
                      }
                    }}
                    placeholder="0,00"
                    className="w-full bg-transparent px-1 py-3 pr-4 text-base text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPriceError(null)
                    setForm((prev) => ({ ...prev, showPrice: false, priceInput: '' }))
                  }}
                  aria-label="Remover preço"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-3 text-white shadow-sm transition-colors hover:bg-red-700"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
              {priceError ? (
                <p className="mt-2 text-sm font-medium text-red-600" role="alert">
                  {priceError}
                </p>
              ) : null}
            </div>
          ) : null}
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
        isOpen={pendingImageIndex !== null}
        title="Remover imagem"
        message={
          <>
            Tem certeza que deseja remover a{' '}
            <strong className="font-semibold">
              {pendingImageIndex !== null
                ? `imagem ${pendingImageIndex + 1}`
                : 'imagem'}
            </strong>
            ? As imagens seguintes serão reorganizadas.
          </>
        }
        confirmLabel="Remover"
        onConfirm={confirmRemoveImage}
        onCancel={() => setPendingImageIndex(null)}
      />

      <ConfirmDialog
        isOpen={pendingVideoIndex !== null}
        title="Remover vídeo"
        message={
          <>
            Tem certeza que deseja remover o{' '}
            <strong className="font-semibold">
              {pendingVideoIndex !== null ? `vídeo ${pendingVideoIndex + 1}` : 'vídeo'}
            </strong>
            ? Os vídeos seguintes serão reorganizados.
          </>
        }
        confirmLabel="Remover"
        onConfirm={confirmRemoveVideo}
        onCancel={() => setPendingVideoIndex(null)}
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