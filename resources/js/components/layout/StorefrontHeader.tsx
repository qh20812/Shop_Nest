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
import { useTranslation } from '@/lib/i18n';

import { BrandMark } from './BrandMark';
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

const navItems = [
    { labelKey: 'Categories', href: '/#danh-muc', icon: Store },
    { labelKey: 'Deals', href: '/#flash-sale', icon: Tag },
    { labelKey: 'Vietnamese shops', href: '/#shop-viet', icon: Truck },
    { labelKey: 'Orders', href: '/user/orders', icon: Package },
];

const accountItems = (t: (key: string) => string, unreadCount: number): DropdownMenuItemConfig[] => [
    {
        label: t('My profile'),
        href: '/user/profile',
        icon: User,
    },
    {
        label: t('My orders'),
        href: '/user/orders',
        icon: Package,
    },
    {
        label: t('Shipping addresses'),
        href: '/user/addresses',
        icon: MapPin,
    },
    {
        label: unreadCount > 0 ? `${t('Notifications')} (${unreadCount})` : t('Notifications'),
        href: '/user/notifications',
        icon: Bell,
    },
    {
        label: t('Messages'),
        href: '/customer/chat',
        icon: MessageCircle,
    },
    {
        label: t('Settings'),
        href: '/settings/profile',
        icon: Settings,
    },
    {
        label: t('Sign out'),
        icon: LogOut,
        destructive: true,
        separatorBefore: true,
        onSelect: () => router.post('/logout'),
    },
];

function getDisplayName(user: StorefrontUser | null, fallback: string): string {
    if (!user) {
        return '';
    }

    const fullName = [user.last_name, user.first_name].filter(Boolean).join(' ');

    return fullName || user.username || user.email || fallback;
}

