import { Link } from '@inertiajs/react';

import { cx } from '@/lib/cx';
import { formatVnd } from '@/lib/format';

import styles from './commerce.module.css';

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
        <article className={cx(styles.orderItem, className)}>
            <div className={styles.orderItemMedia}>
                <img src={normalizeImage(item.image)} alt={item.name} className={styles.orderItemImage} />
            </div>

            <div className={styles.orderItemBody}>
                {item.variant ? <span className={styles.orderItemVariant}>{item.variant}</span> : null}
                {item.href ? (
                    <Link href={item.href} className={styles.orderItemTitle}>
                        {item.name}
                    </Link>
                ) : (
                    <span className={styles.orderItemTitle}>{item.name}</span>
                )}
                <span className={styles.orderItemMeta}>
                    {formatVnd(item.price)} × {item.quantity}
                </span>
            </div>

            <span className={styles.orderItemTotal}>{formatVnd(total)}</span>
        </article>
    );
}

export type { OrderItemModel, OrderItemRowProps };
export default OrderItemRow;
