import { Head, router, usePage } from '@inertiajs/react';
import { Lock, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { BrandSpotlight } from '@/components/storefront/BrandSpotlight';
import { CategoryShelf, type CategoryItem } from '@/components/storefront/CategoryShelf';
import { EditorialPillars } from '@/components/storefront/EditorialPillars';
import { FlashSaleModule } from '@/components/storefront/FlashSaleModule';
import { HeroEditorial } from '@/components/storefront/HeroEditorial';
import { ProductShelf } from '@/components/storefront/ProductShelf';
import { TrustStrip } from '@/components/storefront/TrustStrip';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { usePageLoading } from '@/hooks/usePageLoading';
import { useTranslation } from '@/lib/i18n';
import type { ProductCardModel } from '@/types/commerce';

import styles from './Home.module.css';

interface Category {
    id: number;
    name: string;
    slug?: string;
    icon: string;
    image_url?: string;
}

interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    rating?: number;
    reviews?: number;
    category?: string;
    brand?: string;
}

interface FlashSaleEvent {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
}

interface FlashSale {
    event: FlashSaleEvent;
    products: Product[];
}

interface PageProps extends Record<string, unknown> {
    categories: Category[];
    flashSale: FlashSale | null;
    suggestedProducts: Product[];
    bestSellers: Product[];
    banners?: Array<{
        id: number;
        title?: string | null;
        subtitle?: string | null;
        link?: string | null;
        image: string;
        alt?: string | null;
        placement?: string | null;
    }>;
    canRegister?: boolean;
    auth?: {
        user: { id: number } | null;
    } | null;
}

const fallbackHeroImages = [
    {
        src: '/images/products/macbook-air-m3.jpg',
        altKey: 'Laptop on a desk',
        labelKey: 'Electronics',
    },
    {
        src: '/images/products/noi-chien-khong-dau-philips-hd9200.jpg',
        altKey: 'Air fryer in the kitchen',
        labelKey: 'Home appliances',
    },
    {
        src: '/images/products/vay-hoa-nhi-nu.jpg',
        altKey: 'Women fashion',
        labelKey: 'Fashion',
    },
];

const anchorCategoryKeys = ['Electronics & technology', 'Home & kitchen', 'Home & living', 'Mother & baby', 'Fashion & accessories', 'Beauty & care'];

const trustItems = [
    {
        icon: ShieldCheck,
        titleKey: 'Verified shops',
        descriptionKey: 'Seller profiles and product origin are checked before opening.',
    },
    {
        icon: RotateCcw,
        titleKey: '7-day returns',
        descriptionKey: 'Exchange or refund when the item is not as promised.',
    },
    {
        icon: Truck,
        titleKey: 'Nationwide delivery',
        descriptionKey: 'Shockproof packaging with order tracking.',
    },
    {
        icon: Lock,
        titleKey: 'Secure payment',
        descriptionKey: 'Stripe and cash on delivery supported.',
    },
];

const pillars = [
    {
        titleKey: 'Every item has a reason',
        descriptionKey: 'Six essential categories, chosen for Vietnamese homes.',
        image: '/images/shops/shopnest-official.jpg',
    },
    {
        titleKey: 'Clear information',
        descriptionKey: 'Origin, warranty and return policy shown before you buy.',
        image: '/images/products/samsung-galaxy-s24-ultra.jpg',
    },
    {
        titleKey: 'Support until delivery',
        descriptionKey: 'From choosing to receiving, our support team answers in chat.',
        image: '/images/shops/techzone.jpg',
    },
];

function normalizeImage(src: string | null | undefined, fallback = '/image/default-product.png'): string {
    if (!src) {
        return fallback;
    }

    if (/^https?:\/\//.test(src) || src.startsWith('/')) {
        return src;
    }

    return `/storage/${src}`;
}

function toProductCard(product: Product): ProductCardModel {
    return {
        id: product.id,
        slug: String(product.id),
        name: product.name,
        image: normalizeImage(product.image),
        imageAlt: product.name,
        shopName: '',
        price: product.price,
        compareAt: product.oldPrice,
        rating: product.rating ?? undefined,
        reviewCount: product.reviews ?? 0,
        metadata: product.category ?? product.brand ?? undefined,
        badges: product.discount ? ['sale'] : undefined,
        stock: 'in',
    };
}

