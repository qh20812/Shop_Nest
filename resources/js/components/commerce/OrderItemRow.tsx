import { Link } from '@inertiajs/react';

import { formatVnd } from '@/lib/format';
import { cn } from '@/lib/utils';

type OrderItemModel = {
    id: number | string;
    name: string;
    image?: string | null;
    variant?: string;
    quantity: number;
    price: number;
    href?: string;
};

type OrderItemRowProps = {
    item: OrderItemModel;
    className?: string;
};

function normalizeImage(src?: string | null): string {
    if (!src) {
        return '/image/default-product.png';
    }

    if (/^https?:\/\//.test(src) || src.startsWith('/')) {
        return src;
    }

    return `/storage/${src}`;
}

export function OrderItemRow({ item, className }: OrderItemRowProps) {
    const total = item.price * item.quantity;

    return (
        <article className={cn('flex items-start gap-3 border-t border-border py-4 first:border-t-0 first:pt-0', className)}>
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-control border border-border bg-rice-paper">
                <img src={normalizeImage(item.image)} alt={item.name} className="size-full object-cover" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                {item.variant && <span className="font-mono text-label-micro tracking-[0.08em] text-ink-muted uppercase">{item.variant}</span>}
                {item.href ? (
                    <Link
                        href={item.href}
                        className="focus-ring line-clamp-2 text-body-md font-medium text-ink transition-colors hover:text-lacquer-red"
                    >
                        {item.name}
                    </Link>
                ) : (
                    <span className="line-clamp-2 text-body-md font-medium text-ink">{item.name}</span>
                )}
                <span className="text-body-sm text-ink-muted">
                    {formatVnd(item.price)} × {item.quantity}
                </span>
            </div>

            <span className="shrink-0 font-mono text-body-sm font-semibold text-ink">{formatVnd(total)}</span>
        </article>
    );
}

export type { OrderItemModel, OrderItemRowProps };
export default OrderItemRow;
