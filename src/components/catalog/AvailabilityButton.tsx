import type { Product } from '../../types/product'
import { buildWhatsAppLink } from '../../lib/whatsapp'
import { WhatsAppIcon } from '../ui/whatsapp'
import {
  whatsAppButtonBaseClass,
  whatsAppButtonDisabledClass,
  whatsAppButtonVariantClass,
} from '../ui/whatsappButtonStyles'

interface AvailabilityButtonProps {
  product: Product
  variant?: 'primary' | 'secondary'
  className?: string
  selectedSize?: string | null
  disabled?: boolean
  describedBy?: string
}

export function AvailabilityButton({
  product,
  variant = 'primary',
  className = '',
  selectedSize = null,
  disabled = false,
  describedBy,
}: AvailabilityButtonProps) {
  const content = (
    <>
      <WhatsAppIcon className="h-5 w-5 shrink-0" />
      Consultar disponibilidade
    </>
  )

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        aria-describedby={describedBy}
        className={`${whatsAppButtonBaseClass} ${whatsAppButtonDisabledClass} ${className}`.trim()}
      >
        {content}
      </button>
    )
  }

  return (
    <a
      href={buildWhatsAppLink(product, selectedSize)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Consultar disponibilidade de ${product.name} pelo WhatsApp (abre em nova aba)`}
      className={`${whatsAppButtonBaseClass} ${whatsAppButtonVariantClass[variant]} ${className}`.trim()}
    >
      {content}
    </a>
  )
}
