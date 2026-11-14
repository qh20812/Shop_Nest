import { Link } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { IconButton } from '@/components/ui/icon-button';
import { formatVnd } from '@/lib/format';
import { cn } from '@/lib/utils';

import { Price } from './Price';
import { QuantityStepper } from './QuantityStepper';

type CartLineItem = {
    id: number | string;
    name: string;
    image: string;
    imageAlt?: string;
    href?: string;
    shopName?: string;
    variant?: string;
    price: number;
    compareAt?: number;
    quantity: number;
    maxQuantity: number;
};

type CartLineProps = {
    item: CartLineItem;
    selected: boolean;
    onSelect: (selected: boolean) => void;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
    className?: string;
};

export function CartLine({ item, selected, onSelect, onQuantityChange, onRemove, className }: CartLineProps) {
    const total = item.price * item.quantity;

    return (
        <article className={cn('flex items-start gap-3 border-t border-border py-5 first:border-t-0 first:pt-0', className)}>
            <div className="pt-2">
                <Checkbox checked={selected} onCheckedChange={(checked) => onSelect(checked === true)} aria-label={`Chọn ${item.name}`} />
            </div>

            <div className="h-25 w-20 shrink-0 overflow-hidden rounded-control border border-border bg-warm-porcelain">
                <img src={item.image} alt={item.imageAlt ?? item.name} className="size-full object-cover" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                    {item.shopName && <span className="font-mono text-label-micro tracking-[0.08em] text-ink-muted uppercase">{item.shopName}</span>}
                    {item.variant && <span className="text-body-sm text-ink-muted">· {item.variant}</span>}
                </div>
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
                <div className="mt-1">
                    <Price value={item.price} compareAt={item.compareAt} size="sm" showDiscount={false} />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <QuantityStepper value={item.quantity} min={1} max={item.maxQuantity} onChange={onQuantityChange} size="sm" />
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-body-sm font-semibold text-ink">{formatVnd(total)}</span>
                        <IconButton label={`Xoá ${item.name}`} size="sm" variant="danger" onClick={onRemove}>
                            <Trash2 aria-hidden="true" />
                        </IconButton>
                    </div>
                </div>
            </div>
        </article>
    );
}

export type { CartLineItem, CartLineProps };
export default CartLine;
