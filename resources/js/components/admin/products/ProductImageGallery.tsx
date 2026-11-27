import { ImageOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './products.module.css';

interface ProductImage {
    image_id: number;
    image_url: string;
    is_primary: boolean;
}

interface ProductImageGalleryProps {
    images?: ProductImage[];
    productName: string;
}

const resolveSrc = (url?: string) => {
    if (!url) {
        return null;
    }

    if (/^https?:\/\//i.test(url) || url.startsWith('/')) {
        return url;
    }

    return `/storage/${url}`;
};

export default function ProductImageGallery({ images = [], productName }: ProductImageGalleryProps) {
    const { t } = useTranslation();
    const primaryImage = useMemo(() => images.find((image) => image.is_primary) ?? images[0] ?? null, [images]);
    const [selectedId, setSelectedId] = useState<number | null>(primaryImage?.image_id ?? null);

    useEffect(() => {
        setSelectedId(primaryImage?.image_id ?? null);
    }, [primaryImage?.image_id]);

    const selectedImage = images.find((image) => image.image_id === selectedId) ?? primaryImage;
    const selectedSrc = resolveSrc(selectedImage?.image_url);

    if (images.length === 0 || !selectedSrc) {
        return (
            <div className={styles.galleryEmpty}>
                <ImageOff aria-hidden="true" className={styles.galleryEmptyIcon} />
                <span>{t('No images available')}</span>
            </div>
        );
    }

    return (
        <div className={styles.gallery}>
            <div className={styles.mainImage}>
                <img src={selectedSrc} alt={productName} className={styles.mainImageTag} />
            </div>

            {images.length > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((image, index) => {
                        const active = image.image_id === selectedImage?.image_id;
                        const src = resolveSrc(image.image_url);

                        return (
                            <button
                                key={image.image_id}
                                type="button"
                                className={cx(styles.thumbnail, active && styles.thumbnailActive)}
                                onClick={() => setSelectedId(image.image_id)}
                                aria-pressed={active}
                                aria-label={`${t('Product Image')} ${index + 1}`}
                            >
                                {src && <img src={src} alt="" className={styles.thumbnailImg} />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
