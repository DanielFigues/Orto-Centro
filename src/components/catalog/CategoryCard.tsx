import { Link } from 'react-router-dom'
import { categoryPath, categoryPathWithSubcategory } from '../../data/categories'
import type { Category } from '../../data/categories'
import { Icon } from '../ui/Icon'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const path = categoryPath(category)
  const visibleSubcategories = category.subcategories.slice(0, 3)

  return (
    <article className="group relative flex h-full flex-col">
      <Link
        to={path}
        className="focus-ring block aspect-square overflow-hidden rounded-[10px] bg-neutral-100 dark:bg-neutral-800"
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
          <ul className="relative z-10 mt-4 flex flex-nowrap gap-x-4 overflow-hidden">
            {visibleSubcategories.map((subcategory) => (
              <li key={subcategory.slug} className="min-w-0 shrink-0">
                <Link
                  to={categoryPathWithSubcategory(category, subcategory)}
                  className="focus-ring block whitespace-nowrap text-[16px] font-medium leading-[1.5] text-neutral-600 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-white"
                >
                  {subcategory.label ?? subcategory.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}
