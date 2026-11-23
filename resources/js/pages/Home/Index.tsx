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
        alt: 'Laptop trên bàn làm việc',
        label: 'Điện tử',
    },
    {
        src: '/images/products/noi-chien-khong-dau-philips-hd9200.jpg',
        alt: 'Nồi chiên trong bếp',
        label: 'Gia dụng',
    },
    {
        src: '/images/products/vay-hoa-nhi-nu.jpg',
        alt: 'Thời trang nữ',
        label: 'Thời trang',
    },
];

const anchorCategoryNames = [
    'Điện tử & công nghệ',
    'Gia dụng & nhà bếp',
    'Nhà cửa & trang trí',
    'Mẹ & bé',
    'Thời trang & phụ kiện',
    'Làm đẹp & chăm sóc',
];

const trustItems = [
    {
        icon: ShieldCheck,
        title: 'Shop đã kiểm duyệt',
        description: 'Hồ sơ và nguồn gốc được kiểm tra trước khi mở bán.',
    },
    {
        icon: RotateCcw,
        title: 'Đổi trả 7 ngày',
        description: 'Đổi hoặc hoàn khi sản phẩm sai cam kết.',
    },
    {
        icon: Truck,
        title: 'Giao toàn quốc',
        description: 'Đóng gói chống sốc, có mã theo dõi đơn.',
    },
    {
        icon: Lock,
        title: 'Thanh toán bảo mật',
        description: 'Hỗ trợ Stripe và thanh toán khi nhận hàng.',
    },
];

const pillars = [
    {
        title: 'Mỗi món đều có lý do',
        description: 'Sáu nhóm ngành thiết yếu, chọn theo nhu cầu của tổ ấm Việt.',
        image: '/images/shops/shopnest-official.jpg',
    },
    {
        title: 'Thông tin rõ ràng',
        description: 'Nguồn gốc, bảo hành và chính sách đổi trả hiển thị trước khi mua.',
        image: '/images/products/samsung-galaxy-s24-ultra.jpg',
    },
    {
        title: 'Hỗ trợ đến khi nhận',
        description: 'Từ lúc chọn món đến khi nhận hàng, đội hỗ trợ trả lời trong chat.',
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
    const isLoading = usePageLoading({ delay: 300, minLoadingTime: 1500 });
    const { success, error: showError, info } = useToast();
    const { categories = [], flashSale = null, suggestedProducts = [], bestSellers = [], banners = [], auth } = usePage<PageProps>().props;

    const heroImages =
        banners.length > 0
            ? [
                  ...banners.map((banner) => ({
                      src: normalizeImage(banner.image),
                      alt: banner.alt ?? banner.title ?? 'ShopNest',
                      label: banner.subtitle ?? undefined,
                  })),
                  ...fallbackHeroImages,
              ].slice(0, 3)
            : fallbackHeroImages;

    const categoryItems: CategoryItem[] = categories.slice(0, 6).map((category) => ({
        id: category.id,
        name: category.name,
        imageUrl: normalizeImage(category.image_url, ''),
    }));

    const existingNames = new Set(categoryItems.map((category) => category.name.toLowerCase()));
    const filledCategories = [
        ...categoryItems,
        ...anchorCategoryNames.filter((name) => !existingNames.has(name.toLowerCase())).map((name) => ({ name })),
    ].slice(0, 6);

    const flashProducts = (flashSale?.products ?? []).map(toProductCard);
    const bestSellerCards = bestSellers.map(toProductCard);
    const suggestedCards = suggestedProducts.map(toProductCard);

    const handleAddToCart = (product: ProductCardModel) => {
        info('Chọn phân loại sản phẩm', product.name);
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
                onSuccess: () => success('Đã lưu sản phẩm', product.name),
                onError: () => showError('Chưa thể lưu sản phẩm', 'Vui lòng đăng nhập để dùng danh sách yêu thích.'),
            },
        );
    };

    if (isLoading) {
        return (
            <StorefrontLayout pinLight={false}>
                <HomeSkeleton />
            </StorefrontLayout>
        );
    }

    return (
        <StorefrontLayout pinLight={false}>
            <Head title="ShopNest. Mọi thứ cho tổ ấm Việt" />

            <HeroEditorial
                eyebrow="Mọi thứ cho tổ ấm Việt"
                title={
                    <>
                        Chọn đồ kỹ,
                        <br />
                        sống êm.
                    </>
                }
                subcopy="Đồ điện tử, gia dụng, nhà cửa, mẹ & bé, thời trang và làm đẹp từ các shop Việt đã kiểm duyệt."
                cta={{ label: 'Xem chợ', href: '/search' }}
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
                title="Sản phẩm bán chạy"
                description="Xếp theo số lượng đã bán trên các đơn không huỷ."
                products={bestSellerCards}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleWishlist}
                emptyTitle="Chưa có sản phẩm bán chạy"
                emptyDescription="Chưa có đơn nào để tính xếp hạng."
            />

            <ProductShelf
                id="goi-y"
                title="Gợi ý cho tổ ấm"
                description="Chọn theo nhu cầu hôm nay: làm việc, nấu ăn, chăm bé hay chăm mình."
                products={suggestedCards}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleWishlist}
                emptyTitle="Chưa có gợi ý"
                emptyDescription="Thêm danh mục và thương hiệu bạn thích trong tài khoản để gợi ý sát hơn."
            />

            <BrandSpotlight />

            <EditorialPillars pillars={pillars} />

            <TrustStrip items={trustItems} />
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
