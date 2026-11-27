import { usePage } from '@inertiajs/react';
import { Boxes, Gift, LayoutDashboard, ListChecks, Package, Receipt, Settings, ShoppingBag, Store, Tags, Users, Wallet } from 'lucide-react';
import * as React from 'react';

import { useTranslation } from '@/lib/i18n';

import { WorkspaceSidebar, type WorkspaceNavItem } from './WorkspaceSidebar';
import { WorkspaceTopbar } from './WorkspaceTopbar';

type RoleKey = 'admin' | 'seller' | 'shipper';

type RoleName = Record<string, string> | string | null | undefined;

interface UserRole {
    name?: RoleName;
    display_name?: RoleName;
    title?: RoleName;
    slug?: string | null;
    key?: string | null;
}

interface WorkspaceUser {
    id: number;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    username?: string | null;
    role_name?: string | null;
    roles?: UserRole[];
}

interface PageProps extends Record<string, unknown> {
    auth?: {
        user?: WorkspaceUser | null;
    } | null;
}

const VALID_ROLES: RoleKey[] = ['admin', 'seller', 'shipper'];
const ROLE_FALLBACK: RoleKey = 'admin';

const ROLE_LABELS: Record<RoleKey, string> = {
    admin: 'Quản trị',
    seller: 'Người bán',
    shipper: 'Giao vận',
};

function normalizeString(value?: string | null): string | null {
    if (!value) {
        return null;
    }

    return value.toLowerCase().trim();
}

function normalizeWithLocales(input?: RoleName): string | null {
    if (!input) {
        return null;
    }

    if (typeof input === 'string') {
        return normalizeString(input);
    }

    for (const locale of ['en', 'vi']) {
        const localized = normalizeString(input[locale]);

        if (localized) {
            return localized;
        }
    }

    const fallbackValue = Object.values(input).find((value) => typeof value === 'string' && value.trim().length > 0);

    return typeof fallbackValue === 'string' ? normalizeString(fallbackValue) : null;
}

function stripDiacritics(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function resolveRoleKey(user: WorkspaceUser | null | undefined): RoleKey {
    if (!user) {
        return ROLE_FALLBACK;
    }

    const roleMatches: Array<string | null> = [normalizeString(user.role_name)];

    for (const role of user.roles ?? []) {
        if (!role) {
            continue;
        }

        roleMatches.push(normalizeWithLocales(role.name));
        roleMatches.push(normalizeWithLocales(role.display_name));
        roleMatches.push(normalizeWithLocales(role.title));
        roleMatches.push(normalizeString(role.slug));
        roleMatches.push(normalizeString(role.key));
    }

    const keywords: Record<RoleKey, string[]> = {
        admin: ['admin', 'administrator', 'nguoi quan tri', 'người quản trị', 'quan tri'],
        seller: ['seller', 'vendor', 'shop', 'nguoi ban', 'người bán', 'nha ban hang', 'nhà bán hàng', 'merchant'],
        shipper: ['shipper', 'delivery', 'nguoi giao hang', 'người giao hàng', 'giao hang', 'courier'],
    };

    for (const match of roleMatches) {
        if (!match) {
            continue;
        }

        const normalizedKey = match.replace(/\s+/g, '_');

        if (VALID_ROLES.includes(normalizedKey as RoleKey)) {
            return normalizedKey as RoleKey;
        }

        const stripped = stripDiacritics(match);

        for (const [roleKey, roleKeywords] of Object.entries(keywords) as Array<[RoleKey, string[]]>) {
            if (roleKeywords.some((keyword) => match.includes(keyword) || stripped.includes(keyword))) {
                return roleKey;
            }
        }
    }

    return ROLE_FALLBACK;
}

type WorkspaceLayoutProps = {
    children: React.ReactNode;
};

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
    const { t } = useTranslation();
    const { props, url } = usePage<PageProps>();
    const user = props.auth?.user ?? null;
    const role = resolveRoleKey(user);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const items = React.useMemo<Record<RoleKey, WorkspaceNavItem[]>>(
        () => ({
            admin: [
                { icon: LayoutDashboard, label: t('Dashboard'), href: '/admin/dashboard' },
                { icon: Users, label: t('Users'), href: '/admin/users' },
                { icon: Package, label: t('Products'), href: '/admin/products' },
                { icon: Boxes, label: t('Inventories'), href: '/admin/inventory' },
                { icon: Gift, label: t('Promotions'), href: '/admin/promotions' },
                { icon: Tags, label: t('Categories'), href: '/admin/categories' },
                { icon: Store, label: t('Brands'), href: '/admin/brands' },
                { icon: Receipt, label: t('Orders'), href: '/admin/orders' },
                { icon: Wallet, label: t('Wallet'), href: '/wallet' },
                { icon: ListChecks, label: t('Review top-ups'), href: '/admin/wallet-topups' },
                { icon: ShoppingBag, label: t('Shops'), href: '/admin/shops' },
            ],
            seller: [
                { icon: LayoutDashboard, label: t('Seller Dashboard'), href: '/seller/dashboard' },
                { icon: Package, label: t('My Products'), href: '/seller/products' },
                { icon: Receipt, label: t('Orders'), href: '/seller/orders' },
                { icon: Store, label: t('Shop Profile'), href: '/seller/shop' },
                { icon: Gift, label: t('Promotions'), href: '/seller/promotions' },
                { icon: Wallet, label: t('Wallet'), href: '/wallet' },
                { icon: Settings, label: t('navbar.settings'), href: '/settings' },
            ],
            shipper: [
                { icon: LayoutDashboard, label: t('Shipper Dashboard'), href: '/shipper/dashboard' },
                { icon: Wallet, label: t('Wallet'), href: '/wallet' },
                { icon: Settings, label: t('navbar.settings'), href: '/settings' },
            ],
        }),
        [t],
    );

    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [url]);

    const closeSidebar = React.useCallback(() => setIsSidebarOpen(false), []);

    return (
        <div className="sn-shell sn-workspace">
            <a href="#main-content" className="sn-skip-link">
                {t('Skip to main content')}
            </a>
            <WorkspaceSidebar items={items[role]} open={isSidebarOpen} roleLabel={ROLE_LABELS[role]} onNavigate={closeSidebar} />

            {isSidebarOpen && <button type="button" className="sn-workspace__overlay" aria-label="Đóng menu" onClick={closeSidebar} />}

            <div className="sn-workspace__content">
                <WorkspaceTopbar onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
                <main id="main-content" tabIndex={-1} className="sn-workspace__main">
                    {children}
                </main>
            </div>
        </div>
    );
}
