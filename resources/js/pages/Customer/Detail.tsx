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
            toast.warning('Vui lòng chọn phiên bản sản phẩm');
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
                toast.success(data.message || 'Đã thêm vào giỏ hàng');
                router.reload();
                return;
            }

            if (data.action === 'login_required' && data.redirect) {
                window.location.href = data.redirect;
                return;
            }

            toast.error(data.message || 'Không thể thêm vào giỏ hàng');
        } catch {
            toast.error('Đã xảy ra lỗi khi thêm vào giỏ hàng');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!selectedVariant) {
            toast.warning('Vui lòng chọn phiên bản sản phẩm');
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

            toast.error(data.message || 'Không thể mua ngay');
        } catch {
            toast.error('Đã xảy ra lỗi khi mua ngay');
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

            toast.success(next ? 'Đã lưu sản phẩm' : 'Đã bỏ lưu sản phẩm', product.name);
        } catch {
            setFavorited(!next);
            toast.error('Không thể cập nhật danh sách yêu thích');
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
        specRows.unshift({ label: 'Thương hiệu', value: product.brand.name });
    }
    if (product.category) {
        specRows.unshift({ label: 'Danh mục', value: product.category.name });
    }

    const reviewItems = reviews.data.map((review) => ({
        id: review.id,
        user: {
            name: review.user?.username ?? 'Khách hàng',
            avatar: review.user?.avatar ?? null,
        },
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
        verified: true,
    }));

    return (
        <StorefrontLayout>
            <Head title={product.name} />

            <PageContainer className="py-6 md:py-8">
                <Breadcrumbs
                    items={[
                        { label: 'Chợ', href: '/' },
                        ...(product.category ? [{ label: product.category.name, href: `/search?category_ids[]=${product.category.id}` }] : []),
                        { label: product.name, current: true },
                    ]}
                />

                <div className="mt-5 grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <ProductGallery
                            images={product.images.map((image) => ({ id: image.image_id, url: image.url, alt: image.alt || product.name }))}
                            activeIndex={selectedImageIndex}
                            onChange={setSelectedImageIndex}
                            productName={product.name}
                            wishlisted={favorited}
                            onToggleWishlist={toggleWishlist}
                        />
                    </div>

                    <div className="lg:col-span-5">
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
                            trust={['Shop đã kiểm duyệt', 'Đổi trả 7 ngày', 'Bảo hành theo shop']}
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

                <div className="sticky top-header z-20 mt-8 border-y border-border bg-warm-porcelain">
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as DetailTab)}
                        variant="underline"
                        ariaLabel="Thông tin sản phẩm"
                        items={[
                            { value: 'description', label: 'Mô tả sản phẩm' },
                            { value: 'specs', label: 'Thông số', count: specRows.length },
                            { value: 'reviews', label: 'Đánh giá', count: rating.count },
                        ]}
                    />
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        {activeTab === 'description' && (
                            <div className="max-w-prose text-body-md leading-relaxed text-ink-muted [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
                                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            </div>
                        )}

                        {activeTab === 'specs' && <SpecTable rows={specRows} />}

                        {activeTab === 'reviews' && (
                            <div className="flex flex-col gap-6">
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
                                        title="Chưa có đánh giá nào"
                                        description="Sản phẩm này chưa có đánh giá từ khách hàng."
                                    />
                                ) : (
                                    <div className="flex flex-col">
                                        {reviewItems.map((review) => (
                                            <ReviewCard key={review.id} review={review} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <aside className="lg:col-span-4">
                        {product.shop && (
                            <Card padding="lg" className="flex flex-col gap-4">
                                <ShopIdentity shop={shopInfo!} />
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-control bg-rice-paper p-3">
                                        <span className="block font-mono text-headline-3 font-semibold text-ink">
                                            {product.shop.rating.toFixed(1)}
                                        </span>
                                        <span className="text-body-sm text-ink-muted">Đánh giá shop</span>
                                    </div>
                                    <div className="rounded-control bg-rice-paper p-3">
                                        <span className="block font-mono text-headline-3 font-semibold text-ink">
                                            {formatNumber(product.shop.total_products)}
                                        </span>
                                        <span className="text-body-sm text-ink-muted">Sản phẩm</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        leftIcon={MessageCircle}
                                        onClick={() => toast.info('Chat với shop sẽ sớm có mặt')}
                                    >
                                        Chat với shop
                                    </Button>
                                    <Button variant="ghost" size="sm" leftIcon={ShoppingBag} onClick={() => router.visit('/search')}>
                                        Xem thêm sản phẩm
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2 text-body-sm text-ink-muted">
                                    <Package aria-hidden="true" className="size-4 text-jade" />
                                    Shop giao hàng toàn quốc
                                </div>
                            </Card>
                        )}
                    </aside>
                </div>
            </PageContainer>
        </StorefrontLayout>
    );
}
