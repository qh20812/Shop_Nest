import { PackageX } from 'lucide-react';

import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState } from '@/components/ui/empty-state';
import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

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
        <div className={cx(styles.returnPicker, className)}>
            {items.map((item) => {
                const key = String(item.id);
                const selected = value[key] !== undefined;

                return (
                    <div key={key} className={styles.returnItem}>
                        <div className={styles.returnItemCheck}>
                            <Checkbox
                                checked={selected}
                                onCheckedChange={(checked) => toggle(item, checked === true)}
                                aria-label={`Chọn trả ${item.name}`}
                            />
                        </div>

                        <div className={styles.returnItemMedia}>
                            <img src={normalizeImage(item.image)} alt={item.name} className={styles.returnItemImage} />
                        </div>

                        <div className={styles.returnItemBody}>
                            {item.variant ? <span className={styles.returnItemVariant}>{item.variant}</span> : null}
                            <span className={styles.returnItemName}>{item.name}</span>
                            <span className={styles.returnItemMeta}>Đã mua: {item.quantity}</span>
                            {selected ? (
                                <div className={styles.returnItemQuantity}>
                                    <QuantityStepper
                                        value={value[key]}
                                        min={1}
                                        max={item.maxQuantity ?? item.quantity}
                                        onChange={(quantity) => setQuantity(item, quantity)}
                                        size="sm"
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export type { ReturnItem, ReturnItemPickerProps };
export default ReturnItemPicker;
