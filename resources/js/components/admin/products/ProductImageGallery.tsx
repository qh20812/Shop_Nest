import { ImageOff } from 'lucide-react';
import { useState } from 'react';

import { useTranslation } from '../../../lib/i18n';

import styles from './products.module.css';

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
    const resolveSrc = (url?: string) => {
        if (!url) return '/image/ShopnestLogo.png';
        if (/^https?:\/\//i.test(url) || url.startsWith('/')) {
            return url;
        }
        return `/storage/${url}`;
    };

    const primaryImage = images.find((image) => image.is_primary) || images[0];
    const [selectedImage, setSelectedImage] = useState<ProductImage | null>(primaryImage || null);

    if (!images || images.length === 0) {
        return (
            <div className={styles.gallery}>
                <div className={styles.mainImage}>
                    <div className={styles.noImage}>
                        <ImageOff aria-hidden="true" className={styles.noImageIcon} />
                        <span>{t('No images available')}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.gallery}>
            <div className={styles.mainImage}>
                {selectedImage && <img src={resolveSrc(selectedImage.image_url)} alt={t('Product Image')} className={styles.mainImg} />}
            </div>

            {images.length > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((image) => {
                        const active = selectedImage?.image_id === image.image_id;

                        return (
                            <button
                                key={image.image_id}
                                type="button"
                                className={`${styles.thumbnail} ${active ? styles.thumbnailActive : ''}`.trim()}
                                onClick={() => setSelectedImage(image)}
                                aria-pressed={active}
                                aria-label={`${t('Product Image')} ${image.image_id}`}
                            >
                                <img src={resolveSrc(image.image_url)} alt="" className={styles.thumbnailImg} />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
