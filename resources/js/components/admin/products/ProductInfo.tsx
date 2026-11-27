import { Link } from '@inertiajs/react';
import { ArrowUpRight, Boxes, Info, Store } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { formatDate, formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from './products.module.css';

interface Seller {
    id: number;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    avatar?: string | null;
}

interface NamedRecord {
    name?: string | Record<string, string>;
}

interface Variant {
    variant_id: number;
    price?: number | string | null;
    stock_quantity?: number | string | null;
}

interface Product {
    product_id: number;
    category?: NamedRecord | null;
    brand?: NamedRecord | null;
    seller?: Seller | null;
    variants?: Variant[];
    created_at?: string | null;
    updated_at?: string | null;
}

interface ProductInfoProps {
    product: Product;
}

const resolveText = (value: string | Record<string, string> | undefined, locale: string, fallback: string): string => {
    if (!value) {
        return fallback;
    }

    if (typeof value === 'string') {
        return value;
    }

    return value[locale] ?? value.en ?? Object.values(value)[0] ?? fallback;
};

export default function ProductInfo({ product }: ProductInfoProps) {
    const { t, locale } = useTranslation();
    const seller = product.seller;
    const variants = product.variants ?? [];

    const sellerName = [seller?.first_name, seller?.last_name].filter(Boolean).join(' ').trim();
    const categoryName = resolveText(product.category?.name, locale, t('No Category'));
    const brandName = resolveText(product.brand?.name, locale, t('No Brand'));

    const totalStock = variants.reduce((total, variant) => total + Number(variant.stock_quantity ?? 0), 0);
    const prices = variants
        .map((variant) => (variant.price === null || variant.price === undefined || variant.price === '' ? null : Number(variant.price)))
        .filter((price): price is number => price !== null && Number.isFinite(price));

    const priceRange =
        prices.length === 0
            ? t('Price not available')
            : Math.min(...prices) === Math.max(...prices)
              ? formatVnd(Math.min(...prices))
              : `${formatVnd(Math.min(...prices))} - ${formatVnd(Math.max(...prices))}`;

    return (
        <div className={styles.info}>
            <section className={styles.infoSection} aria-labelledby="product-seller-heading">
                <h2 id="product-seller-heading" className={styles.infoTitle}>
                    <Store aria-hidden="true" className={styles.infoTitleIcon} />
                    {t('Seller')}
                </h2>

                {seller ? (
                    <>
                        <div className={styles.seller}>
                            <Avatar user={seller} size="lg" />
                            <div className={styles.sellerBody}>
                                <span className={styles.sellerName}>{sellerName || seller.username || t('Unknown Seller')}</span>
                                {seller.username && <span className={styles.sellerMeta}>@{seller.username}</span>}
                                {seller.email && <span className={styles.sellerMeta}>{seller.email}</span>}
                            </div>
                        </div>
                        <Link href={`/admin/shops/${seller.id}`} className={styles.infoLink}>
                            {t('View shop')}
                            <ArrowUpRight aria-hidden="true" className={styles.infoLinkIcon} />
                        </Link>
                    </>
                ) : (
                    <p className={styles.infoNote}>{t('Unknown Seller')}</p>
                )}
            </section>

            <section className={styles.infoSection} aria-labelledby="product-overview-heading">
                <h2 id="product-overview-heading" className={styles.infoTitle}>
                    <Info aria-hidden="true" className={styles.infoTitleIcon} />
                    {t('Product Overview')}
                </h2>

                <dl className={styles.facts}>
                    <div className={styles.fact}>
                        <dt className={styles.factLabel}>{t('Product ID')}</dt>
                        <dd className={styles.factValue}>#{product.product_id}</dd>
                    </div>
                    <div className={styles.fact}>
                        <dt className={styles.factLabel}>{t('Category')}</dt>
                        <dd className={styles.factValue}>{categoryName}</dd>
                    </div>
                    <div className={styles.fact}>
                        <dt className={styles.factLabel}>{t('Brand')}</dt>
                        <dd className={styles.factValue}>{brandName}</dd>
                    </div>
                    <div className={styles.fact}>
                        <dt className={styles.factLabel}>{t('Created At')}</dt>
                        <dd className={styles.factValue}>{product.created_at ? formatDate(product.created_at) : '-'}</dd>
                    </div>
                    <div className={styles.fact}>
                        <dt className={styles.factLabel}>{t('Updated At')}</dt>
                        <dd className={styles.factValue}>{product.updated_at ? formatDate(product.updated_at) : '-'}</dd>
                    </div>
                </dl>
            </section>

            <section className={styles.infoSection} aria-labelledby="product-inventory-heading">
                <h2 id="product-inventory-heading" className={styles.infoTitle}>
                    <Boxes aria-hidden="true" className={styles.infoTitleIcon} />
                    {t('Inventory')}
                </h2>

                <dl className={styles.facts}>
                    <div className={styles.fact}>
                        <dt className={styles.factLabel}>{t('Total Variants')}</dt>
                        <dd className={styles.factValue}>{formatNumber(variants.length)}</dd>
                    </div>
                    <div className={styles.fact}>
                        <dt className={styles.factLabel}>{t('Total Stock')}</dt>
                        <dd className={styles.factValue}>{formatNumber(totalStock)}</dd>
                    </div>
                    <div className={styles.fact}>
                        <dt className={styles.factLabel}>{t('Price Range')}</dt>
                        <dd className={styles.factValue}>{priceRange}</dd>
                    </div>
                </dl>
            </section>
        </div>
    );
}
