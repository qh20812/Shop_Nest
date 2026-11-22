import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

type WorkspaceNavItem = {
    icon: LucideIcon;
    label: string;
    href: string;
};

type WorkspaceSidebarProps = {
    items: WorkspaceNavItem[];
    open: boolean;
    roleLabel: string;
    onNavigate: () => void;
};

export function WorkspaceSidebar({ items, open, roleLabel, onNavigate }: WorkspaceSidebarProps) {
    const { url } = usePage();
    const homeHref = items[0]?.href ?? '/';

    return (
        <aside className="sn-workspace__sidebar" data-open={open ? 'true' : 'false'} aria-label="Điều hướng workspace">
            <Link href={homeHref} className="sn-workspace__brand" onClick={onNavigate}>
                <img src="/image/ShopnestLogo.png" alt="ShopNest" className="sn-workspace__brand-logo" />
                <span>
                    <span className="sn-workspace__brand-name">ShopNest</span>
                    <span className="sn-workspace__brand-role">{roleLabel}</span>
                </span>
            </Link>

            <nav>
                <ul className="sn-workspace__nav">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = url.startsWith(item.href);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="sn-workspace__nav-link"
                                    data-active={isActive ? 'true' : undefined}
                                    aria-current={isActive ? 'page' : undefined}
                                    onClick={onNavigate}
                                >
                                    <Icon aria-hidden="true" className="sn-workspace__nav-icon" />
                                    <span className="sn-workspace__nav-label">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}

export type { WorkspaceNavItem, WorkspaceSidebarProps };
export default WorkspaceSidebar;
