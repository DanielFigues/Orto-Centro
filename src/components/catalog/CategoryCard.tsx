import { Link } from 'react-router-dom'
import { categoryPath, categoryPathWithSubcategory } from '../../data/categories'
import type { Category } from '../../data/categories'
import { Icon } from '../ui/Icon'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const path = categoryPath(category)

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
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
          />
        ) : (
          <div
            aria-label={category.imageAlt}
            role="img"
            data-placeholder="TODO"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-white transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
          >
            {/* TODO: substituir placeholder neutro por imagem definitiva */}
            <Icon name={category.imageIcon} className="h-14 w-14 opacity-80" />
          </div>
        )}
      </Link>

      <div className="mt-4 flex flex-col gap-2">
        <h3 className="text-[clamp(1.25rem,1.6vw,1.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-900 dark:text-white">
          <Link
            to={path}
            className="focus-ring rounded-sm after:absolute after:inset-x-0 after:top-0 after:aspect-square after:rounded-[12px] after:content-['']"
          >
            {category.name}
          </Link>
        </h3>

        {category.subcategories.length > 0 ? (
          <ul className="relative z-10 flex flex-wrap gap-x-4 gap-y-2">
            {category.subcategories.map((subcategory) => (
              <li key={subcategory.slug}>
                <Link
                  to={categoryPathWithSubcategory(category, subcategory)}
                  className="focus-ring inline-flex min-h-11 items-center text-[1.0625rem] leading-relaxed text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
                >
                  {subcategory.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}
