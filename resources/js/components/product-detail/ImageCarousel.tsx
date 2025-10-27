import React from 'react';

export interface ProductImage {
  id: number;
  url: string;
  alt?: string | null;
}

interface ImageCarouselProps {
  images: ProductImage[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export default function ImageCarousel({ images, currentIndex, onSelect }: ImageCarouselProps) {
  if (images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex] ?? images[0];

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <img
          src={currentImage.url}
          alt={currentImage.alt || 'Product image'}
          className="product-main-image"
        />
      </div>
      {images.length > 1 && (
        <div className="product-thumbnail-list">
          {images.map((image, index) => (
            <button
              key={image.id ?? index}
              type="button"
              className={`product-thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => onSelect(index)}
              aria-label={`Preview image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={image.alt || `Product thumbnail ${index + 1}`}
                className="product-thumbnail-image"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
