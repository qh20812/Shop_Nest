import { ToastProvider, useToast } from '@/Contexts/ToastContext';
import { SkeletonPage } from '@/components/home/skeletons';
import Footer from '@/components/home/ui/Footer';
import Navbar from '@/components/home/ui/Navbar';
import { usePageLoading } from '@/hooks/usePageLoading';
import { Link, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    FolderOpen,
    Heart,
    Image as ImageIcon,
    Lightbulb,
    MessageCircle,
    Minus,
    ShoppingBag,
    Timer,
    TrendingUp,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

function HomeContent() {
    const isLoading = usePageLoading({ delay: 300, minLoadingTime: 1500 });
    const { info: showInfo, success: showSuccess } = useToast();
    const { categories = [], flashSale = null, suggestedProducts = [], bestSellers = [], banners = [] } = usePage<PageProps>().props;

    const heroImages =
        banners.length > 0
            ? banners.map((b) => b.image)
            : [
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCJnd0a7KUIVBOrCCbTD_XI8zjrdFzSTEoaq6b4K3q-WNNZ7Q2Bkcw0YRwFrtyBeGOTDM5kMZeV_Dsx87yglrclO67vmbXOLiWdKSRNsRDazp8Z9RBcwMv21ccDiy7Ejn2xRN_TGm8jLkPPVhgUwBUR7T-IYai9T9Zyr0elbxlqZXV_Nd24e1s71UbqVJ4c0tevgmsrAc6DsnRS8Fxgk8XcjjO2uEtvshEWzXm5XhzWDHs0QAirR_c2Q2e-Q-QD-evUeWdCr7mUVtc',
              ];

    const [activeSlide, setActiveSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const autoplayRef = useRef<number | null>(null);

    const flashSaleProducts = flashSale?.products || [];
    const hasFlashSale = flashSale !== null && flashSaleProducts.length > 0;

    const bestSellerRef = useRef<HTMLDivElement | null>(null);
    const suggestedRef = useRef<HTMLDivElement | null>(null);
    const categoriesRef = useRef<HTMLDivElement | null>(null);

    const scrollHorizontal = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right', cardWidth = 280, gap = 24) => {
        const node = ref.current;
        if (!node) return;
        const firstChild = node.firstElementChild as HTMLElement | null;
        const width = firstChild ? Math.round(firstChild.getBoundingClientRect().width) : cardWidth;
        const amount = width + gap;
        node.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <span key={`star-${i}`} className="text-warning">
                    ★
                </span>,
            );
        }
        if (hasHalfStar) {
            stars.push(
                <span key="half-star" className="text-warning">
                    ★
                </span>,
            );
        }
        for (let i = stars.length; i < 5; i++) {
            stars.push(
                <span key={`empty-${i}`} className="text-muted-foreground">
                    ★
                </span>,
            );
        }
        return stars;
    };

    useEffect(() => {
        if (autoplayRef.current) {
            window.clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
        if (!isPaused) {
            autoplayRef.current = window.setInterval(() => {
                setActiveSlide((s) => (s + 1) % heroImages.length);
            }, 4000);
        }
        return () => {
            if (autoplayRef.current) {
                window.clearInterval(autoplayRef.current);
                autoplayRef.current = null;
            }
        };
    }, [isPaused, heroImages.length]);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<Array<{ id: number; from: 'bot' | 'user'; text: string; time?: string }>>([
        { id: 1, from: 'bot', text: 'Chào bạn! Mình là trợ lý ảo của ShopNest. Mình có thể giúp gì cho bạn hôm nay?', time: '10:30 AM' },
    ]);

    const sendMessage = () => {
        if (!chatInput.trim()) return;
        const id = messages.length ? messages[messages.length - 1].id + 1 : 1;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => [...prev, { id, from: 'user' as const, text: chatInput.trim(), time: timeStr }]);
        setChatInput('');
        showInfo('Tin nhắn đã gửi');
        setTimeout(() => {
            const botId = id + 1;
            setMessages((prev) => [
                ...prev,
                {
                    id: botId,
                    from: 'bot' as const,
                    text: 'Cảm ơn! Mình đã nhận thông tin. Hỗ trợ chi tiết sẽ được gửi sớm.',
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        }, 800);
    };

    if (isLoading) {
        return <SkeletonPage variant="welcome" />;
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground">
            <Navbar />

            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    {/* Hero Section */}
                    <section className="mb-12 md:mb-16">
                        {banners.length > 0 ? (
                            <div
                                className="group relative h-[500px] w-full overflow-hidden rounded-xl"
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                            >
                                {heroImages.map((src, idx) => (
                                    <div
                                        key={src}
                                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                                            idx === activeSlide ? 'z-10 opacity-100' : 'z-0 opacity-0'
                                        }`}
                                        style={{ backgroundImage: `url('${src}')` }}
                                    />
                                ))}
                                <div className="absolute inset-0 z-20 flex items-center bg-black/40">
                                    <div className="w-full max-w-2xl px-8 text-white md:px-16">
                                        <h2 className="mb-4 text-4xl leading-tight font-black md:text-5xl">Siêu Sale Khai Trương - Giảm tới 50%</h2>
                                        <p className="mb-8 text-lg opacity-90">Khám phá các ưu đãi tuyệt vời trong ngày ra mắt của chúng tôi.</p>
                                        <button
                                            className="flex h-12 max-w-[480px] min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-base leading-normal font-bold tracking-[0.015em] text-white transition-colors hover:bg-primary/90"
                                            onClick={() => showSuccess('Đã thêm vào giỏ hàng!')}
                                        >
                                            <span className="truncate">Mua sắm ngay</span>
                                        </button>
                                    </div>
                                </div>
                                <button
                                    aria-label="Previous slide"
                                    onClick={() => setActiveSlide((s) => (s - 1 + heroImages.length) % heroImages.length)}
                                    className="absolute top-1/2 left-3 z-30 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/50"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    aria-label="Next slide"
                                    onClick={() => setActiveSlide((s) => (s + 1) % heroImages.length)}
                                    className="absolute top-1/2 right-3 z-30 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/50"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                                <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 space-x-2">
                                    {heroImages.map((_, i) => (
                                        <button
                                            key={`dot-${i}`}
                                            onClick={() => setActiveSlide(i)}
                                            aria-label={`Go to slide ${i + 1}`}
                                            className={`h-2.5 w-2.5 rounded-full transition-opacity ${
                                                i === activeSlide ? 'bg-white opacity-90' : 'bg-white opacity-50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-card p-8 text-center">
                                <div className="mb-4 text-primary">
                                    <ImageIcon className="h-16 w-16 opacity-70" />
                                </div>
                                <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">Chưa có banner nào để hiển thị</h2>
                                <p className="mb-8 max-w-xl text-lg text-muted-foreground">Banner quảng cáo sẽ xuất hiện ở đây. Hãy quay lại sau!</p>
                                <button
                                    className="flex h-12 max-w-[480px] min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-base leading-normal font-bold tracking-[0.015em] text-primary transition-colors hover:bg-primary/90"
                                    onClick={() => showInfo('Khám phá cửa hàng')}
                                >
                                    <span className="truncate">Khám phá Cửa hàng</span>
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Categories Section */}
                    <section className="mb-12 md:mb-16">
                        <h2 className="mb-5 pb-0 text-[22px] leading-tight font-bold tracking-[-0.015em] text-foreground md:text-2xl">
                            Mua sắm theo Danh mục
                        </h2>
                        {categories.length > 0 ? (
                            <>
                                <div className="mb-5 flex items-center justify-between">
                                    <div className="ml-auto flex gap-2">
                                        <button
                                            aria-label="Previous categories"
                                            onClick={() => scrollHorizontal(categoriesRef, 'left', 160, 16)}
                                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            aria-label="Next categories"
                                            onClick={() => scrollHorizontal(categoriesRef, 'right', 160, 16)}
                                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="-mx-2 px-2">
                                    <div
                                        ref={categoriesRef}
                                        className="scrollbar-hide flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto pb-4"
                                    >
                                        {categories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="flex aspect-square w-40 min-w-0 shrink-0 cursor-pointer snap-start flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-lg sm:w-44 md:w-48 lg:w-[calc((100%-96px)/7)]"
                                            >
                                                <div className="text-4xl text-secondary">{category.icon}</div>
                                                <h3 className="text-center text-base leading-tight font-bold text-foreground">{category.name}</h3>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8">
                                <div className="mb-3 text-secondary">
                                    <FolderOpen className="h-12 w-12 opacity-70" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-foreground">Chưa có danh mục nào</h3>
                                <p className="text-sm text-muted-foreground">Các danh mục sản phẩm sẽ sớm xuất hiện tại đây.</p>
                            </div>
                        )}
                    </section>

                    {/* Flash Sale Section */}
                    <section className="mb-12 rounded-xl bg-card p-6 md:mb-16 md:p-8">
                        <div className="mb-6">
                            <h2 className="text-[22px] leading-tight font-bold tracking-[-0.015em] text-foreground md:text-2xl">Flash Sale</h2>
                        </div>
                        {hasFlashSale ? (
                            <>
                                <div className="mb-6 flex items-center gap-2 text-muted-foreground">
                                    <span className="text-sm font-medium">Kết thúc trong:</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
                                            08
                                        </span>
                                        <span className="font-bold text-primary">:</span>
                                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
                                            45
                                        </span>
                                        <span className="font-bold text-primary">:</span>
                                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
                                            22
                                        </span>
                                    </div>
                                </div>
                                <div className="scrollbar-hide -mx-4 flex overflow-x-auto px-4">
                                    <div className="flex items-stretch gap-4 pb-4">
                                        {flashSaleProducts.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/product/${product.id}`}
                                                className="group flex w-[260px] min-w-[260px] flex-col overflow-hidden rounded-lg bg-background shadow-md transition-shadow hover:shadow-lg"
                                            >
                                                <div
                                                    className="relative flex aspect-square w-full flex-col bg-cover bg-center bg-no-repeat"
                                                    style={{ backgroundImage: `url("${product.image}")` }}
                                                >
                                                    <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white">
                                                        -{product.discount}%
                                                    </span>
                                                </div>
                                                <div className="flex flex-1 flex-col gap-2 p-4">
                                                    <p className="truncate text-base leading-normal font-medium text-foreground">{product.name}</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                                                        {product.oldPrice && (
                                                            <p className="text-sm font-normal text-muted-foreground line-through">
                                                                {formatPrice(product.oldPrice)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-[250px] flex-col items-center justify-center py-10 text-center">
                                <div className="mb-4 text-primary">
                                    <Timer className="h-14 w-14 opacity-70" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-foreground">Chưa có Flash Sale nào đang diễn ra</h3>
                                <p className="mb-6 max-w-md text-muted-foreground">
                                    Hãy theo dõi trang của chúng tôi! Các ưu đãi chớp nhoáng sẽ sớm xuất hiện.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Suggested Products */}
                    <section className="mb-12 md:mb-16">
                        <h2 className="mb-5 pb-0 text-[22px] leading-tight font-bold tracking-[-0.015em] text-foreground md:text-2xl">
                            Gợi ý hôm nay
                        </h2>
                        {suggestedProducts.length > 0 ? (
                            <>
                                <div className="mb-5 flex items-center justify-between">
                                    <div className="ml-auto flex gap-2">
                                        <button
                                            aria-label="Previous suggested"
                                            onClick={() => scrollHorizontal(suggestedRef, 'left')}
                                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            aria-label="Next suggested"
                                            onClick={() => scrollHorizontal(suggestedRef, 'right')}
                                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="-mx-2 px-2">
                                    <div ref={suggestedRef} className="scrollbar-hide flex items-stretch gap-6 overflow-x-auto pb-4">
                                        {suggestedProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="group flex w-full min-w-0 shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card sm:w-1/2 md:w-1/3 lg:w-[calc((100%-72px)/4)]"
                                            >
                                                <Link
                                                    href={`/product/${product.id}`}
                                                    className="relative aspect-square w-full overflow-hidden bg-cover bg-center bg-no-repeat transition-opacity hover:opacity-90"
                                                    style={{ backgroundImage: `url("${product.image}")` }}
                                                >
                                                    <button
                                                        className="absolute top-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/80 text-foreground backdrop-blur-sm transition-colors hover:text-primary dark:bg-card/80"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            showSuccess('Đã thêm vào yêu thích!');
                                                        }}
                                                    >
                                                        <Heart className="h-5 w-5" />
                                                    </button>
                                                </Link>
                                                <div className="flex flex-col gap-4 p-4">
                                                    <Link href={`/product/${product.id}`}>
                                                        <p className="mb-1 text-base leading-normal font-semibold text-foreground transition-colors hover:text-primary">
                                                            {product.name}
                                                        </p>
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex text-sm">{renderStars(product.rating ?? 0)}</div>
                                                            <span className="ml-1 text-xs text-muted-foreground">({product.reviews})</span>
                                                        </div>
                                                    </Link>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-lg font-bold text-foreground">{formatPrice(product.price)}</p>
                                                        <button
                                                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-secondary/20 text-secondary transition-colors hover:bg-secondary hover:text-white"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                showSuccess('Đã thêm vào giỏ hàng!');
                                                            }}
                                                        >
                                                            <ShoppingBag className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-[250px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
                                <div className="mb-3 text-primary">
                                    <Lightbulb className="h-12 w-12 opacity-70" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-foreground">Chưa có sản phẩm gợi ý</h3>
                                <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                                    Hãy quay lại sau để khám phá các sản phẩm được tuyển chọn đặc biệt dành cho bạn.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Best Sellers */}
                    <section className="mb-12 md:mb-16">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-[22px] leading-tight font-bold tracking-[-0.015em] text-foreground md:text-2xl">Sản phẩm bán chạy</h2>
                            {bestSellers.length > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        aria-label="Previous best sellers"
                                        onClick={() => scrollHorizontal(bestSellerRef, 'left')}
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        aria-label="Next best sellers"
                                        onClick={() => scrollHorizontal(bestSellerRef, 'right')}
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                        {bestSellers.length > 0 ? (
                            <div className="-mx-2 px-2">
                                <div ref={bestSellerRef} className="scrollbar-hide flex items-stretch gap-6 overflow-x-auto pb-4">
                                    {bestSellers.map((product) => (
                                        <div
                                            key={product.id}
                                            className="group flex w-full min-w-0 shrink-0 flex-col overflow-hidden rounded-lg bg-background shadow-md sm:w-1/2 md:w-1/3 lg:w-[calc((100%-72px)/4)]"
                                        >
                                            <Link
                                                href={`/product/${product.id}`}
                                                className="relative aspect-square w-full bg-cover bg-center bg-no-repeat transition-opacity hover:opacity-90"
                                                style={{ backgroundImage: `url("${product.image}")` }}
                                            >
                                                <button
                                                    className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-foreground backdrop-blur-sm transition-colors hover:text-primary dark:bg-card/80"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        showSuccess('Đã thêm vào yêu thích!');
                                                    }}
                                                >
                                                    <Heart className="h-5 w-5" />
                                                </button>
                                            </Link>
                                            <div className="flex flex-1 flex-col gap-2 p-4">
                                                <Link href={`/product/${product.id}`}>
                                                    <p className="mb-1 truncate text-base leading-normal font-semibold text-foreground transition-colors hover:text-primary">
                                                        {product.name}
                                                    </p>
                                                </Link>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-lg font-bold text-foreground">{formatPrice(product.price)}</p>
                                                    <button
                                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-secondary transition-colors hover:bg-secondary hover:text-white"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            showSuccess('Đã thêm vào giỏ hàng!');
                                                        }}
                                                    >
                                                        <ShoppingBag className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex min-h-[250px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8">
                                <div className="mb-3 text-secondary">
                                    <TrendingUp className="h-12 w-12 opacity-70" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-foreground">Chưa có sản phẩm bán chạy</h3>
                                <p className="text-sm text-muted-foreground">Khi có sản phẩm bán chạy, chúng sẽ được hiển thị ở đây.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />

            {/* Chat Bubble */}
            <button
                aria-label="Open chat"
                onClick={() => setIsChatOpen((s) => !s)}
                className="fixed right-6 bottom-6 z-50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-transform hover:scale-110"
            >
                <MessageCircle className="h-7 w-7" />
            </button>

            {/* Chat Panel */}
            {isChatOpen && (
                <>
                    {isChatMinimized ? (
                        <div className="fixed right-6 bottom-28 z-50 flex w-72 items-center justify-between rounded-lg bg-card px-3 py-2 shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="text-primary">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                                <div className="truncate text-sm font-semibold">ShopNest Assistant</div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    aria-label="Restore"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                    onClick={() => setIsChatMinimized(false)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                                <button
                                    aria-label="Close"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                    onClick={() => {
                                        setIsChatOpen(false);
                                        setIsChatMinimized(false);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="fixed right-6 bottom-28 z-50 flex h-[600px] max-h-[calc(100vh-3rem)] w-96 max-w-[calc(100%-1rem)] flex-col rounded-xl bg-card shadow-2xl">
                            <header className="flex items-center justify-between border-b border-border p-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-primary">
                                        <ShoppingBag className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">ShopNest Assistant</div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                                            <span>Online</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        aria-label="Minimize chat"
                                        onClick={() => setIsChatMinimized(true)}
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <button
                                        aria-label="Close chat"
                                        onClick={() => {
                                            setIsChatOpen(false);
                                            setIsChatMinimized(false);
                                        }}
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </header>
                            <main className="flex-1 overflow-y-auto bg-muted/50 p-4">
                                <div className="flex flex-col gap-4">
                                    {messages.map((m) => (
                                        <div key={m.id} className={`flex items-start gap-3 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                    m.from === 'bot' ? 'bg-secondary text-white' : ''
                                                }`}
                                            >
                                                {m.from === 'bot' ? <MessageCircle className="h-4 w-4 text-white" /> : null}
                                            </div>
                                            <div className={`flex flex-col gap-1 ${m.from === 'user' ? 'items-end' : ''}`}>
                                                <div
                                                    className={`max-w-xs rounded-lg p-3 ${
                                                        m.from === 'bot' ? 'bg-background' : 'bg-primary text-white'
                                                    }`}
                                                >
                                                    <p className={`text-sm ${m.from === 'bot' ? 'text-foreground' : ''}`}>{m.text}</p>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{m.time ?? ''}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </main>
                            <footer className="border-t border-border p-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-muted px-4 py-2 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:outline-0"
                                        placeholder="Nhập tin nhắn..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                    />
                                    <button
                                        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary text-white shadow-sm transition-colors hover:bg-primary/90"
                                        onClick={() => sendMessage()}
                                    >
                                        Gửi
                                    </button>
                                </div>
                            </footer>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function Index() {
    return (
        <ToastProvider>
            <HomeContent />
        </ToastProvider>
    );
}
