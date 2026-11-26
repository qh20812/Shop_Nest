/* Hallmark · waive 26b · workspace nav is a list of links; a disabled nav item is not a state this shell can enter */
import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

import { BrandMark } from './BrandMark';

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
            <div className="sn-workspace__sidebar-card sn-glass-surface">
                <Link href={homeHref} className="sn-brand sn-workspace__brand" onClick={onNavigate}>
                    <BrandMark />
                    <span className="sn-workspace__brand-text">
                        <span className="sn-brand__name">ShopNest</span>
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
            </div>
        </aside>
    );
}

export type { WorkspaceNavItem, WorkspaceSidebarProps };
export default WorkspaceSidebar;
