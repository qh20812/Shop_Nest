import { useTranslation } from '@/lib/i18n';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
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
    const safeIndex = Math.min(Math.max(activeIndex, 0), Math.max(images.length - 1, 0));
    const activeImage = images[safeIndex] ?? images[0];
    const imageUrl = imageError ? '/image/default-product.png' : activeImage?.url;
    const hasMultiple = images.length > 1;

    React.useEffect(() => {
        setImageError(false);
    }, [activeImage?.url]);

    const showImage = (index: number) => {
        if (!hasMultiple) {
            return;
        }

        onChange((index + images.length) % images.length);
    };

    return (
        <div className={cx(styles.gallery, className)}>
            <div
                className={styles.galleryMain}
                tabIndex={0}
                role="group"
                aria-label={productName}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft') {
                        event.preventDefault();
                        showImage(safeIndex - 1);
                    }

                    if (event.key === 'ArrowRight') {
                        event.preventDefault();
                        showImage(safeIndex + 1);
                    }
                }}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt={activeImage?.alt ?? productName} onError={() => setImageError(true)} className={styles.galleryImage} />
                ) : (
                    <div className={styles.galleryEmpty}>{t('No product images yet')}</div>
                )}

                {onToggleWishlist && (
                    <IconButton
                        label={wishlisted ? t('Remove from wishlist') : t('Save to wishlist')}
                        variant="secondary"
                        surface="overlay"
                        size="md"
                        className={styles.galleryWishlist}
                        onClick={onToggleWishlist}
                    >
                        <Heart aria-hidden="true" className={cx(styles.icon, wishlisted && styles.wishlisted)} />
                    </IconButton>
                )}

                {hasMultiple && (
                    <>
                        <span className={cx(styles.galleryNav, styles.galleryPrev)}>
                            <IconButton
                                label={t('Previous image')}
                                variant="secondary"
                                surface="overlay"
                                size="md"
                                onClick={() => showImage(safeIndex - 1)}
                            >
                                <ChevronLeft aria-hidden="true" className={styles.icon} />
                            </IconButton>
                        </span>
                        <span className={cx(styles.galleryNav, styles.galleryNext)}>
                            <IconButton
                                label={t('Next image')}
                                variant="secondary"
                                surface="overlay"
                                size="md"
                                onClick={() => showImage(safeIndex + 1)}
                            >
                                <ChevronRight aria-hidden="true" className={styles.icon} />
                            </IconButton>
                        </span>
                        <span className={styles.galleryCounter}>
                            {safeIndex + 1} / {images.length}
                        </span>
                    </>
                )}
            </div>

            {hasMultiple && (
                <div className={styles.galleryThumbs}>
                    {images.map((image, index) => (
                        <button
                            key={`${image.id ?? image.url}-${index}`}
                            type="button"
                            aria-label={t('View image :index', { index: index + 1 })}
                            aria-pressed={index === safeIndex}
                            onClick={() => onChange(index)}
                            className={styles.galleryThumb}
                            data-active={index === safeIndex ? 'true' : undefined}
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
