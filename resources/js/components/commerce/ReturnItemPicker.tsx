import { PackageX } from 'lucide-react';

import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

type ReturnItem = {
    id: number | string;
    name: string;
    image?: string | null;
    variant?: string;
    quantity: number;
    maxQuantity?: number;
};

type ReturnItemPickerProps = {
    items: ReturnItem[];
    value: Record<string, number>;
    onChange: (next: Record<string, number>) => void;
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

export function ReturnItemPicker({ items, value, onChange, className }: ReturnItemPickerProps) {
    if (items.length === 0) {
        return <EmptyState icon={PackageX} title="Không có sản phẩm để trả" description="Đơn hàng này chưa có sản phẩm đủ điều kiện trả hàng." />;
    }

    const toggle = (item: ReturnItem, checked: boolean) => {
        const key = String(item.id);
        const next = { ...value };

        if (checked) {
            next[key] = Math.min(1, item.maxQuantity ?? item.quantity);
        } else {
            delete next[key];
        }

        onChange(next);
    };

    const setQuantity = (item: ReturnItem, quantity: number) => {
        const key = String(item.id);
        onChange({ ...value, [key]: Math.max(1, Math.min(quantity, item.maxQuantity ?? item.quantity)) });
    };

    return (
        <div className={cn('flex flex-col', className)}>
            {items.map((item) => {
                const key = String(item.id);
                const selected = value[key] !== undefined;

                return (
                    <div key={key} className="flex items-start gap-3 border-t border-border py-4 first:border-t-0 first:pt-0">
                        <div className="pt-2">
                            <Checkbox
                                checked={selected}
                                onCheckedChange={(checked) => toggle(item, checked === true)}
                                aria-label={`Chọn trả ${item.name}`}
                            />
                        </div>

                        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-control border border-border bg-rice-paper">
                            <img src={normalizeImage(item.image)} alt={item.name} className="size-full object-cover" />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            {item.variant && (
                                <span className="font-mono text-label-micro tracking-[0.08em] text-ink-muted uppercase">{item.variant}</span>
                            )}
                            <span className="line-clamp-2 text-body-md font-medium text-ink">{item.name}</span>
                            <span className="text-body-sm text-ink-muted">Đã mua: {item.quantity}</span>
                            {selected && (
                                <div className="mt-2">
                                    <QuantityStepper
                                        value={value[key]}
                                        min={1}
                                        max={item.maxQuantity ?? item.quantity}
                                        onChange={(quantity) => setQuantity(item, quantity)}
                                        size="sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export type { ReturnItem, ReturnItemPickerProps };
export default ReturnItemPicker;
