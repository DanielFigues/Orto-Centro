import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { fetchProducts } from '../services/api'
import { Icon } from '../components/ui/Icon'

interface ProductDetailPageProps {
  productId: number
}

function parseSizes(sizes: string | undefined): string[] {
  if (!sizes || sizes.trim() === '') return []
  return sizes
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<{ productId: number; image: string } | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        setProducts(await fetchProducts(controller.signal))
      } catch (error) {
        if (controller.signal.aborted) return
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o produto.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadProducts()

    return () => controller.abort()
  }, [])

  const product = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId],
  )

  const currentImage =
    selectedImage && selectedImage.productId === productId
      ? selectedImage.image
      : product?.image_url || ''

  const galleryImages = useMemo(() => {
    if (!product) return []
    const images = [product.image_url, product.image_url_2, product.image_url_3]
      .filter((img): img is string => typeof img === 'string' && img.trim() !== '')
    return images
  }, [product])

  const sizes = useMemo(() => parseSizes(product?.sizes), [product])

  if (isLoading) {
    return (
      <div className="flex min-h-svh flex-col">
        <div className="loading-state">Carregando produto...</div>
      </div>
    )
  }

  if (errorMessage !== null || !product) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950"
      >
        <p className="text-sm font-medium text-red-700 dark:text-red-300">
          {errorMessage || 'Produto não encontrado.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-neutral-200">Início</Link> / <span>{product.category}</span>
            {product.subcategory && <> / <span>{product.subcategory}</span></>}
          </nav>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Icon
                      name="tools"
                      className="h-24 w-24 text-sky-500 dark:text-sky-400"
                    />
                  </div>
                )}
              </div>
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {galleryImages.map((img) => (
                    <button
                      key={img}
                      onClick={() => setSelectedImage({ productId, image: img })}
                      className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                        currentImage === img
                          ? 'border-sky-500 dark:border-sky-400'
                          : 'border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                {product.name}
              </h1>

              {product.short_description && (
                <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {product.short_description}
                </p>
              )}

              {product.brand && (
                <div>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Marca:
                  </span>{' '}
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {product.brand}
                  </span>
                </div>
              )}

              {sizes.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Escolha Tamanho
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <span
                        key={size}
                        className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-3 py-1 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {product.description && (
            <div className="mt-8 space-y-3">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Descrição Geral
              </h2>
              {/<[a-zA-Z][^>]*>/.test(product.description) ? (
                <div
                  className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300 [&_a]:text-sky-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-500 [&_em]:italic [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_img]:my-2 [&_img]:max-w-full [&_img]:rounded-lg [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="whitespace-pre-wrap text-base text-neutral-700 dark:text-neutral-300">
                  {product.description}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
