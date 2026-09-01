import type { CSSProperties, ReactNode } from 'react'
import './GradientText.css'

type Direction = 'horizontal' | 'vertical' | 'diagonal'

interface GradientTextProps {
  children: ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
  direction?: Direction
  showBorder?: boolean
  pauseOnHover?: boolean
  yoyo?: boolean
}

export default function GradientText({
  children,
  className = '',
  colors = ['#22d3ee', '#0ea5e9', '#6366f1'],
  animationSpeed = 8,
  direction = 'horizontal',
  showBorder = false,
  pauseOnHover = false,
  yoyo = true,
}: GradientTextProps) {
  const gradientAngle =
    direction === 'horizontal'
      ? 'to right'
      : direction === 'vertical'
        ? 'to bottom'
        : 'to bottom right'

  const gradientColors = [...colors, colors[0]].join(', ')
  const gradientImage = `linear-gradient(${gradientAngle}, ${gradientColors})`
  const keyframeName =
    direction === 'vertical' ? 'gradient-yoyo-vertical' : 'gradient-yoyo-horizontal'
  const animationValue = `${keyframeName} ${animationSpeed}s linear infinite ${
    yoyo ? 'alternate' : ''
  }`.trim()

  const gradientStyle: CSSProperties = {
    '--gradient-bg': gradientImage,
    '--gradient-size': direction === 'vertical' ? '100% 300%' : '300% 100%',
    '--gradient-animation': animationValue,
    '--gradient-half': `-${animationSpeed / 2}s`,
    backgroundImage: `var(--gradient-bg)`,
    backgroundSize: `var(--gradient-size)`,
    backgroundRepeat: 'repeat',
    animation: `var(--gradient-animation)`,
  } as CSSProperties

  return (
    <div
      className={`animated-gradient-text ${showBorder ? 'with-border' : ''} ${
        pauseOnHover ? 'pause-on-hover' : ''
      } ${className}`}
    >
      {showBorder && (
        <div className="gradient-overlay" style={gradientStyle} aria-hidden="true" />
      )}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
  )
}
