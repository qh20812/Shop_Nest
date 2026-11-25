import { Head, router } from '@inertiajs/react';
import { MessageCircle, Package, ShoppingBag } from 'lucide-react';
import * as React from 'react';

import { BuyBox } from '@/components/commerce/BuyBox';
import { ProductGallery } from '@/components/commerce/ProductGallery';
import { ReviewCard } from '@/components/commerce/ReviewCard';
import { ReviewSummary } from '@/components/commerce/ReviewSummary';
import { ShopIdentity } from '@/components/commerce/ShopIdentity';
import { SpecTable } from '@/components/commerce/SpecTable';
import { VariantSelector } from '@/components/commerce/VariantSelector';
import { PageContainer } from '@/components/layout/PageContainer';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

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

interface DetailProps {
    product: Product;
    reviews: ReviewsData;
    rating: Rating;
    sold_count: number;
}

type DetailTab = 'description' | 'specs' | 'reviews';

export default function Detail({ product, reviews, rating, sold_count }: DetailProps) {
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
    const [activeTab, setActiveTab] = React.useState<DetailTab>('description');
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

    const handleAttributeSelect = (attributeId: number, valueId: number) => {
        const next = { ...selectedAttributes, [attributeId]: valueId };
        setSelectedAttributes(next);

        const matchingVariant = product.variants.find((variant) =>
            variant.attribute_values.every((value) => next[value.attribute_id] === value.attribute_value_id),
        );

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

    const shopInfo = product.shop
        ? {
              id: product.shop.id,
              name: product.shop.name,
              logo: product.shop.logo,
              rating: product.shop.rating,
              totalProducts: product.shop.total_products,
              lastActiveAt: product.shop.last_active_at ?? undefined,
          }
        : undefined;

    const specRows = product.attributes.map((attribute) => ({
        label: attribute.name,
        value: attribute.values.map((value) => value.value).join(', '),
    }));

    if (product.brand) {
        specRows.unshift({ label: t('Brand'), value: product.brand.name });
    }
    if (product.category) {
        specRows.unshift({ label: t('Category'), value: product.category.name });
    }

    const reviewItems = reviews.data.map((review) => ({
        id: review.id,
        user: {
            name: review.user?.username ?? t('Customer'),
            avatar: review.user?.avatar ?? null,
        },
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
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
                        <BuyBox
                            title={product.name}
                            shop={shopInfo}
                            rating={rating.average}
                            reviewCount={rating.count}
                            soldCount={sold_count}
                            price={currentPrice}
                            compareAt={compareAt}
                            stock={selectedVariant?.available_quantity}
                            quantity={quantity}
                            maxQuantity={maxQuantity}
                            onQuantityChange={setQuantity}
                            onAddToCart={handleAddToCart}
                            onBuyNow={handleBuyNow}
                            adding={isAddingToCart}
                            buying={isBuyingNow}
                            trust={[t('Returns per policy'), t('Warranty by the shop')]}
                        >
                            <VariantSelector
                                groups={product.attributes.map((attribute) => ({
                                    id: attribute.attribute_id,
                                    name: attribute.name,
                                    values: attribute.values.map((value) => ({
                                        id: value.attribute_value_id,
                                        label: value.value,
                                        disabled: false,
                                    })),
                                }))}
                                selected={selectedAttributes}
                                onChange={handleAttributeSelect}
                            />
                        </BuyBox>
                    </div>
                </div>

                <div className={styles.tabsBar}>
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as DetailTab)}
                        variant="underline"
                        ariaLabel={t('Product information')}
                        items={[
                            { value: 'description', label: t('Product description') },
                            { value: 'specs', label: t('Specifications'), count: specRows.length },
                            { value: 'reviews', label: t('Reviews'), count: rating.count },
                        ]}
                    />
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.mainCol}>
                        {activeTab === 'description' && (
                            <div className={styles.description}>
                                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            </div>
                        )}

                        {activeTab === 'specs' && <SpecTable rows={specRows} />}

                        {activeTab === 'reviews' && (
                            <div className={styles.reviews}>
                                <ReviewSummary
                                    rating={rating.average}
                                    count={rating.count}
                                    breakdown={rating.breakdown.map((item) => ({
                                        ...item,
                                        percentage: rating.count > 0 ? Math.round((item.count / rating.count) * 100) : 0,
                                    }))}
                                />
                                {reviewItems.length === 0 ? (
                                    <EmptyState
                                        icon={MessageCircle}
                                        title={t('No reviews yet')}
                                        description={t('This product has no customer reviews yet.')}
                                    />
                                ) : (
                                    <div>
                                        {reviewItems.map((review) => (
                                            <ReviewCard key={review.id} review={review} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <aside className={styles.asideCol}>
                        {product.shop && (
                            <Card padding="lg" className={styles.shopCard}>
                                <ShopIdentity shop={shopInfo!} />
                                <div className={styles.shopStats}>
                                    <div className={styles.shopStat}>
                                        <span className={styles.shopStatValue}>{product.shop.rating.toFixed(1)}</span>
                                        <span className={styles.shopStatLabel}>{t('Shop rating')}</span>
                                    </div>
                                    <div className={styles.shopStat}>
                                        <span className={styles.shopStatValue}>{formatNumber(product.shop.total_products)}</span>
                                        <span className={styles.shopStatLabel}>{t('Products')}</span>
                                    </div>
                                </div>
                                <div className={styles.shopActions}>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        leftIcon={MessageCircle}
                                        onClick={() => toast.info(t('Shop chat is coming soon'))}
                                    >
                                        {t('Chat with the shop')}
                                    </Button>
                                    <Button variant="ghost" size="sm" leftIcon={ShoppingBag} onClick={() => router.visit('/search')}>
                                        {t('See more products')}
                                    </Button>
                                </div>
                                <div className={styles.shopNote}>
                                    <Package aria-hidden="true" className={styles.shopNoteIcon} />
                                    {t('The shop delivers nationwide')}
                                </div>
                            </Card>
                        )}
                    </aside>
                </div>
            </PageContainer>
        </StorefrontLayout>
    );
}
