import { Head, router, usePage } from '@inertiajs/react';
import { CreditCard, Lock, RotateCcw, ShieldCheck, Store, Truck, Zap } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { BrandSpotlight } from '@/components/storefront/BrandSpotlight';
import { CategoryShelf, type CategoryItem } from '@/components/storefront/CategoryShelf';
import { EditorialPillars } from '@/components/storefront/EditorialPillars';
import { FlashSaleModule } from '@/components/storefront/FlashSaleModule';
import { HeroEditorial, HeroInlineImage } from '@/components/storefront/HeroEditorial';
import { ProductShelf } from '@/components/storefront/ProductShelf';
import { TrustStrip } from '@/components/storefront/TrustStrip';
import { UtilityStrip } from '@/components/storefront/UtilityStrip';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { usePageLoading } from '@/hooks/usePageLoading';
import type { ProductCardModel } from '@/types/commerce';

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
}

const fallbackHeroImages = [
    {
        src: 'https://picsum.photos/seed/shopnest-laptop/1000/800',
        alt: 'Laptop trên bàn làm việc ấm',
        label: 'Điện tử',
    },
    {
        src: 'https://picsum.photos/seed/shopnest-airfryer/800/700',
        alt: 'Nồi chiên trong bếp ấm',
        label: 'Gia dụng',
    },
    {
        src: 'https://picsum.photos/seed/shopnest-stroller/800/700',
        alt: 'Xe đẩy em bé gọn nhẹ',
        label: 'Mẹ & bé',
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

const utilityItems = [
    { icon: Truck, label: 'Freeship từ 299.000 ₫', description: 'Trợ phí vận chuyển toàn quốc' },
    { icon: CreditCard, label: 'Trả góp 0%', description: 'Duyệt online trong 3 phút' },
    { icon: Store, label: 'Shop Việt', description: 'Nhà bán đã kiểm duyệt' },
    { icon: Zap, label: 'Giao nhanh 2h', description: 'Nội thành Hà Nội & TP.HCM' },
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
        description: 'An tâm đổi hoặc hoàn khi sản phẩm sai cam kết.',
    },
    {
        icon: Truck,
        title: 'Giao toàn quốc',
        description: 'Đóng gói chống sốc và theo dõi đơn trên mọi chặng.',
    },
    {
        icon: Lock,
        title: 'Thanh toán bảo mật',
        description: 'Hỗ trợ Stripe và thanh toán khi nhận hàng.',
    },
];

const pillars = [
    {
        eyebrow: 'Tuyển chọn',
        title: 'Mỗi món đều có lý do',
        description: 'Sáu nhóm ngành thiết yếu, chọn lọc theo nhu cầu thật của tổ ấm Việt.',
        image: 'https://picsum.photos/seed/shopnest-curation/900/700',
    },
    {
        eyebrow: 'Minh bạch',
        title: 'Thông tin rõ ràng',
        description: 'Nguồn gốc, bảo hành và chính sách đổi trả hiển thị trước khi mua.',
        image: 'https://picsum.photos/seed/shopnest-trust/700/700',
    },
    {
        eyebrow: 'Đồng hành',
        title: 'Hỗ trợ đến khi nhận',
        description: 'Từ lúc chọn món đến khi kiện hàng tới tay, luôn có người trả lời.',
        image: 'https://picsum.photos/seed/shopnest-support/900/700',
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
        shopName: product.brand ?? 'Shop Việt',
        shopBadge: 'shop-viet',
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
    const { categories = [], flashSale = null, suggestedProducts = [], bestSellers = [], banners = [] } = usePage<PageProps>().props;

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
            <StorefrontLayout>
                <HomeSkeleton />
            </StorefrontLayout>
        );
    }

    return (
        <StorefrontLayout>
            <Head title="ShopNest — Mọi thứ cho tổ ấm Việt" />

            <HeroEditorial
                eyebrow="Mọi thứ cho tổ ấm Việt"
                title={
                    <>
                        Chọn <HeroInlineImage src={heroImages[0]?.src ?? fallbackHeroImages[0].src} alt={heroImages[0]?.alt ?? 'Laptop'} /> đồ thật
                        kỹ,
                        <br />
                        sống <HeroInlineImage src={heroImages[1]?.src ?? fallbackHeroImages[1].src} alt={heroImages[1]?.alt ?? 'Bàn ăn'} /> thật êm.
                    </>
                }
                subcopy="Đồ điện tử, gia dụng, nhà cửa, mẹ & bé, thời trang và làm đẹp từ các shop Việt đã kiểm duyệt."
                cta={{ label: 'Xem chợ hôm nay', href: '/search' }}
                images={heroImages}
                trust={['1.200+ Shop Việt', '100% kiểm định nguồn gốc']}
            />

            <UtilityStrip items={utilityItems} />

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
                eyebrow="Được chọn nhiều"
                title="Sản phẩm bán chạy"
                description="Những món được khách hàng ShopNest tin dùng trong tuần này."
                products={bestSellerCards}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleWishlist}
                emptyTitle="Chưa có sản phẩm bán chạy"
                emptyDescription="Khi có sản phẩm nổi bật, chúng sẽ xuất hiện ở đây."
            />

            <ProductShelf
                id="goi-y"
                eyebrow="Dành cho bạn"
                title="Gợi ý cho tổ ấm"
                description="Chọn theo nhu cầu hôm nay: làm việc, nấu ăn, chăm bé hay chăm mình."
                products={suggestedCards}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleWishlist}
                emptyTitle="Chưa có gợi ý"
                emptyDescription="Hãy quay lại sau để xem các món được tuyển chọn."
            />

            <BrandSpotlight />

            <EditorialPillars pillars={pillars} />

            <TrustStrip items={trustItems} />
        </StorefrontLayout>
    );
}

function HomeSkeleton() {
    return (
        <PageContainer className="py-8 md:py-12">
            <div className="grid gap-8 lg:grid-cols-12">
                <div className="flex flex-col gap-4 lg:col-span-7">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-4/5" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-12 w-48" />
                </div>
                <div className="grid grid-cols-2 gap-3 lg:col-span-5">
                    <Skeleton className="col-span-2 aspect-[16/9] h-auto" />
                    <Skeleton className="aspect-[4/3] h-auto" />
                    <Skeleton className="aspect-[4/3] h-auto" />
                </div>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-square h-auto" />
                ))}
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-[4/5] h-auto" />
                ))}
            </div>
        </PageContainer>
    );
}
