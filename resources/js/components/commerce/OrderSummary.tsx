import { Lock } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { formatVnd } from '@/lib/format';
import { cn } from '@/lib/utils';

type SummaryItem = {
    id: number | string;
    name: string;
    image?: string;
    variant?: string;
    quantity: number;
    price: number;
};

type OrderSummaryProps = {
    items?: SummaryItem[];
    subtotal: number;
    discount?: number;
    shipping?: number;
    shippingLabel?: string;
    total: number;
    promotion?: React.ReactNode;
    onCheckout?: () => void;
    ctaLabel?: string;
    loading?: boolean;
    disabled?: boolean;
    showItems?: boolean;
    trust?: string[];
    footerNote?: string;
    className?: string;
    children?: React.ReactNode;
};

export function OrderSummary({
    items = [],
    subtotal,
    discount = 0,
    shipping = 0,
    shippingLabel,
    total,
    promotion,
    onCheckout,
    ctaLabel = 'Thanh toán',
    loading = false,
    disabled = false,
    showItems = true,
    trust = ['Shop Việt', 'Đổi trả 7 ngày', 'Thanh toán bảo mật'],
    footerNote,
    className,
    children,
}: OrderSummaryProps) {
    return (
        <aside
            aria-label="Tóm tắt đơn hàng"
            className={cn('rounded-surface border border-border bg-warm-porcelain p-5 lg:sticky lg:top-24', className)}
        >
            <h2 className="text-headline-3 text-ink">Tóm tắt đơn hàng</h2>

            {showItems && items.length > 0 && (
                <ul className="mt-4 flex flex-col gap-3 border-b border-border pb-4">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-14 w-11 shrink-0 rounded-control border border-border object-cover"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                <span className="line-clamp-2 text-body-sm font-medium text-ink">{item.name}</span>
                                {item.variant && <span className="block text-label-micro text-ink-muted">{item.variant}</span>}
                            </div>
                            <div className="text-right">
                                <span className="block font-mono text-label-code text-ink">×{item.quantity}</span>
                                <span className="block font-mono text-label-micro text-ink-muted">{formatVnd(item.price * item.quantity)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {promotion && <div className="border-b border-border py-4">{promotion}</div>}

            <div className="flex flex-col gap-2 py-4 text-body-sm">
                <div className="flex items-center justify-between text-ink-muted">
                    <span>Tạm tính</span>
                    <span className="font-mono text-ink">{formatVnd(subtotal)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex items-center justify-between text-ink-muted">
                        <span>Giảm giá</span>
                        <span className="font-mono text-lacquer-red">-{formatVnd(discount)}</span>
                    </div>
                )}
                <div className="flex items-center justify-between text-ink-muted">
                    <span>Phí vận chuyển</span>
                    <span className="font-mono text-ink">{shippingLabel ?? formatVnd(shipping)}</span>
                </div>
            </div>

            <div className="flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-body-md font-semibold text-ink">Tổng cộng</span>
                <span className="font-mono text-headline-3 font-bold text-ink">{formatVnd(total)}</span>
            </div>

            {children}

            {onCheckout && (
                <Button size="lg" className="mt-5 w-full" loading={loading} disabled={disabled} onClick={onCheckout}>
                    {ctaLabel}
                </Button>
            )}

            {footNoteText(footerNote)}

            {trust.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4">
                    {trust.map((item) => (
                        <span key={item} className="inline-flex items-center gap-1.5 text-label-micro text-ink-muted">
                            <Lock aria-hidden="true" className="size-3.5 text-jade" />
                            {item}
                        </span>
                    ))}
                </div>
            )}
        </aside>
    );
}

function footNoteText(note?: string) {
    if (!note) {
        return null;
    }

    return <p className="mt-2 text-right text-label-micro text-ink-faint">{note}</p>;
}

export type { OrderSummaryProps, SummaryItem };
export default OrderSummary;
