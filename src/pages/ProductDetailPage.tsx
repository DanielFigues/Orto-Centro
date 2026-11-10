import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { Icon } from '../components/ui/Icon'
import { useCatalog } from '../context/catalogContextValue'
import { categoryPath, getCategoryByName } from '../data/categories'

interface ProductDetailPageProps {
  productId: number
}

interface TechnicalSpec {
  property: string
  value: string
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function parseSpecs(raw: string | undefined): TechnicalSpec[] {
  if (!raw || raw.trim() === '') return []

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }

  if (!Array.isArray(parsed)) return []

  return parsed
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === 'object' && item !== null,
    )
    .map((item) => {
      const property =
        typeof item.property === 'string'
          ? item.property
          : typeof item.propriedade === 'string'
            ? item.propriedade
            : ''
      const value =
        typeof item.value === 'string'
          ? item.value
          : typeof item.valor === 'string'
            ? item.valor
            : ''
      return { property: property.trim(), value: value.trim() }
    })
    .filter((spec) => spec.property !== '' && spec.value !== '')
}

function ImageZoomDialog({
  src,
  alt,
  onClose,
}: {
  src: string
  alt: string
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR,
      )
      if (!focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      if (
        previousFocus !== null &&
        previousFocus !== document.body &&
        previousFocus.isConnected
      ) {
        previousFocus.focus()
      }
    }
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/90"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Imagem ampliada: ${alt}`}
        className="relative z-10 flex max-h-full max-w-5xl flex-col"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar imagem ampliada"
          className="focus-ring absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-button bg-black/50 text-white transition-colors hover:bg-black/70"
        >
          <Icon name="x" className="h-5 w-5" />
        </button>
        <img
          src={src}
          alt={alt}
          width={1200}
          height={1200}
          decoding="async"
          className="max-h-[85svh] w-auto max-w-full rounded-card object-contain"
        />
      </div>
    </div>,
    document.body,
  )
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const { activeProducts, isLoading, errorMessage, retry } = useCatalog()
  const [selectedImage, setSelectedImage] = useState<{
    productId: number
    image: string
  } | null>(null)
  const [zoomImage, setZoomImage] = useState<string | null>(null)
  const [mainImageError, setMainImageError] = useState(false)

  const product = useMemo(
    () => activeProducts.find((item) => item.id === productId),
    [activeProducts, productId],
  )

  const galleryImages = useMemo(() => {
    if (!product) return []
    return [product.image_url, product.image_url_2, product.image_url_3].filter(
      (img): img is string => typeof img === 'string' && img.trim() !== '',
    )
  }, [product])

  const currentImage =
    selectedImage && selectedImage.productId === productId
      ? selectedImage.image
      : galleryImages[0] ?? ''

  const technicalSpecs = useMemo(
    () => parseSpecs(product?.technical_specs),
    [product],
  )

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return activeProducts
      .filter(
        (item) => item.category === product.category && item.id !== product.id,
      )
      .slice(0, 4)
  }, [activeProducts, product])

  if (isLoading) {
    return (
      <p className="container py-16 text-center text-body text-neutral-600 dark:text-neutral-300">
        Carregando produto...
      </p>
    )
  }

  if (errorMessage !== null) {
    return (
      <div
        role="alert"
        className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-card border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950"
      >
        <p className="text-body font-medium text-red-700 dark:text-red-300">
          {errorMessage}
        </p>
        <button
          type="button"
          onClick={retry}
          className="focus-ring rounded-button border border-red-300 px-4 py-2 text-body font-medium text-red-700 transition-colors hover:border-red-500 dark:border-red-800 dark:text-red-300"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-card border border-dashed border-neutral-300 px-6 py-14 text-center dark:border-neutral-700">
        <Icon name="search" className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
        <p className="text-body font-medium text-neutral-700 dark:text-neutral-200">
          Produto não encontrado.
        </p>
        <Link
          to="/catalogo"
          className="focus-ring inline-flex min-h-11 items-center rounded-button border border-neutral-300 px-4 text-body font-medium text-neutral-700 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-200"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  const showMainImage = currentImage !== '' && !mainImageError

  return (
    <div className="container">
      <nav aria-label="Breadcrumb" className="text-label text-neutral-600 dark:text-neutral-300">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="focus-ring rounded transition-colors hover:text-sky-700 dark:hover:text-sky-300">
              Início
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              to={categoryPath(getCategoryByName(product.category) ?? product.category)}
              className="focus-ring rounded transition-colors hover:text-sky-700 dark:hover:text-sky-300"
            >
              {product.category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="min-w-0 break-words font-medium text-neutral-900 dark:text-white [overflow-wrap:anywhere]">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="min-w-0 max-w-full space-y-4">
          <div className="relative aspect-square w-full max-w-full overflow-hidden rounded-card-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
            {showMainImage ? (
              <button
                type="button"
                onClick={() => setZoomImage(currentImage)}
                className="focus-ring group block h-full w-full"
                aria-label={`Ampliar imagem de ${product.name}`}
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  width={1000}
                  height={1000}
                  decoding="async"
                  onError={() => setMainImageError(true)}
                  className="h-full w-full object-cover"
                />
                <span className="pointer-events-none absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-2 rounded-button bg-black/60 px-3 text-label font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Icon name="search" className="h-4 w-4" />
                  Ampliar
                </span>
              </button>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Icon name="tools" className="h-24 w-24 text-sky-600 dark:text-sky-400" />
              </div>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Imagens do produto"
            >
              {galleryImages.map((img) => {
                const isSelected = currentImage === img
                return (
                  <button
                    key={img}
                    type="button"
                    onClick={() => {
                      setSelectedImage({ productId, image: img })
                      setMainImageError(false)
                    }}
                    aria-pressed={isSelected}
                    aria-label={`Ver imagem de ${product.name}`}
                    className={`focus-ring h-20 w-20 flex-shrink-0 overflow-hidden rounded-button border-2 transition-colors ${
                      isSelected
                        ? 'border-sky-600 dark:border-sky-400'
                        : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      aria-hidden="true"
                      width={80}
                      height={80}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-5">
          <div>
            <Link
              to={categoryPath(getCategoryByName(product.category) ?? product.category)}
              className="focus-ring inline-flex min-h-11 items-center rounded-button text-label font-medium uppercase tracking-wide text-sky-700 transition-colors hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200"
            >
              {product.category}
              {product.subcategory ? ` · ${product.subcategory}` : ''}
            </Link>
            <h1 className="mt-2 line-clamp-3 text-h1 font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white md:line-clamp-2">
              {product.name}
            </h1>
          </div>

          {product.short_description ? (
            <p className="max-w-2xl text-body-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
              {product.short_description}
            </p>
          ) : null}

          {typeof product.price === 'number' && Number.isFinite(product.price) && product.price > 0 ? (
            <p className="text-h3 font-semibold text-neutral-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </p>
          ) : null}

          {technicalSpecs.length > 0 && (
            <section aria-labelledby="especificacoes-titulo" className="min-w-0">
              <h2
                id="especificacoes-titulo"
                className="text-h3 font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white"
              >
                Especificações
              </h2>
              <ul className="mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
                {technicalSpecs.map((spec, index) => (
                  <li
                    key={`${spec.property}-${index}`}
                    className="min-w-0 rounded-button border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                  >
                    <p className="text-label font-medium text-neutral-500 dark:text-neutral-400">
                      {spec.property}
                    </p>
                    <p className="mt-0.5 break-words text-body font-medium text-neutral-900 [overflow-wrap:anywhere] dark:text-white">
                      {spec.value}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {product.description ? (
        <section
          aria-labelledby="descricao-titulo"
          className="mt-10 min-w-0 max-w-full sm:max-w-3xl [overflow-wrap:anywhere]"
        >
          <h2
            id="descricao-titulo"
            className="text-h3 font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white"
          >
            Descrição
          </h2>
          {/<[a-zA-Z][^>]*>/.test(product.description) ? (
            <div
              className="prose mt-4 max-w-none break-words [overflow-wrap:anywhere] dark:prose-invert [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className="mt-4 whitespace-pre-wrap break-words text-body leading-relaxed text-neutral-700 [overflow-wrap:anywhere] dark:text-neutral-300">
              {product.description}
            </p>
          )}
        </section>
      ) : null}

      {relatedProducts.length > 0 && (
        <section aria-labelledby="relacionados-titulo" className="mt-16 border-t border-neutral-200 pt-12 dark:border-neutral-800">
          <h2
            id="relacionados-titulo"
            className="text-h2 font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white"
          >
            Produtos relacionados
          </h2>
          <p className="mt-2 text-body text-neutral-600 dark:text-neutral-300">
            Mais opções na categoria {product.category}.
          </p>
          <div className="mt-6 grid min-w-0 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {zoomImage ? (
        <ImageZoomDialog
          src={zoomImage}
          alt={product.name}
          onClose={() => setZoomImage(null)}
        />
      ) : null}
    </div>
  )
}
