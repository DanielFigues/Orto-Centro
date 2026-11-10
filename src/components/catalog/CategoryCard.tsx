import { Link } from 'react-router-dom'
import { categoryPath } from '../../data/categories'
import type { Category } from '../../data/categories'
import { Icon } from '../ui/Icon'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={categoryPath(category.name)}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-neutral-200 bg-white transition-shadow hover:shadow-md focus-ring dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-lg"
    >
      <div className="aspect-square shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={category.image}
          alt={category.imageAlt}
          width={category.imageWidth}
          height={category.imageHeight}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="text-body font-semibold leading-snug text-neutral-900 dark:text-white">
          {category.name}
        </h3>
        <p className="text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
          {category.summary}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-label font-medium text-sky-700 dark:text-sky-300">
          Ver categoria
          <Icon name="arrow-right" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
