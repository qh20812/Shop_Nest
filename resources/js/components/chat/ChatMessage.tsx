import { router } from '@inertiajs/react';
import { AlertTriangle, ArrowUpRight, Sparkles } from 'lucide-react';
import * as React from 'react';

import type { ChatProduct } from '@/components/chat/types';
import { OrderAnnouncementCard, type OrderAnnouncementModel } from '@/components/commerce/OrderAnnouncementCard';
import { ProductCard } from '@/components/commerce/ProductCard';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';
import type { ProductCardModel } from '@/types/commerce';

import styles from './chat.module.css';

type ChatMessageVariant = 'incoming' | 'outgoing' | 'system' | 'error';

type ChatMessageProps = {
    variant?: ChatMessageVariant;
    content: React.ReactNode;
    timestamp?: string;
    status?: 'sending' | 'sent' | 'delivered' | 'failed';
    assistantName?: string;
    avatar?: React.ReactNode;
    order?: OrderAnnouncementModel | null;
    products?: ChatProduct[];
    className?: string;
};

function toProductCard(product: ChatProduct): ProductCardModel {
    return {
        id: product.id,
        slug: String(product.id),
        name: product.name,
        image: product.image || '/image/default-product.png',
        imageAlt: product.name,
        shopName: product.shop_name ?? '',
        price: product.price,
        compareAt: product.compare_at ?? undefined,
        rating: product.rating ?? undefined,
        reviewCount: product.review_count ?? 0,
        badges: (product.badges ?? []) as ProductCardModel['badges'],
        stock: product.stock ?? 'in',
    };
}

const statusLabelKeys: Record<NonNullable<ChatMessageProps['status']>, string> = {
    sending: 'Sending',
    sent: 'Sent',
    delivered: 'Delivered',
    failed: 'Failed',
};

export function ChatMessage({
    variant = 'incoming',
    content,
    timestamp,
    status,
    assistantName,
    avatar,
    order,
    products,
    className,
}: ChatMessageProps) {
    const { t } = useTranslation();
    const isOutgoing = variant === 'outgoing';
    const isSystem = variant === 'system';
    const isError = variant === 'error';

    if (isSystem) {
        return (
            <div className={cx(styles.systemMessage, className)}>
                <span className={styles.systemBubble}>{content}</span>
            </div>
        );
    }

    return (
        <div className={cx(styles.messageRow, className)} data-outgoing={isOutgoing ? 'true' : undefined}>
            {!isOutgoing ? (
                <span className={styles.messageAvatar} data-error={isError ? 'true' : undefined} aria-hidden="true">
                    {avatar ?? (isError ? <AlertTriangle /> : <Sparkles />)}
                </span>
            ) : null}

            <div className={styles.messageBody} data-has-products={products && products.length > 0 ? 'true' : undefined}>
                {!isOutgoing ? <span className={styles.messageAuthor}>{assistantName}</span> : null}

                <div className={styles.messageBubble} data-variant={isError ? 'error' : isOutgoing ? 'outgoing' : 'incoming'}>
                    {content}
                </div>

                {order ? <OrderAnnouncementCard order={order} /> : null}

                {products && products.length > 0 ? (
                    <div className={styles.messageProducts}>
                        {products.map((product) => (
                            <div key={product.id} className={styles.messageProductCard}>
                                <ProductCard
                                    product={toProductCard(product)}
                                    variant="compact"
                                    actionLabel={t('View Product')}
                                    actionIcon={ArrowUpRight}
                                    onAddToCart={() => router.visit(product.url ?? `/product/${product.id}`)}
                                />
                            </div>
                        ))}
                    </div>
                ) : null}

                <span className={styles.messageMeta}>
                    {timestamp ? <span>{timestamp}</span> : null}
                    {status ? <span>· {t(statusLabelKeys[status])}</span> : null}
                </span>
            </div>
        </div>
    );
}

export type { ChatMessageProps, ChatMessageVariant };
export default ChatMessage;
