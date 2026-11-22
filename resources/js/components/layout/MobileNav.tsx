import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { Sheet } from '@/components/ui/sheet';

type MobileNavItem = {
    label: string;
    href: string;
    icon?: LucideIcon;
    badge?: string | number;
};

type MobileNavProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: MobileNavItem[];
    footer?: React.ReactNode;
};

export function MobileNav({ open, onOpenChange, items, footer }: MobileNavProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange} side="right" title="Danh mục" description="Chọn nơi bạn muốn đến.">
            <nav className="sn-mobile-nav" aria-label="Điều hướng di động">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link key={`${item.href}-${item.label}`} href={item.href} onClick={() => onOpenChange(false)} className="sn-mobile-nav__link">
                            {Icon && <Icon aria-hidden="true" className="sn-mobile-nav__icon" />}
                            <span className="sn-mobile-nav__label">{item.label}</span>
                            {item.badge !== undefined && <span className="sn-mobile-nav__badge">{item.badge}</span>}
                        </Link>
                    );
                })}
            </nav>
            {footer && <div className="sn-mobile-nav__footer">{footer}</div>}
        </Sheet>
    );
}

export type { MobileNavItem, MobileNavProps };
export default MobileNav;
