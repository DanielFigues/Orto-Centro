export const whatsAppButtonBaseClass =
  'focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-button px-5 text-body font-medium transition-colors'

export const whatsAppButtonVariantClass = {
  primary:
    'bg-sky-700 text-white hover:bg-sky-800 dark:bg-sky-300 dark:text-neutral-950 dark:hover:bg-sky-200',
  secondary:
    'border border-neutral-300 text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500',
} as const

export const whatsAppButtonDisabledClass =
  'cursor-not-allowed bg-neutral-300 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
