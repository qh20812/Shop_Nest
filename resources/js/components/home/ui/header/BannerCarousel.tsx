import React, { useState, useEffect, useCallback, useRef } from 'react'

interface BannerCarouselProps {
  images: string[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

export default function BannerCarousel({
  images,
  autoPlay = true,
  autoPlayInterval = 5000,
  className = ''
}: BannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      setIsLoading(true)
      const loadPromises = images.map((src) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            resolve()
          }
          img.onerror = reject
          img.src = src
        })
      })

      try {
        await Promise.all(loadPromises)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to preload banner images:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    preloadImages()
  }, [images])

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isLoading && !hasError) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length)
      }, autoPlayInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, images.length, isLoading, hasError])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!carouselRef.current?.contains(event.target as Node)) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          prevSlide()
          break
        case 'ArrowRight':
          event.preventDefault()
          nextSlide()
          break
        case 'Home':
          event.preventDefault()
          goToSlide(0)
          break
        case 'End':
          event.preventDefault()
          goToSlide(images.length - 1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide, goToSlide, images.length])

  // Pause auto-play on hover/focus
  const handleMouseEnter = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (autoPlay && !isLoading && !hasError) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length)
      }, autoPlayInterval)
    }
  }, [autoPlay, autoPlayInterval, images.length, isLoading, hasError])

  if (hasError) {
    return (
      <div className={`banner-carousel error ${className}`} role="alert">
        <div className="carousel-error">
          <i className="bi bi-exclamation-triangle"></i>
          <span>Không thể tải hình ảnh banner</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`banner-carousel ${className}`}
      ref={carouselRef}
      role="region"
      aria-label="Banner carousel"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isLoading && (
        <div className="carousel-loading" aria-label="Đang tải banner">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="carousel-slides" aria-labelledby={`slide-${currentSlide}`}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Banner ${index + 1}`}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            loading="lazy"
            id={`slide-${index}`}
            aria-hidden={index !== currentSlide}
          />
        ))}
      </div>

      <button
        className="carousel-nav carousel-nav-prev"
        onClick={prevSlide}
        aria-label="Previous banner"
        disabled={isLoading}
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      <button
        className="carousel-nav carousel-nav-next"
        onClick={nextSlide}
        aria-label="Next banner"
        disabled={isLoading}
      >
        <i className="bi bi-chevron-right"></i>
      </button>

      <div className="carousel-dots" role="tablist" aria-label="Banner navigation">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to banner ${index + 1}`}
            aria-selected={index === currentSlide}
            role="tab"
            disabled={isLoading}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        Banner {currentSlide + 1} của {images.length}
      </div>
    </div>
  )
}