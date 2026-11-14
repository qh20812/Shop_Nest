import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    Globe2,
    Heart,
    Home,
    LogOut,
    MapPin,
    Menu,
    Package,
    Search,
    Settings,
    ShoppingBag,
    Store,
    Tag,
    Truck,
    User,
} from 'lucide-react';
import * as React from 'react';

import Avatar from '@/components/ui/Avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, type DropdownMenuItemConfig } from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/ui/search-input';
import { useDisclosure } from '@/hooks/useDisclosure';
import { cn } from '@/lib/utils';

import { MobileNav, type MobileNavItem } from './MobileNav';

type StorefrontUser = {
    id?: number;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    username?: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
};

type PageProps = {
    auth?: { user?: StorefrontUser | null } | null;
    locale?: string;
    currency?: { code?: string };
    cartCount?: number;
    cart_items_count?: number;
    unreadCount?: number;
    unread_count?: number;
    [key: string]: unknown;
};

type StorefrontHeaderProps = {
    cartCount?: number;
    unreadCount?: number;
    className?: string;
};

const navLinks = [
    { label: 'Danh mục', href: '/#danh-muc', icon: Store },
    { label: 'Khuyến mãi', href: '/#flash-sale', icon: Tag },
    { label: 'Shop Việt', href: '/#shop-viet', icon: Truck },
    { label: 'Đơn hàng', href: '/user/orders', icon: Package },
];

const accountItems = (unreadCount: number): DropdownMenuItemConfig[] => [
    {
        label: 'Hồ sơ cá nhân',
        href: '/user/profile',
        icon: User,
    },
    {
        label: 'Đơn hàng của tôi',
        href: '/user/orders',
        icon: Package,
    },
    {
        label: 'Địa chỉ giao hàng',
        href: '/user/addresses',
        icon: MapPin,
    },
    {
        label: unreadCount > 0 ? `Thông báo (${unreadCount})` : 'Thông báo',
        href: '/user/notifications',
        icon: Bell,
    },
    {
        label: 'Cài đặt',
        href: '/settings/profile',
        icon: Settings,
    },
    {
        label: 'Đăng xuất',
        icon: LogOut,
        destructive: true,
        separatorBefore: true,
        onSelect: () => router.post('/logout'),
    },
];

function getDisplayName(user: StorefrontUser | null): string {
    if (!user) {
        return '';
    }

    const fullName = [user.last_name, user.first_name].filter(Boolean).join(' ');

    return fullName || user.username || user.email || 'Người dùng';
}

