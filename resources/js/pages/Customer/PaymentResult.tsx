import { Head, Link } from '@inertiajs/react';

import { OrderSummary } from '@/components/commerce/OrderSummary';
import { ResultState } from '@/components/feedback/ResultState';
import { PageContainer } from '@/components/layout/PageContainer';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

import styles from './customer.module.css';

interface PaymentResultAction {
    label: string;
    href: string;
    primary?: boolean;
}

interface PaymentResultItem {
    id?: string | number;
    name?: string;
    product_name?: string;
    quantity?: number;
    total_price?: number;
    unit_price?: number;
    price?: number;
    image?: string;
}

interface PaymentResultOrder {
    id?: string | number;
    reference?: string;
    code?: string;
    total?: number;
    total_amount?: number;
    currency?: string;
    payment_method?: string;
    created_at?: string;
    items?: PaymentResultItem[];
}

interface PaymentResultProps {
    provider: string;
    status: string;
    message?: string;
    order?: PaymentResultOrder | null;
    actions?: PaymentResultAction[];
}

const statusConfig = {
    succeeded: {
        result: 'success' as const,
        titleKey: 'Order placed successfully',
        messageKey: 'The shop will confirm your order soon. You can track it under Orders.',
    },
    canceled: {
        result: 'pending' as const,
        titleKey: 'Payment cancelled',
        messageKey: 'The order has not been paid. You can try again or choose another method.',
    },
    failed: {
        result: 'failure' as const,
        titleKey: 'Payment failed',
        messageKey: 'The transaction did not go through. Check your details or contact support.',
    },
};

export default function PaymentResult({ status, message, order, actions }: PaymentResultProps) {
    const { t } = useTranslation();
    const normalized = status?.toLowerCase?.() ?? 'failed';
    const config = statusConfig[normalized as keyof typeof statusConfig] ?? {
        result: 'pending' as const,
        titleKey: 'Processing payment',
        messageKey: 'We are checking the transaction. Please come back in a few minutes.',
    };

    const orderCode = order?.reference ?? order?.code ?? order?.id;
    const total = order?.total ?? order?.total_amount ?? 0;
    const items = (order?.items ?? []).map((item) => ({
        id: item.id ?? item.name ?? 'item',
        name: item.product_name ?? item.name ?? t('Product'),
        image: item.image,
        quantity: item.quantity ?? 1,
        price: item.unit_price ?? item.price ?? (item.total_price ? item.total_price / Math.max(1, item.quantity ?? 1) : 0),
    }));

    const fallbackActions: PaymentResultAction[] =
        config.result === 'success'
            ? [
                  { label: t('View order'), href: '/user/orders', primary: true },
                  { label: t('Continue shopping'), href: '/' },
              ]
            : [
                  { label: t('Retry payment'), href: '/checkout', primary: true },
                  { label: t('Back to home'), href: '/' },
              ];

    const resolvedActions = actions && actions.length > 0 ? actions : fallbackActions;

    return (
        <StorefrontLayout compactFooter>
            <Head title={t('Payment result')} />

            <PageContainer size="narrow" className={styles.pageTight}>
                <ResultState
                    status={config.result}
                    orderCode={orderCode}
                    title={t(config.titleKey)}
                    message={message || t(config.messageKey)}
                    actions={resolvedActions.map((action) => (
                        <Button key={`${action.href}-${action.label}`} asChild variant={action.primary ? 'primary' : 'secondary'}>
                            <Link href={action.href}>{action.label}</Link>
                        </Button>
                    ))}
                />

                {order && items.length > 0 && (
                    <div className={styles.resultSummary}>
                        <OrderSummary
                            items={items}
                            subtotal={total}
                            total={total}
                            showItems
                            trust={order.payment_method ? [t('Payment: :method', { method: order.payment_method })] : []}
                            footerNote={t('Thank you for shopping at ShopNest.')}
                        />
                    </div>
                )}
            </PageContainer>
        </StorefrontLayout>
    );
}
