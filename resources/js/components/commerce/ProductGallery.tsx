import { Heart } from 'lucide-react';
import * as React from 'react';

import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';

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
    const [imageError, setImageError] = React.useState(false);
    const activeImage = images[activeIndex] ?? images[0];
    const imageUrl = imageError ? '/image/default-product.png' : activeImage?.url;

    React.useEffect(() => {
        setImageError(false);
    }, [activeImage?.url]);

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-surface border border-border bg-warm-porcelain p-2">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={activeImage?.alt ?? productName}
                        onError={() => setImageError(true)}
                        className="size-full rounded-card object-cover"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center rounded-card bg-raw-linen text-body-sm text-ink-muted">
                        Chưa có ảnh sản phẩm
                    </div>
                )}
                {onToggleWishlist && (
                    <IconButton
                        label={wishlisted ? 'Bỏ lưu sản phẩm' : 'Lưu sản phẩm'}
                        variant="secondary"
                        size="md"
                        className="absolute top-4 right-4"
                        onClick={onToggleWishlist}
                    >
                        <Heart aria-hidden="true" className={wishlisted ? 'fill-lacquer-red text-lacquer-red' : undefined} />
                    </IconButton>
                )}
            </div>

            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.slice(0, 5).map((image, index) => (
                        <button
                            key={image.id ?? image.url}
                            type="button"
                            aria-label={`Xem ảnh ${index + 1}`}
                            aria-pressed={index === activeIndex}
                            onClick={() => onChange(index)}
                            className={cn(
                                'focus-ring aspect-square overflow-hidden rounded-control border bg-warm-porcelain p-0.5 transition-colors',
                                index === activeIndex ? 'border-lacquer-red' : 'border-border hover:border-ink-muted',
                            )}
                        >
                            <img src={image.url} alt={image.alt ?? `${productName} ${index + 1}`} className="size-full rounded-chip object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export type { GalleryImage, ProductGalleryProps };
export default ProductGallery;