export default function Index() {
    const { t } = useTranslation();
    const isLoading = usePageLoading({ delay: 300, minLoadingTime: 1500 });
    const { success, error: showError, info } = useToast();
    const { categories = [], flashSale = null, suggestedProducts = [], bestSellers = [], banners = [], auth } = usePage<PageProps>().props;

    const heroFallbacks = fallbackHeroImages.map((image) => ({
        src: image.src,
        alt: t(image.altKey),
        label: t(image.labelKey),
    }));

    const heroImages =
        banners.length > 0
            ? [
                  ...banners.map((banner) => ({
                      src: normalizeImage(banner.image),
                      alt: banner.alt ?? banner.title ?? 'ShopNest',
                      label: banner.subtitle ?? undefined,
                  })),
                  ...heroFallbacks,
              ].slice(0, 3)
            : heroFallbacks;

    const categoryItems: CategoryItem[] = categories.slice(0, 6).map((category) => ({
        id: category.id,
        name: category.name,
        imageUrl: normalizeImage(category.image_url, ''),
    }));

    const existingNames = new Set(categoryItems.map((category) => category.name.toLowerCase()));
    const filledCategories = [
        ...categoryItems,
        ...anchorCategoryKeys
            .map((key) => t(key))
            .filter((name) => !existingNames.has(name.toLowerCase()))
            .map((name) => ({ name })),
    ].slice(0, 6);

    const flashProducts = (flashSale?.products ?? []).map(toProductCard);
    const bestSellerCards = bestSellers.map(toProductCard);
    const suggestedCards = suggestedProducts.map(toProductCard);

    const handleAddToCart = (product: ProductCardModel) => {
        info(t('Choose a product variant'), product.name);
        router.visit(`/product/${product.id}`);
    };

    const handleWishlist = (product: ProductCardModel) => {
        if (!auth?.user) {
            router.visit('/login');

            return;
        }

        router.post(
            `/user/wishlist/items/${product.id}`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => success(t('Saved to your wishlist'), product.name),
                onError: () => showError(t('Could not save this item'), t('Sign in to use your wishlist.')),
            },
        );
    };

    if (isLoading) {
        return (
            <StorefrontLayout>
                <HomeSkeleton />
            </StorefrontLayout>
        );
    }

    return (
        <StorefrontLayout>
            <Head title={t('ShopNest. Everything for Vietnamese homes')} />

            <HeroEditorial
                eyebrow={t('Everything for Vietnamese homes')}
                title={
                    <>
                        {t('Choose carefully,')}
                        <br />
                        {t('live softly.')}
                    </>
                }
                subcopy={t('Electronics, home appliances, furniture, mother & baby, fashion and beauty from verified Vietnamese shops.')}
                cta={{ label: t('Browse the market'), href: '/search' }}
                images={heroImages}
            />

            <CategoryShelf categories={filledCategories} />

            {flashSale && (
                <FlashSaleModule
                    endsAt={flashSale.event.end_time}
                    name={flashSale.event.name}
                    products={flashProducts}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleWishlist}
                />
            )}

            <ProductShelf
                id="ban-chay"
                title={t('Best sellers')}
                description={t('Ranked by units sold on non-cancelled orders.')}
                products={bestSellerCards}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleWishlist}
                emptyTitle={t('No best sellers yet')}
                emptyDescription={t('No orders yet to compute the ranking.')}
            />

            <ProductShelf
                id="goi-y"
                title={t('Suggestions for your home')}
                description={t('Picked for today: work, cooking, childcare or self-care.')}
                products={suggestedCards}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleWishlist}
                emptyTitle={t('No suggestions yet')}
                emptyDescription={t('Add your favourite categories and brands in your account for better suggestions.')}
            />

            <BrandSpotlight />

            <EditorialPillars
                pillars={pillars.map((pillar) => ({
                    title: t(pillar.titleKey),
                    description: t(pillar.descriptionKey),
                    image: pillar.image,
                }))}
            />

            <TrustStrip
                items={trustItems.map((item) => ({
                    icon: item.icon,
                    title: t(item.titleKey),
                    description: t(item.descriptionKey),
                }))}
            />
        </StorefrontLayout>
    );
}

function HomeSkeleton() {
    return (
        <PageContainer className={styles.skeletonPage}>
            <div className={styles.skeletonGrid}>
                <div className={styles.skeletonCopy}>
                    <Skeleton className={styles.skeletonLineShort} />
                    <Skeleton className={styles.skeletonLine} />
                    <Skeleton className={styles.skeletonLineHalf} />
                    <Skeleton className={styles.skeletonLine} />
                    <Skeleton className={styles.skeletonCta} />
                </div>
                <div className={styles.skeletonMedia}>
                    <Skeleton className={styles.skeletonLead} />
                    <Skeleton className={styles.skeletonThumb} />
                    <Skeleton className={styles.skeletonThumb} />
                </div>
            </div>
            <div className={styles.skeletonCategoryGrid}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className={styles.skeletonCategory} />
                ))}
            </div>
            <div className={styles.skeletonProductGrid}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className={styles.skeletonProduct} />
                ))}
            </div>
        </PageContainer>
    );
}
