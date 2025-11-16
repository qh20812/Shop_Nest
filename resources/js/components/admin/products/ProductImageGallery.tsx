import React, { useState } from 'react';
import { useTranslation } from '../../../lib/i18n';

interface ProductImage {
    image_id: number;
    image_url: string;
    is_primary: boolean;
}

interface ProductImageGalleryProps {
    images: ProductImage[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const { t } = useTranslation();
    
    // Set the primary image as default, or the first image if no primary exists
    const primaryImage = images.find(img => img.is_primary) || images[0];
    const [selectedImage, setSelectedImage] = useState<ProductImage | null>(primaryImage || null);

    if (!images || images.length === 0) {
        return (
            <div className="product-gallery">
                <div className="product-gallery__main-image">
                    <div className="product-gallery__no-image">
                        <i className="bx bx-image"></i>
                        <span>{t('No images available')}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="product-gallery">
            {/* Main Image Display */}
            <div className="product-gallery__main-image">
                {selectedImage && (
                    <img
                        src={`/storage/${selectedImage.image_url}`}
                        alt={t('Product Image')}
                        className="product-gallery__main-img"
                    />
                )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
                <div className="product-gallery__thumbnails">
                    {images.map((image) => (
                        <button
                            key={image.image_id}
                            type="button"
                            className={`product-gallery__thumbnail ${
                                selectedImage?.image_id === image.image_id 
                                    ? 'product-gallery__thumbnail--active' 
                                    : ''
                            }`}
                            onClick={() => setSelectedImage(image)}
                        >
                            <img
                                src={`/storage/${image.image_url}`}
                                alt={`${t('Product Image')} ${image.image_id}`}
                                className="product-gallery__thumbnail-img"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
