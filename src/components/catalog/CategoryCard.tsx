import { Link } from 'react-router-dom'
import { categoryPath, categoryPathWithSubcategory } from '../../data/categories'
import type { Category } from '../../data/categories'
import { Icon } from '../ui/Icon'
import { useMediaQuery } from '../../hooks/useMediaQuery'

interface CategoryCardProps {
  category: Category
}

// Rail card widths: mobile ~72vw; md ~1/2.8 content; lg ~1/3.4; xl ~1/4.15 of content (peeking).
const CATEGORY_IMAGE_SIZES =
  '(min-width: 1536px) 23vw, (min-width: 1280px) 28vw, (min-width: 1024px) 34vw, (min-width: 768px) 43vw, 72vw'

export function CategoryCard({ category }: CategoryCardProps) {
  const path = categoryPath(category)
  const visibleSubcategories = category.subcategories.slice(0, 3)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const subcategoryText = category.subcategories.map((s) => s.name).join(', ')

  const imageSrc = category.image
  const imageSrc600 = imageSrc ? imageSrc.replace(/\.jpg$/, '-600.jpg') : null
  const imageWidth = category.imageWidth ?? 1200
  const imageHeight = category.imageHeight ?? 1200
  const srcSet = imageSrc && imageSrc600 ? `${imageSrc600} 600w, ${imageSrc} ${imageWidth}w` : undefined

  return (
    <article className="group relative flex h-full flex-col">
      <Link
        to={path}
        className="focus-ring relative block aspect-square overflow-hidden rounded-[10px] bg-neutral-100 dark:bg-neutral-800"
        aria-label={`Ver categoria ${category.name}`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            srcSet={srcSet}
            sizes={CATEGORY_IMAGE_SIZES}
            alt=""
            width={imageWidth}
            height={imageHeight}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-label={category.name}
            role="img"
            data-placeholder="TODO"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-white"
          >
            {/* TODO: substituir placeholder neutro por imagem definitiva */}
            <Icon name={category.imageIcon} className="h-14 w-14 opacity-80" />
          </div>
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-[rgba(0,0,0,0.45)] opacity-0 transition-opacity duration-200 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100"
        >
          <span className="text-[22px] font-medium tracking-[0.02em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
            Ver
          </span>
        </span>
      </Link>

      <div className="mt-[20px] flex flex-col pl-2">
        <h3 className="text-[24px] font-medium leading-[1.2] tracking-[-0.01em] text-neutral-900 dark:text-white xl:text-[28px]">
          <Link
            to={path}
            className="focus-ring rounded-sm after:absolute after:inset-x-0 after:top-0 after:aspect-square after:rounded-[10px] after:content-['']"
          >
            {category.name}
          </Link>
        </h3>

        {visibleSubcategories.length > 0 ? (
          isDesktop ? (
            <ul className="relative z-10 mt-4 flex max-h-[24px] flex-wrap gap-x-4 overflow-hidden">
              {visibleSubcategories.map((subcategory) => (
                <li key={subcategory.slug} className="shrink-0">
                  <Link
                    to={categoryPathWithSubcategory(category, subcategory)}
                    className="focus-ring block whitespace-nowrap text-[16px] font-medium leading-[1.5] text-neutral-600 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-white"
                  >
                    {subcategory.label ?? subcategory.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 overflow-hidden text-ellipsis whitespace-nowrap text-[16px] leading-[1.5] text-neutral-600 dark:text-neutral-400">
              {subcategoryText}
            </p>
          )
        ) : null}
      </div>
    </article>
  )
}