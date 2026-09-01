interface IconProps {
  name: string
  className?: string
}

export function Icon({ name, className = 'h-5 w-5' }: IconProps) {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  } as const

  switch (name) {
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )
    case 'moon':
      return (
        <svg {...common}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )
    case 'menu':
      return (
        <svg {...common}>
          <path d="M5 5h14M5 12h14M5 19h14" />
        </svg>
      )
    case 'x':
      return (
        <svg {...common}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      )
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      )
    case 'arrow-right':
      return (
        <svg {...common}>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )
    case 'truck':
      return (
        <svg {...common}>
          <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="1.5" />
          <circle cx="17" cy="18" r="1.5" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    case 'heart':
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    case 'star':
      return (
        <svg {...common}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M10 21v-6h4v6" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      )
    case 'chevron-left':
      return (
        <svg {...common}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      )
    case 'chevron-right':
      return (
        <svg {...common}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      )
    case 'chevron-down':
      return (
        <svg {...common}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      )
    case 'wheelchair':
      return (
        <svg {...common}>
          <circle cx="6" cy="5" r="2.2" />
          <path d="M6 7.2V20h4.5M6 10h7l-1 5h5v5" />
          <circle cx="15.5" cy="13.5" r="3.5" />
        </svg>
      )
    case 'walker':
      return (
        <svg {...common}>
          <path d="M4 4v16M20 4v16M4 10h16M7 20l1-6M17 20l-1-6M8 14h8" />
        </svg>
      )
    case 'shower':
      return (
        <svg {...common}>
          <path d="M4 20V8a2 2 0 0 1 2-2h8" />
          <path d="M4 12h12M8 6a2 2 0 0 1 4 0M6 20h12" />
          <circle cx="16" cy="5" r="1.5" />
        </svg>
      )
    case 'rail':
      return (
        <svg {...common}>
          <path d="M6 21V8M6 8l4-4M6 12h8M6 16h10" />
          <path d="M10 4h10v4" />
        </svg>
      )
    case 'spoon':
      return (
        <svg {...common}>
          <path d="M14 2a6 6 0 0 0-6 6c0 2.2 1.2 4.1 3 5.1V21a1 1 0 0 0 2 0v-1h2V21a1 1 0 0 0 2 0v-7.9c1.8-1 3-2.9 3-5.1a6 6 0 0 0-6-6z" />
        </svg>
      )
    case 'cushion':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="10" rx="2" />
          <path d="M7 10v4M12 10v4M17 10v4" />
        </svg>
      )
    case 'tools':
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.9 2.9-2.5-.7-.7-2.5z" />
        </svg>
      )
    default:
      return null
  }
}
