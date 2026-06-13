import React, { useState, useEffect } from 'react'
import { PLACEHOLDER_PRODUCT_IMAGE, getImageUrl } from '@/lib/utils'

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcPath?: string | null
  altText: string
  className?: string
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto'
}

const aspectClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  auto: '',
}

export function ProductImage({
  srcPath,
  altText,
  className = '',
  aspectRatio = 'auto',
  ...props
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Sincronizar ruta local/remota de la imagen
  useEffect(() => {
    setLoading(true)
    setHasError(false)
    const url = getImageUrl(srcPath)
    setImgSrc(url)
  }, [srcPath])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(PLACEHOLDER_PRODUCT_IMAGE)
    }
  }

  return (
    <div className={`relative overflow-hidden bg-surface-50 dark:bg-surface-800/50 flex items-center justify-center ${aspectClasses[aspectRatio]} ${className}`}>
      {/* Shimmer Placeholder Loader */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-100 dark:bg-surface-800">
          <div className="h-full w-full animate-shimmer bg-gradient-to-r from-surface-200 via-surface-100 to-surface-200 dark:from-surface-800 dark:via-surface-700 dark:to-surface-800 bg-[length:700px_100%]" />
        </div>
      )}

      {/* Imagen Real */}
      <img
        src={imgSrc}
        alt={altText}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={handleError}
        className={`h-full w-full object-contain transition-all duration-300 ${
          loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        {...props}
      />
    </div>
  )
}
