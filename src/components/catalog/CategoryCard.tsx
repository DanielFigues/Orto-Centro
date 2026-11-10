import { Link } from 'react-router-dom'
import { categoryPath, categoryPathWithSubcategory } from '../../data/categories'
import type { Category } from '../../data/categories'
import { Icon } from '../ui/Icon'
import { useMediaQuery } from '../../hooks/useMediaQuery'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const path = categoryPath(category)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const subcategoryText = category.subcategories.map((s) => s.name).join(', ')

  return (
    <article className="group relative flex h-full flex-col">
      <Link
        to={path}
        className="focus-ring block aspect-square overflow-hidden rounded-[12px] bg-neutral-100 dark:bg-neutral-800"
        aria-label={`Ver categoria ${category.name}`}
      >
        {category.image ? (
          <img
            src={category.image}
            alt={category.imageAlt}
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 motion-reduce:transform-none [@media(hover:hover)]:group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-label={category.imageAlt}
            role="img"
            data-placeholder="TODO"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-white transition-transform duration-300 motion-reduce:transform-none [@media(hover:hover)]:group-hover:scale-[1.03]"
          >
            {/* TODO: substituir placeholder neutro por imagem definitiva */}
            <Icon name={category.imageIcon} className="h-14 w-14 opacity-80" />
          </div>
        )}
      </Link>

      <div className="mt-4 flex flex-col gap-2">
        <h3 className="text-[1.25rem] font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white md:text-[clamp(1.25rem,1.6vw,1.75rem)]">
          <Link
            to={path}
            className="focus-ring rounded-sm after:absolute after:inset-x-0 after:top-0 after:aspect-square after:rounded-[12px] after:content-['']"
          >
            {category.name}
          </Link>
        </h3>

        {category.subcategories.length > 0 ? (
          isDesktop ? (
            <ul className="relative z-10 flex flex-wrap gap-x-5 gap-y-1">
              {category.subcategories.map((subcategory) => (
                <li key={subcategory.slug}>
                  <Link
                    to={categoryPathWithSubcategory(category, subcategory)}
                    className="focus-ring inline-flex min-h-7 items-center text-[1rem] leading-relaxed text-neutral-700 underline-offset-4 hover:underline [@media(pointer:coarse)]:min-h-11 dark:text-neutral-300"
                  >
                    {subcategory.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[1rem] leading-relaxed text-neutral-600 dark:text-neutral-400">
              {subcategoryText}
            </p>
          )
        ) : null}
      </div>
    </article>
  )
}
