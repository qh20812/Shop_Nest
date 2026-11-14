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
            <nav className="flex flex-col gap-1" aria-label="Điều hướng di động">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={`${item.href}-${item.label}`}
                            href={item.href}
                            onClick={() => onOpenChange(false)}
                            className="focus-ring flex items-center gap-3 rounded-control px-3 py-3 text-body-md font-medium text-ink transition-colors hover:bg-lacquer-wash"
                        >
                            {Icon && <Icon aria-hidden="true" className="size-5 text-ink-muted" />}
                            <span className="flex-1">{item.label}</span>
                            {item.badge !== undefined && (
                                <span className="rounded-pill bg-raw-linen px-2 py-0.5 font-mono text-label-micro text-ink-muted">{item.badge}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>
            {footer && <div className="mt-6 border-t border-border pt-4">{footer}</div>}
        </Sheet>
    );
}

export type { MobileNavItem, MobileNavProps };
export default MobileNav;