export function StorefrontHeader({ cartCount, unreadCount, className }: StorefrontHeaderProps) {
    const page = usePage<PageProps>();
    const { t } = useTranslation();
    const user = page.props.auth?.user ?? null;
    const localeCode = page.props.locale === 'en' ? 'en' : 'vi';
    const localeLabel = localeCode === 'en' ? 'EN' : 'VI';
    const currency = page.props.currency?.code ?? 'VND';
    const resolvedCartCount = cartCount ?? page.props.cartCount ?? page.props.cart_items_count ?? 0;
    const resolvedUnreadCount = unreadCount ?? page.props.unreadCount ?? page.props.unread_count ?? 0;
    const mobileNav = useDisclosure();
    const [query, setQuery] = React.useState('');
    const displayName = getDisplayName(user, t('User'));
    const currentUrl = page.url.split('?')[0];

    const submitSearch = (value: string) => {
        const search = value.trim();
        router.get('/search', search ? { search } : {});
    };

    const mobileItems: MobileNavItem[] = [
        { label: t('Home'), href: '/', icon: Home },
        ...navItems.map((item) => ({ label: t(item.labelKey), href: item.href, icon: item.icon })),
        ...(user
            ? [
                  { label: t('My profile'), href: '/user/profile', icon: User },
                  { label: t('Shipping addresses'), href: '/user/addresses', icon: MapPin },
                  {
                      label: t('Notifications'),
                      href: '/user/notifications',
                      icon: Bell,
                      badge: resolvedUnreadCount > 0 ? resolvedUnreadCount : undefined,
                  },
                  { label: t('Messages'), href: '/customer/chat', icon: MessageCircle },
              ]
            : [
                  { label: t('Sign In'), href: '/login', icon: User },
                  { label: t('Register'), href: '/register', icon: Heart },
              ]),
    ];

    return (
        <header className={cx('sn-storefront__header', className)}>
            <div className="sn-storefront__header-inner">
                <div className="sn-storefront__card">
                    <div className="sn-storefront__bar">
                        <Link href="/" className="sn-brand">
                            <BrandMark />
                            <span className="sn-brand__name">ShopNest</span>
                        </Link>

                        <nav className="sn-storefront__nav" aria-label={t('Main navigation')}>
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={item.href === currentUrl ? 'page' : undefined}
                                    className="sn-storefront__nav-link"
                                >
                                    {t(item.labelKey)}
                                </Link>
                            ))}
                        </nav>

                        <div className="sn-storefront__search">
                            <SearchInput
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                onSubmit={submitSearch}
                                placeholder={t('Search for laptops, air fryers, strollers...')}
                                className="sn-storefront__search-inner"
                            />
                        </div>

                        <div className="sn-storefront__actions">
                            <div className="sn-storefront__locale">
                                <DropdownMenu
                                    align="end"
                                    className="sn-dropdown--glass"
                                    trigger={
                                        <Button variant="ghost" size="sm" className="sn-storefront__trigger">
                                            <Globe2 aria-hidden="true" />
                                            <span>{localeLabel}</span>
                                            <span aria-hidden="true" className="sn-storefront__locale-divider" />
                                            <span>{currency}</span>
                                            <ChevronDown aria-hidden="true" className="sn-storefront__chevron" />
                                        </Button>
                                    }
                                    items={[
                                        {
                                            label: 'Tiếng Việt',
                                            selected: localeCode === 'vi',
                                            onSelect: () => router.post('/language', { locale: 'vi' }, { preserveScroll: true }),
                                        },
                                        {
                                            label: 'English',
                                            selected: localeCode === 'en',
                                            onSelect: () => router.post('/language', { locale: 'en' }, { preserveScroll: true }),
                                        },
                                        {
                                            label: t('VND - Vietnamese dong'),
                                            separatorBefore: true,
                                            selected: currency === 'VND',
                                            onSelect: () => router.post('/currency', { currency: 'VND' }, { preserveScroll: true }),
                                        },
                                        {
                                            label: 'USD - US Dollar',
                                            selected: currency === 'USD',
                                            onSelect: () => router.post('/currency', { currency: 'USD' }, { preserveScroll: true }),
                                        },
                                    ]}
                                />
                            </div>

                            <Button asChild variant="ghost" size="icon" className="sn-storefront__icon" aria-label={t('Notifications')}>
                                <Link href="/user/notifications">
                                    <Bell aria-hidden="true" />
                                    {resolvedUnreadCount > 0 && (
                                        <span className="sn-storefront__badge">{resolvedUnreadCount > 9 ? '9+' : resolvedUnreadCount}</span>
                                    )}
                                </Link>
                            </Button>

                            <Button asChild variant="ghost" size="icon" className="sn-storefront__icon" aria-label={t('Cart')}>
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
                                        className="sn-dropdown--glass"
                                        trigger={
                                            <Button variant="ghost" size="sm" className="sn-storefront__trigger">
                                                <Avatar user={user} size="sm" />
                                                <span className="sn-storefront__account-name">{displayName}</span>
                                                <ChevronDown aria-hidden="true" className="sn-storefront__chevron" />
                                            </Button>
                                        }
                                        items={accountItems(t, resolvedUnreadCount)}
                                    />
                                </div>
                            ) : (
                                <Button asChild size="sm" className="sn-storefront__login">
                                    <Link href="/login">
                                        <User aria-hidden="true" />
                                        {t('Sign In')}
                                    </Link>
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                className="sn-storefront__menu-toggle"
                                aria-label={t('Open menu')}
                                onClick={mobileNav.open}
                            >
                                <Menu aria-hidden="true" />
                            </Button>
                        </div>
                    </div>

                    <div className="sn-storefront__search sn-storefront__search--mobile">
                        <SearchInput
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onSubmit={submitSearch}
                            placeholder={t('Find something for your home...')}
                            className="sn-storefront__search-inner"
                        />
                    </div>
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
                                {t('Search products')}
                            </Link>
                        </Button>
                        {user && (
                            <Button variant="ghost" size="sm" leftIcon={LogOut} onClick={() => router.post('/logout')}>
                                {t('Sign out')}
                            </Button>
                        )}
                    </div>
                }
            />
        </header>
    );
}

export default StorefrontHeader;
