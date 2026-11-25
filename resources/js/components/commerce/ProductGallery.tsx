import { useTranslation } from '@/lib/i18n';
import { Heart } from 'lucide-react';
import * as React from 'react';

import { IconButton } from '@/components/ui/icon-button';
import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type GalleryImage = {
    id?: number | string;
    url: string;
    alt?: string;
};

type ProductGalleryProps = {
    images: GalleryImage[];
    activeIndex: number;
    onChange: (index: number) => void;
    productName: string;
    wishlisted?: boolean;
    onToggleWishlist?: () => void;
    className?: string;
};

export function ProductGallery({ images, activeIndex, onChange, productName, wishlisted = false, onToggleWishlist, className }: ProductGalleryProps) {
    const { t } = useTranslation();
    const [imageError, setImageError] = React.useState(false);
    const activeImage = images[activeIndex] ?? images[0];
    const imageUrl = imageError ? '/image/default-product.png' : activeImage?.url;

    React.useEffect(() => {
        setImageError(false);
    }, [activeImage?.url]);

    return (
        <div className={cx(styles.gallery, className)}>
            <div className={styles.galleryMain}>
                {imageUrl ? (
                    <img src={imageUrl} alt={activeImage?.alt ?? productName} onError={() => setImageError(true)} className={styles.galleryImage} />
                ) : (
                    <div className={styles.galleryEmpty}>{t('No product images yet')}</div>
                )}

                {onToggleWishlist && (
                    <IconButton
                        label={wishlisted ? t('Remove from wishlist') : t('Save to wishlist')}
                        variant="secondary"
                        size="md"
                        className={styles.galleryWishlist}
                        onClick={onToggleWishlist}
                    >
                        <Heart aria-hidden="true" className={cx(styles.icon, wishlisted && styles.wishlisted)} />
                    </IconButton>
                )}
            </div>

            {images.length > 1 && (
                <div className={styles.galleryThumbs}>
                    {images.slice(0, 5).map((image, index) => (
                        <button
                            key={image.id ?? image.url}
                            type="button"
                            aria-label={t('View image :index', { index: index + 1 })}
                            aria-pressed={index === activeIndex}
                            onClick={() => onChange(index)}
                            className={styles.galleryThumb}
                            data-active={index === activeIndex ? 'true' : undefined}
                        >
                            <img src={image.url} alt={image.alt ?? `${productName} ${index + 1}`} className={styles.galleryThumbImage} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export type { GalleryImage, ProductGalleryProps };
export default ProductGallery;
