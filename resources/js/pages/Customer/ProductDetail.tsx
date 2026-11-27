import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import * as React from 'react';

import { BuyBox } from '@/components/commerce/BuyBox';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ProductGallery } from '@/components/commerce/ProductGallery';
import { Rating } from '@/components/commerce/Rating';
import { ReviewCard } from '@/components/commerce/ReviewCard';
import { ReviewSummary } from '@/components/commerce/ReviewSummary';
import { ShopIdentity } from '@/components/commerce/ShopIdentity';
import { SpecTable } from '@/components/commerce/SpecTable';
import { VariantSelector } from '@/components/commerce/VariantSelector';
import { PageContainer } from '@/components/layout/PageContainer';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { TextLink } from '@/components/ui/text-link';
import { useToast } from '@/components/ui/toast';
import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import type { ProductCardModel } from '@/types/commerce';

import styles from './ProductDetail.module.css';

interface AttributeValue {
    attribute_value_id: number;
    attribute_id: number;
    value: string;
}

interface Variant {
    variant_id: number;
    sku: string;
    price: number;
    sale_price: number | null;
    final_price: number;
    stock_quantity: number;
    available_quantity: number;
    reserved_quantity: number;
    attribute_values: AttributeValue[];
}

interface Attribute {
    attribute_id: number;
    name: string;
    values: Array<{
        attribute_value_id: number;
        value: string;
    }>;
}

interface Image {
    image_id: number;
    url: string;
    alt: string;
}

interface Shop {
    id: number;
    name: string;
    logo: string | null;
    rating: number;
    total_products: number;
    last_active_at: string | null;
}

interface Product {
    id: number;
    name: string;
    description: string;
    category: { id: number; name: string } | null;
    brand: { id: number; name: string } | null;
    images: Image[];
    variants: Variant[];
    attributes: Attribute[];
    default_variant_id: number | null;
    min_price: number;
    max_price: number;
    shop: Shop | null;
}

interface Rating {
    average: number;
    count: number;
    breakdown: Array<{
        rating: number;
        count: number;
        percentage: number;
    }>;
}

interface Review {
    id: number;
    user: {
        id: number;
        username: string;
        avatar: string | null;
    } | null;
    rating: number;
    comment: string;
    created_at: string;
    created_at_human: string;
}

interface ReviewsData {
    data: Review[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links: {
        next: string | null;
        prev: string | null;
    };
}

interface RelatedProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    max_price: number;
    rating: number;
    sold_count: number;
}

interface DetailProps {
    product: Product;
    reviews: ReviewsData;
    rating: Rating;
    sold_count: number;
    relatedProducts?: RelatedProduct[];
}

function normalizeImage(src: string | null | undefined): string {
    if (!src) {
        return '/image/default-product.png';
    }

    if (/^https?:\/\//.test(src) || src.startsWith('/')) {
        return src;
    }

    return `/storage/${src.replace(/^\/+/, '')}`;
}

