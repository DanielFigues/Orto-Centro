export function SkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-[4/3] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-3.5 w-2/3 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-auto h-3 w-1/3 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="px-4 pb-4">
        <div className="h-7 w-24 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  )
}