export function StorefrontHeader({ cartCount, unreadCount, className }: StorefrontHeaderProps) {
    const page = usePage<PageProps>();
    const user = page.props.auth?.user ?? null;
    const locale = page.props.locale === 'en' ? 'EN' : 'VI';
    const currency = page.props.currency?.code ?? 'VND';
    const resolvedCartCount = cartCount ?? page.props.cartCount ?? page.props.cart_items_count ?? 0;
    const resolvedUnreadCount = unreadCount ?? page.props.unreadCount ?? page.props.unread_count ?? 0;
    const mobileNav = useDisclosure();
    const [query, setQuery] = React.useState('');
    const displayName = getDisplayName(user);

    const submitSearch = (value: string) => {
        const search = value.trim();
        router.get('/search', search ? { search } : {});
    };

    const mobileItems: MobileNavItem[] = [
        { label: 'Trang chủ', href: '/', icon: Home },
        ...navLinks.map((item) => ({ label: item.label, href: item.href, icon: item.icon })),
        ...(user
            ? [
                  { label: 'Hồ sơ cá nhân', href: '/user/profile', icon: User },
                  { label: 'Địa chỉ giao hàng', href: '/user/addresses', icon: MapPin },
                  {
                      label: 'Thông báo',
                      href: '/user/notifications',
                      icon: Bell,
                      badge: resolvedUnreadCount > 0 ? resolvedUnreadCount : undefined,
                  },
              ]
            : [
                  { label: 'Đăng nhập', href: '/login', icon: User },
                  { label: 'Đăng ký', href: '/register', icon: Heart },
              ]),
    ];

    return (
        <header className={cn('z-header sticky top-0 border-b border-border bg-rice-paper', className)}>
            <div className="mx-auto w-full max-w-page px-gutter-mobile md:px-gutter-tablet lg:px-gutter">
                <div className="flex h-header items-center gap-3 lg:gap-5">
                    <Link href="/" className="focus-ring flex shrink-0 items-center gap-2.5 rounded-chip">
                        <img src="/image/ShopnestLogo.png" alt="ShopNest" className="size-9 object-contain" />
                        <span className="hidden text-headline-3 font-semibold tracking-tight text-ink sm:inline">ShopNest</span>
                    </Link>

                    <nav className="hidden items-center gap-5 lg:flex" aria-label="Điều hướng chính">
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="focus-ring text-body-sm font-medium text-ink-muted transition-colors hover:text-lacquer-red"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden min-w-0 flex-1 justify-center md:flex">
                        <SearchInput
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onSubmit={submitSearch}
                            placeholder="Tìm laptop, nồi chiên, xe đẩy..."
                            className="max-w-xl"
                        />
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">
                        <div className="hidden xl:block">
                            <DropdownMenu
                                align="end"
                                trigger={
                                    <Button variant="ghost" size="sm" className="gap-1.5 text-body-sm">
                                        <Globe2 aria-hidden="true" />
                                        <span>
                                            {locale} · {currency}
                                        </span>
                                        <ChevronDown aria-hidden="true" className="size-3.5" />
                                    </Button>
                                }
                                items={[
                                    { label: 'Tiếng Việt', onSelect: () => router.post('/language', { locale: 'vi' }, { preserveScroll: true }) },
                                    { label: 'English', onSelect: () => router.post('/language', { locale: 'en' }, { preserveScroll: true }) },
                                    {
                                        label: 'VND — Việt Nam đồng',
                                        separatorBefore: true,
                                        onSelect: () => router.post('/currency', { currency: 'VND' }, { preserveScroll: true }),
                                    },
                                    {
                                        label: 'USD — US Dollar',
                                        onSelect: () => router.post('/currency', { currency: 'USD' }, { preserveScroll: true }),
                                    },
                                ]}
                            />
                        </div>

                        <Button asChild variant="ghost" size="icon" className="relative" aria-label="Thông báo">
                            <Link href="/user/notifications">
                                <Bell aria-hidden="true" />
                                {resolvedUnreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-pill bg-lacquer-red px-1 font-mono text-label-micro text-warm-porcelain">
                                        {resolvedUnreadCount > 9 ? '9+' : resolvedUnreadCount}
                                    </span>
                                )}
                            </Link>
                        </Button>

                        <Button asChild variant="ghost" size="icon" className="relative" aria-label="Giỏ hàng">
                            <Link href="/cart">
                                <ShoppingBag aria-hidden="true" />
                                {resolvedCartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-pill bg-lacquer-red px-1 font-mono text-label-micro text-warm-porcelain">
                                        {resolvedCartCount > 9 ? '9+' : resolvedCartCount}
                                    </span>
                                )}
                            </Link>
                        </Button>

                        {user ? (
                            <div className="hidden md:block">
                                <DropdownMenu
                                    align="end"
                                    trigger={
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <Avatar user={user} size="sm" />
                                            <span className="hidden max-w-28 truncate text-body-sm xl:inline">{displayName}</span>
                                            <ChevronDown aria-hidden="true" className="size-3.5" />
                                        </Button>
                                    }
                                    items={accountItems(resolvedUnreadCount)}
                                />
                            </div>
                        ) : (
                            <Button asChild variant="secondary" size="sm" className="hidden md:inline-flex">
                                <Link href="/login">
                                    <User aria-hidden="true" />
                                    Đăng nhập
                                </Link>
                            </Button>
                        )}

                        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Mở menu" onClick={mobileNav.open}>
                            <Menu aria-hidden="true" />
                        </Button>
                    </div>
                </div>

                <div className="pb-3 md:hidden">
                    <SearchInput
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onSubmit={submitSearch}
                        placeholder="Tìm món đồ cho tổ ấm..."
                    />
                </div>
            </div>

            <MobileNav
                open={mobileNav.isOpen}
                onOpenChange={mobileNav.setOpen}
                items={mobileItems}
                footer={
                    <div className="flex flex-col gap-2">
                        <Button asChild variant="secondary" size="sm">
                            <Link href="/search" onClick={mobileNav.close}>
                                <Search aria-hidden="true" />
                                Tìm kiếm sản phẩm
                            </Link>
                        </Button>
                        {user && (
                            <Button variant="ghost" size="sm" leftIcon={LogOut} onClick={() => router.post('/logout')}>
                                Đăng xuất
                            </Button>
                        )}
                    </div>
                }
            />
        </header>
    );
}

export default StorefrontHeader;
