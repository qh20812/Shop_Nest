import { ChevronDown, Lock } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cx } from '@/lib/cx';
import { formatVnd } from '@/lib/format';

import styles from './commerce.module.css';

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

const DESKTOP_QUERY = '(min-width: 1024px)';

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
    trust = [],
    footerNote,
    className,
    children,
}: OrderSummaryProps) {
    const [expanded, setExpanded] = React.useState(false);
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const media = window.matchMedia(DESKTOP_QUERY);
        const sync = () => setIsDesktop(media.matches);

        sync();
        media.addEventListener('change', sync);

        return () => media.removeEventListener('change', sync);
    }, []);

    return (
        <aside aria-label="Tóm tắt đơn hàng" className={cx(styles.summaryAside, className)}>
            <details
                className={styles.summary}
                open={isDesktop || expanded}
                onToggle={(event) => {
                    if (!isDesktop) {
                        setExpanded(event.currentTarget.open);
                    }
                }}
            >
                <summary className={styles.summaryToggle}>
                    <span className={styles.summaryToggleLabel}>Tóm tắt đơn hàng</span>
                    <span className={styles.summaryToggleMeta}>
                        <span className={styles.summaryToggleValue}>{formatVnd(total)}</span>
                        <ChevronDown aria-hidden="true" className={styles.summaryChevron} />
                    </span>
                </summary>

                <div className={styles.summaryBody}>
                    <h2 className={styles.summaryTitle}>Tóm tắt đơn hàng</h2>

                    {showItems && items.length > 0 && (
                        <ul className={styles.summaryItems}>
                            {items.map((item) => (
                                <li key={item.id} className={styles.summaryItem}>
                                    {item.image ? <img src={item.image} alt={item.name} className={styles.summaryItemMedia} /> : null}
                                    <div className={styles.summaryItemBody}>
                                        <span className={styles.summaryItemName}>{item.name}</span>
                                        {item.variant ? <span className={styles.summaryItemVariant}>{item.variant}</span> : null}
                                    </div>
                                    <div className={styles.summaryItemAmount}>
                                        <span className={styles.summaryItemQty}>×{item.quantity}</span>
                                        <span className={styles.summaryItemPrice}>{formatVnd(item.price * item.quantity)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {promotion ? <div className={styles.summaryPromotion}>{promotion}</div> : null}

                    <div className={styles.summaryLines}>
                        <div className={styles.summaryRow}>
                            <span>Tạm tính</span>
                            <span className={styles.summaryRowValue}>{formatVnd(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                            <div className={styles.summaryRow}>
                                <span>Giảm giá</span>
                                <span className={cx(styles.summaryRowValue, styles.summaryRowValueDiscount)}>-{formatVnd(discount)}</span>
                            </div>
                        )}
                        <div className={styles.summaryRow}>
                            <span>Phí vận chuyển</span>
                            <span className={styles.summaryRowValue}>{shippingLabel ?? formatVnd(shipping)}</span>
                        </div>
                    </div>

                    <div className={styles.summaryTotal}>
                        <span className={styles.summaryTotalLabel}>Tổng cộng</span>
                        <span className={styles.summaryTotalValue}>{formatVnd(total)}</span>
                    </div>

                    {children}

                    {onCheckout && (
                        <Button className={styles.summaryCta} size="lg" loading={loading} disabled={disabled} onClick={onCheckout}>
                            {ctaLabel}
                        </Button>
                    )}

                    {footerNote ? <p className={styles.summaryFooterNote}>{footerNote}</p> : null}

                    {trust.length > 0 && (
                        <div className={styles.summaryTrust}>
                            {trust.map((item) => (
                                <span key={item} className={styles.summaryTrustItem}>
                                    <Lock aria-hidden="true" className={styles.summaryTrustIcon} />
                                    {item}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </details>
        </aside>
    );
}

export type { OrderSummaryProps, SummaryItem };
export default OrderSummary;
