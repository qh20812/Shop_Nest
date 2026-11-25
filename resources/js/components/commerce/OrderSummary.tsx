import { useTranslation } from '@/lib/i18n';
import { ChevronDown, Lock } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useMoney } from '@/hooks/useMoney';
import { cx } from '@/lib/cx';

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
    ctaLabel,
    loading = false,
    disabled = false,
    showItems = true,
    trust = [],
    footerNote,
    className,
    children,
}: OrderSummaryProps) {
    const { t } = useTranslation();
    const resolvedCtaLabel = ctaLabel ?? t('Checkout');
    const { money } = useMoney();
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
        <aside aria-label={t('Order summary')} className={cx(styles.summaryAside, className)}>
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
                    <span className={styles.summaryToggleLabel}>{t('Order summary')}</span>
                    <span className={styles.summaryToggleMeta}>
                        <span className={styles.summaryToggleValue}>{money(total)}</span>
                        <ChevronDown aria-hidden="true" className={styles.summaryChevron} />
                    </span>
                </summary>

                <div className={styles.summaryBody}>
                    <h2 className={styles.summaryTitle}>{t('Order summary')}</h2>

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
                                        <span className={styles.summaryItemPrice}>{money(item.price * item.quantity)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {promotion ? <div className={styles.summaryPromotion}>{promotion}</div> : null}

                    <div className={styles.summaryLines}>
                        <div className={styles.summaryRow}>
                            <span>{t('Subtotal')}</span>
                            <span className={styles.summaryRowValue}>{money(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                            <div className={styles.summaryRow}>
                                <span>{t('Discount')}</span>
                                <span className={cx(styles.summaryRowValue, styles.summaryRowValueDiscount)}>-{money(discount)}</span>
                            </div>
                        )}
                        <div className={styles.summaryRow}>
                            <span>{t('Shipping fee')}</span>
                            <span className={styles.summaryRowValue}>{shippingLabel ?? money(shipping)}</span>
                        </div>
                    </div>

                    <div className={styles.summaryTotal}>
                        <span className={styles.summaryTotalLabel}>{t('Total')}</span>
                        <span className={styles.summaryTotalValue}>{money(total)}</span>
                    </div>

                    {children}

                    {onCheckout && (
                        <Button className={styles.summaryCta} size="lg" loading={loading} disabled={disabled} onClick={onCheckout}>
                            {resolvedCtaLabel}
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
