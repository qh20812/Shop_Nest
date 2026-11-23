import { Link } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { IconButton } from '@/components/ui/icon-button';
import { cx } from '@/lib/cx';
import { formatVnd } from '@/lib/format';

import { Price } from './Price';
import { QuantityStepper } from './QuantityStepper';
import styles from './commerce.module.css';

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
        <article className={cx(styles.cartLine, className)}>
            <div className={styles.cartLineCheck}>
                <Checkbox checked={selected} onCheckedChange={(checked) => onSelect(checked === true)} aria-label={`Chọn ${item.name}`} />
            </div>

            <div className={styles.cartLineMedia}>
                <img src={item.image} alt={item.imageAlt ?? item.name} className={styles.cartLineImage} />
            </div>

            <div className={styles.cartLineBody}>
                <div className={styles.cartLineMeta}>
                    {item.shopName ? <span className={styles.cartLineShop}>{item.shopName}</span> : null}
                    {item.variant ? <span className={styles.cartLineVariant}>{item.variant}</span> : null}
                </div>

                {item.href ? (
                    <Link href={item.href} className={styles.cartLineTitle}>
                        {item.name}
                    </Link>
                ) : (
                    <span className={styles.cartLineTitle}>{item.name}</span>
                )}

                <div className={styles.cartLinePrice}>
                    <Price value={item.price} compareAt={item.compareAt} size="sm" showDiscount={false} />
                </div>

                <div className={styles.cartLineFooter}>
                    <QuantityStepper value={item.quantity} min={1} max={item.maxQuantity} onChange={onQuantityChange} size="sm" />
                    <div className={styles.cartLineActions}>
                        <span className={styles.cartLineTotal}>{formatVnd(total)}</span>
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
