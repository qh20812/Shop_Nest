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
    MessageCircle,
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

import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, type DropdownMenuItemConfig } from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/ui/search-input';
import { useDisclosure } from '@/hooks/useDisclosure';
import { cx } from '@/lib/cx';

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
        label: 'Tin nhắn',
        href: '/customer/chat',
        icon: MessageCircle,
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
                  { label: 'Tin nhắn', href: '/customer/chat', icon: MessageCircle },
              ]
            : [
                  { label: 'Đăng nhập', href: '/login', icon: User },
                  { label: 'Đăng ký', href: '/register', icon: Heart },
              ]),
    ];

    return (
        <header className={cx('sn-storefront__header', className)}>
            <div className="sn-storefront__header-inner">
                <div className="sn-storefront__bar">
                    <Link href="/" className="sn-brand">
                        <img src="/image/ShopnestLogo.png" alt="ShopNest" className="sn-brand__logo" />
                        <span className="sn-brand__name">ShopNest</span>
                    </Link>

                    <nav className="sn-storefront__nav" aria-label="Điều hướng chính">
                        {navLinks.map((item) => (
                            <Link key={item.href} href={item.href} className="sn-storefront__nav-link">
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="sn-storefront__search">
                        <SearchInput
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onSubmit={submitSearch}
                            placeholder="Tìm laptop, nồi chiên, xe đẩy..."
                            className="sn-storefront__search-inner"
                        />
                    </div>

                    <div className="sn-storefront__actions">
                        <div className="sn-storefront__locale">
                            <DropdownMenu
                                align="end"
                                trigger={
                                    <Button variant="ghost" size="sm">
                                        <Globe2 aria-hidden="true" />
                                        <span>
                                            {locale} · {currency}
                                        </span>
                                        <ChevronDown aria-hidden="true" className="sn-storefront__chevron" />
                                    </Button>
                                }
                                items={[
                                    { label: 'Tiếng Việt', onSelect: () => router.post('/language', { locale: 'vi' }, { preserveScroll: true }) },
                                    { label: 'English', onSelect: () => router.post('/language', { locale: 'en' }, { preserveScroll: true }) },
                                    {
                                        label: 'VND - Việt Nam đồng',
                                        separatorBefore: true,
                                        onSelect: () => router.post('/currency', { currency: 'VND' }, { preserveScroll: true }),
                                    },
                                    {
                                        label: 'USD - US Dollar',
                                        onSelect: () => router.post('/currency', { currency: 'USD' }, { preserveScroll: true }),
                                    },
                                ]}
                            />
                        </div>

                        <Button asChild variant="ghost" size="icon" className="sn-storefront__icon" aria-label="Thông báo">
                            <Link href="/user/notifications">
                                <Bell aria-hidden="true" />
                                {resolvedUnreadCount > 0 && (
                                    <span className="sn-storefront__badge">{resolvedUnreadCount > 9 ? '9+' : resolvedUnreadCount}</span>
                                )}
                            </Link>
                        </Button>

                        <Button asChild variant="ghost" size="icon" className="sn-storefront__icon" aria-label="Giỏ hàng">
                            <Link href="/cart">
                                <ShoppingBag aria-hidden="true" />
                                {resolvedCartCount > 0 && (
                                    <span className="sn-storefront__badge">{resolvedCartCount > 9 ? '9+' : resolvedCartCount}</span>
                                )}
                            </Link>
                        </Button>

                        {user ? (
                            <div className="sn-storefront__account">
                                <DropdownMenu
                                    align="end"
                                    trigger={
                                        <Button variant="ghost" size="sm">
                                            <Avatar user={user} size="sm" />
                                            <span className="sn-storefront__account-name">{displayName}</span>
                                            <ChevronDown aria-hidden="true" className="sn-storefront__chevron" />
                                        </Button>
                                    }
                                    items={accountItems(resolvedUnreadCount)}
                                />
                            </div>
                        ) : (
                            <Button asChild variant="secondary" size="sm" className="sn-storefront__login">
                                <Link href="/login">
                                    <User aria-hidden="true" />
                                    Đăng nhập
                                </Link>
                            </Button>
                        )}

                        <Button variant="ghost" size="icon" className="sn-storefront__menu-toggle" aria-label="Mở menu" onClick={mobileNav.open}>
                            <Menu aria-hidden="true" />
                        </Button>
                    </div>
                </div>

                <div className="sn-storefront__search sn-storefront__search--mobile">
                    <SearchInput
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onSubmit={submitSearch}
                        placeholder="Tìm món đồ cho tổ ấm..."
                        className="sn-storefront__search-inner"
                    />
                </div>
            </div>

            <MobileNav
                open={mobileNav.isOpen}
                onOpenChange={mobileNav.setOpen}
                items={mobileItems}
                footer={
                    <div>
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
