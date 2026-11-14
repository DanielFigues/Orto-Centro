import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type SyntheticEvent,
} from 'react'

const RATIO_TOLERANCE = 0.15
/** Padding kept around the sharp photo in two-layer mode (percent of box width). */
const PHOTO_PADDING = 4

interface FitImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  /** Load eagerly with high fetch priority (above-the-fold images). */
  priority?: boolean
  /** CSS object-position used when the photo is cropped to cover its box. */
  focalPoint?: string
  /** Edge fade width (percent of the picture) on the axis with room around it. */
  feather?: number
  /**
   * Edge fade width (percent) on the axis where the picture meets the padding.
   * Defaults to `feather`; lower it when the photo's subject reaches that edge.
   */
  edgeFeather?: number
  /** Blur radius in pixels for the backdrop copy. */
  blur?: number
  onError?: () => void
}

/**
 * Shows a product photo inside a fixed-size box without cropping the subject.
 *
 * The parent element defines the box (size, border radius and overflow). When
 * the photo's natural aspect ratio is close to the box, a single `object-fit:
 * cover` image is rendered. Otherwise the photo is shown over a blurred copy of
 * itself, so the box stays completely filled without cutting the product. The
 * sharp copy fades into the backdrop on all four sides.
 */
export function FitImage(props: FitImageProps) {
  // Remount when the source changes so the measured ratio never goes stale.
  return <FitImageContent key={props.src} {...props} />
}

function FitImageContent({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  focalPoint = 'center',
  feather = 12,
  edgeFeather,
  blur = 20,
  onError,
}: FitImageProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const [containerSize, setContainerSize] = useState<{
    width: number
    height: number
  } | null>(null)
  const [naturalRatio, setNaturalRatio] = useState<number | null>(
    width && height ? width / height : null,
  )
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const box = container.parentElement ?? container
    const measure = () => {
      const rect = box.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize((previous) => {
          if (
            previous &&
            Math.abs(previous.width - rect.width) < 0.5 &&
            Math.abs(previous.height - rect.height) < 0.5
          ) {
            return previous
          }
          return { width: rect.width, height: rect.height }
        })
      }
    }

    const observer = new ResizeObserver(measure)
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  const handleLoad = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget
    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
      setNaturalRatio(image.naturalWidth / image.naturalHeight)
    }
    setIsLoaded(true)
  }, [])

  // Cached images can be complete before React attaches onLoad.
  const handleImageRef = useCallback((image: HTMLImageElement | null) => {
    if (!image || !image.complete || image.naturalWidth <= 0) return
    setNaturalRatio(image.naturalWidth / image.naturalHeight)
    setIsLoaded(true)
  }, [])

  const containerRatio = containerSize
    ? containerSize.width / containerSize.height
    : null
  const ratioIsKnown =
    isLoaded && naturalRatio !== null && containerRatio !== null
  const shouldCover =
    ratioIsKnown &&
    Math.abs(naturalRatio / containerRatio - 1) < RATIO_TOLERANCE

  const loading = priority ? 'eager' : 'lazy'
  const fetchPriority = priority ? 'high' : 'auto'

  if (shouldCover) {
    return (
      <span ref={containerRef} className={`relative block h-full w-full ${className}`}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          draggable={false}
          ref={handleImageRef}
          onLoad={handleLoad}
          onError={onError}
          className="h-full w-full object-cover"
          style={{ objectPosition: focalPoint }}
        />
      </span>
    )
  }

  // Size the masked wrapper to exactly the visible picture inside the padding.
  let pictureSize: {
    width: number
    height: number
    heightBound: boolean
  } | null = null
  if (containerSize && naturalRatio) {
    const pad = (PHOTO_PADDING / 100) * containerSize.width
    const contentWidth = containerSize.width - pad * 2
    const contentHeight = containerSize.height - pad * 2
    if (contentWidth > 0 && contentHeight > 0) {
      const heightBound = naturalRatio < contentWidth / contentHeight
      const pictureHeight = heightBound
        ? contentHeight
        : contentWidth / naturalRatio
      pictureSize = {
        width: heightBound ? pictureHeight * naturalRatio : contentWidth,
        height: pictureHeight,
        heightBound,
      }
    }
  }

  // On the constrained axis the picture sits against the padding, where the
  // subject often reaches the edge, so it gets the (usually smaller) edge fade.
  const touchingFeather = edgeFeather ?? feather
  const featherX = pictureSize?.heightBound ? feather : touchingFeather
  const featherY = pictureSize?.heightBound ? touchingFeather : feather
  const maskImage = pictureSize
    ? [
        'linear-gradient(to right, transparent 0, #000 var(--feather-x), #000 calc(100% - var(--feather-x)), transparent 100%)',
        'linear-gradient(to bottom, transparent 0, #000 var(--feather-y), #000 calc(100% - var(--feather-y)), transparent 100%)',
      ].join(', ')
    : undefined

  return (
    <span
      ref={containerRef}
      className={`relative block h-full w-full ${className}`}
      style={
        {
          '--blur': `${blur}px`,
        } as CSSProperties
      }
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover opacity-100 dark:opacity-70"
        style={{
          objectPosition: focalPoint,
          filter: 'blur(var(--blur)) saturate(1.1)',
          transform: 'scale(1.3)',
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center" style={{ padding: `${PHOTO_PADDING}%` }}>
        <span
          className="relative block"
          style={
            {
              width: pictureSize?.width,
              height: pictureSize?.height,
              aspectRatio: naturalRatio ?? undefined,
              visibility: pictureSize ? undefined : 'hidden',
              '--feather-x': `${featherX}%`,
              '--feather-y': `${featherY}%`,
              maskImage,
              WebkitMaskImage: maskImage,
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect',
            } as CSSProperties
          }
        >
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            fetchPriority={fetchPriority}
            draggable={false}
            ref={handleImageRef}
            onLoad={handleLoad}
            onError={onError}
            className="h-full w-full"
            style={{ objectFit: pictureSize ? 'cover' : 'contain' }}
          />
        </span>
      </span>
    </span>
  )
}