export default function Detail({ product, reviews, rating, sold_count, relatedProducts = [] }: DetailProps) {
    const { t } = useTranslation();
    const [selectedVariant, setSelectedVariant] = React.useState<Variant | null>(
        product.variants.find((variant) => variant.variant_id === product.default_variant_id) || product.variants[0] || null,
    );
    const [selectedAttributes, setSelectedAttributes] = React.useState<Record<number, number>>(() => {
        const initial: Record<number, number> = {};

        if (selectedVariant) {
            selectedVariant.attribute_values.forEach((value) => {
                initial[value.attribute_id] = value.attribute_value_id;
            });
        }

        return initial;
    });
    const [quantity, setQuantity] = React.useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    const [isAddingToCart, setIsAddingToCart] = React.useState(false);
    const [isBuyingNow, setIsBuyingNow] = React.useState(false);
    const [favorited, setFavorited] = React.useState(false);
    const toast = useToast();

    React.useEffect(() => {
        (async () => {
            try {
                const response = await fetch('/user/wishlist/items');
                if (response.status === 401) return;
                const data = await response.json();
                if (Array.isArray(data.items)) {
                    setFavorited(data.items.includes(product.id));
                }
            } catch {
                // Wishlist status is optional; keep the page usable.
            }
        })();
    }, [product.id]);

    React.useEffect(() => {
        if (!selectedVariant) return;
        setQuantity((current) => Math.min(Math.max(1, current), Math.max(1, selectedVariant.available_quantity)));
    }, [selectedVariant]);

    const matchesSelection = (variant: Variant, selection: Record<number, number>) => {
        if (product.attributes.length === 0) {
            return true;
        }

        return product.attributes.every((attribute) =>
            variant.attribute_values.some(
                (value) => value.attribute_id === attribute.attribute_id && value.attribute_value_id === selection[attribute.attribute_id],
            ),
        );
    };

    const isValueAvailable = (attributeId: number, valueId: number) => {
        const next = { ...selectedAttributes, [attributeId]: valueId };

        return product.variants.some((variant) => matchesSelection(variant, next));
    };

    const handleAttributeSelect = (attributeId: number, valueId: number) => {
        const next = { ...selectedAttributes, [attributeId]: valueId };
        setSelectedAttributes(next);

        const matchingVariant = product.variants.find((variant) => matchesSelection(variant, next));

        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
        }
    };

    const currentPrice = selectedVariant?.final_price ?? product.min_price;
    const compareAt = selectedVariant && selectedVariant.price > selectedVariant.final_price ? selectedVariant.price : undefined;
    const maxQuantity = Math.max(1, Math.min(selectedVariant?.available_quantity ?? 1, 99));

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            toast.warning(t('Please choose a product variant'));
            return;
        }

        setIsAddingToCart(true);

        try {
            const response = await fetch(`/product/${product.id}/add-to-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ variant_id: selectedVariant.variant_id, quantity }),
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message || t('Added to cart'));
                router.reload();
                return;
            }

            if (data.action === 'login_required' && data.redirect) {
                window.location.href = data.redirect;
                return;
            }

            toast.error(data.message || t('Could not add to cart'));
        } catch {
            toast.error(t('Something went wrong while adding to cart'));
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!selectedVariant) {
            toast.warning(t('Please choose a product variant'));
            return;
        }

        setIsBuyingNow(true);

        try {
            const response = await fetch(`/product/${product.id}/buy-now`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ variant_id: selectedVariant.variant_id, quantity }),
            });
            const data = await response.json();

            if (data.success && (data.redirect_url || data.redirect)) {
                window.location.href = data.redirect_url || data.redirect;
                return;
            }

            if (data.action === 'login_required' && data.redirect) {
                window.location.href = data.redirect;
                return;
            }

            toast.error(data.message || t('Could not buy now'));
        } catch {
            toast.error(t('Something went wrong while buying now'));
        } finally {
            setIsBuyingNow(false);
        }
    };

    const toggleWishlist = async () => {
        const next = !favorited;
        setFavorited(next);

        try {
            const response = await fetch(`/user/wishlist/items/${product.id}`, {
                method: next ? 'POST' : 'DELETE',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
            });

            if (response.status === 401) {
                const data = await response.json();
                if (data.redirect) window.location.href = data.redirect;
                return;
            }

            toast.success(next ? t('Saved to your wishlist') : t('Removed from your wishlist'), product.name);
        } catch {
            setFavorited(!next);
            toast.error(t('Could not update your wishlist'));
        }
    };

    const goToReviewPage = (page: number) => {
        if (page < 1 || page > reviews.meta.last_page || page === reviews.meta.current_page) {
            return;
        }

        router.get(window.location.pathname, page > 1 ? { page } : {}, {
            only: ['reviews'],
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                document.getElementById('reviews')?.scrollIntoView({ block: 'start' });
            },
        });
    };

    const shopInfo = product.shop
        ? {
              id: product.shop.id,
              name: product.shop.name,
              logo: product.shop.logo,
              rating: product.shop.rating,
              totalProducts: product.shop.total_products,
          }
        : undefined;

    const specRows: Array<{ label: string; value: string }> = [];

    if (product.category) {
        specRows.push({ label: t('Category'), value: product.category.name });
    }
    if (product.brand) {
        specRows.push({ label: t('Brand'), value: product.brand.name });
    }
    if (selectedVariant?.sku) {
        specRows.push({ label: t('SKU'), value: selectedVariant.sku });
    }
    if (selectedVariant) {
        selectedVariant.attribute_values.forEach((value) => {
            const attribute = product.attributes.find((item) => item.attribute_id === value.attribute_id);

            if (attribute) {
                specRows.push({ label: attribute.name, value: value.value });
            }
        });
    }

    const hasDescription = product.description.replace(/<[^>]*>/g, '').trim().length > 0;
    const hasSpecs = specRows.length > 0;
    const relatedHref = product.category ? `/search?category_ids[]=${product.category.id}` : '/search';

    const relatedCards: ProductCardModel[] = relatedProducts.map((item) => ({
        id: item.id,
        slug: String(item.id),
        name: item.name,
        image: normalizeImage(item.image),
        imageAlt: item.name,
        shopName: '',
        price: item.price,
        rating: item.rating > 0 ? item.rating : undefined,
    }));

    const reviewItems = reviews.data.map((review) => ({
        id: review.id,
        user: {
            name: review.user?.username ?? t('Customer'),
            avatar: review.user?.avatar ?? null,
        },
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at_human || review.created_at,
    }));

    return (
        <StorefrontLayout>
            <Head title={product.name} />

            <PageContainer className={styles.page}>
                <Breadcrumbs
                    className={styles.breadcrumbs}
                    items={[
                        { label: t('Market'), href: '/' },
                        ...(product.category ? [{ label: product.category.name, href: `/search?category_ids[]=${product.category.id}` }] : []),
                        { label: product.name, current: true },
                    ]}
                />

                <div className={styles.topGrid}>
                    <div className={styles.galleryCol}>
                        <ProductGallery
                            images={product.images.map((image) => ({ id: image.image_id, url: image.url, alt: image.alt || product.name }))}
                            activeIndex={selectedImageIndex}
                            onChange={setSelectedImageIndex}
                            productName={product.name}
                            wishlisted={favorited}
                            onToggleWishlist={toggleWishlist}
                        />
                    </div>

                    <div className={styles.buyCol}>
                        <div className={styles.introCol}>
                            {shopInfo && (
                                <ShopIdentity
                                    shop={shopInfo}
                                    variant="compact"
                                    chatLabel={t('Chat with the shop')}
                                    viewShopLabel={t('See more products')}
                                    onChat={() => toast.info(t('Shop chat is coming soon'))}
                                    onViewShop={() => router.visit(relatedHref)}
                                />
                            )}

                            <h1 className={styles.title}>{product.name}</h1>

                            <div className={styles.metaRow}>
                                {rating.average > 0 && (
                                    <a href="#reviews" className={styles.ratingLink}>
                                        <Rating value={rating.average} count={rating.count} compact chip />
                                    </a>
                                )}
                                <span>{t('Sold :count', { count: formatNumber(sold_count) })}</span>
                            </div>
                        </div>

                        <div className={styles.purchaseCol}>
                            <BuyBox
                                price={currentPrice}
                                compareAt={compareAt}
                                stock={selectedVariant?.available_quantity}
                                canBuy={Boolean(selectedVariant)}
                                quantity={quantity}
                                maxQuantity={maxQuantity}
                                onQuantityChange={setQuantity}
                                onAddToCart={handleAddToCart}
                                onBuyNow={handleBuyNow}
                                adding={isAddingToCart}
                                buying={isBuyingNow}
                                trust={[t('Returns per policy'), t('Warranty by the shop'), t('The shop delivers nationwide')]}
                            >
                                <VariantSelector
                                    groups={product.attributes.map((attribute) => ({
                                        id: attribute.attribute_id,
                                        name: attribute.name,
                                        values: attribute.values.map((value) => ({
                                            id: value.attribute_value_id,
                                            label: value.value,
                                            disabled: !isValueAvailable(attribute.attribute_id, value.attribute_value_id),
                                        })),
                                    }))}
                                    selected={selectedAttributes}
                                    onChange={handleAttributeSelect}
                                />
                            </BuyBox>
                        </div>
                    </div>
                </div>

                {(hasDescription || hasSpecs) && (
                    <section id="details" className={styles.section}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>{t('Details')}</h2>
                        </div>

                        <div className={styles.detailsGrid} data-single={!hasDescription || !hasSpecs ? 'true' : undefined}>
                            {hasDescription && (
                                <div className={styles.detailsCol}>
                                    <h3 className={styles.subTitle}>{t('Product description')}</h3>
                                    <div className={styles.description} dangerouslySetInnerHTML={{ __html: product.description }} />
                                </div>
                            )}

                            {hasSpecs && (
                                <div className={styles.detailsCol}>
                                    <h3 className={styles.subTitle}>{t('Specifications')}</h3>
                                    <SpecTable rows={specRows} />
                                </div>
                            )}
                        </div>
                    </section>
                )}

                <section id="reviews" className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>{t('Reviews')}</h2>
                    </div>

                    <div className={styles.reviewGrid}>
                        <ReviewSummary
                            rating={rating.average}
                            count={rating.count}
                            breakdown={rating.breakdown.map((item) => ({
                                ...item,
                                percentage: rating.count > 0 ? Math.round((item.count / rating.count) * 100) : 0,
                            }))}
                        />

                        <div className={styles.reviewList}>
                            {reviewItems.length === 0 ? (
                                <EmptyState
                                    icon={MessageCircle}
                                    title={t('No reviews yet')}
                                    description={t('This product has no customer reviews yet.')}
                                />
                            ) : (
                                reviewItems.map((review) => <ReviewCard key={review.id} review={review} />)
                            )}

                            {reviews.meta.last_page > 1 && (
                                <div className={styles.reviewPager}>
                                    <IconButton
                                        label={t('Previous page')}
                                        variant="secondary"
                                        size="sm"
                                        disabled={reviews.meta.current_page <= 1}
                                        onClick={() => goToReviewPage(reviews.meta.current_page - 1)}
                                    >
                                        <ChevronLeft aria-hidden="true" className={styles.pagerIcon} />
                                    </IconButton>
                                    <span className={styles.pagerStatus}>
                                        {t('Page :current of :total', {
                                            current: reviews.meta.current_page,
                                            total: reviews.meta.last_page,
                                        })}
                                    </span>
                                    <IconButton
                                        label={t('Next page')}
                                        variant="secondary"
                                        size="sm"
                                        disabled={reviews.meta.current_page >= reviews.meta.last_page}
                                        onClick={() => goToReviewPage(reviews.meta.current_page + 1)}
                                    >
                                        <ChevronRight aria-hidden="true" className={styles.pagerIcon} />
                                    </IconButton>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {relatedCards.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>{t('Related products')}</h2>
                            <TextLink href={relatedHref} tone="muted" underline={false}>
                                {t('View all')}
                            </TextLink>
                        </div>

                        <div className={styles.relatedGrid}>
                            {relatedCards.map((card, index) => (
                                <ProductCard key={card.id} product={card} priority={index < 2} />
                            ))}
                        </div>
                    </section>
                )}
            </PageContainer>
        </StorefrontLayout>
    );
}
