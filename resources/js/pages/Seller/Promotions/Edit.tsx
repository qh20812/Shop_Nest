import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import Header from '@/components/ui/header';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '../seller.module.css';

interface ProductOption {
    product_id: number;
    name: string | Record<string, string> | null;
    sku?: string | null;
}

interface Wallet {
    balance: number | string;
    currency: string;
}

interface PromotionPayload {
    promotion_id: number;
    name: string;
    description: string | null;
    type: number | string;
    value: number | string;
    min_order_amount: number | string | null;
    max_discount_amount: number | string | null;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    allocated_budget: number | string | null;
    spent_budget: number | string | null;
    is_active: boolean;
    products: ProductOption[];
}

interface PageProps {
    promotion: PromotionPayload;
    products: ProductOption[];
    wallet?: Wallet;
    [key: string]: unknown;
}

interface FormData {
    name: string;
    description: string;
    type: string;
    value: string;
    allocated_budget: string;
    min_order_amount: string;
    max_discount_amount: string;
    start_date: string;
    end_date: string;
    usage_limit: string;
    is_active: boolean;
    product_ids: number[];
}

const TYPE_MAP: Record<string, string> = {
    '1': 'percentage',
    '2': 'fixed_amount',
    '3': 'free_shipping',
    '4': 'buy_x_get_y',
};

const normalizeType = (type: number | string): string => TYPE_MAP[String(type)] ?? String(type);

const toDateTimeLocal = (value: string | null | undefined): string => {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const pad = (part: number) => String(part).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const productName = (product: ProductOption): string => {
    if (!product.name) return `#${product.product_id}`;
    if (typeof product.name === 'string') return product.name;

    return product.name.vi || product.name.en || Object.values(product.name)[0] || `#${product.product_id}`;
};

export default function Edit() {
    const { t } = useTranslation();
    const { promotion, products = [], wallet } = usePage<PageProps>().props;

    const form = useForm<FormData>({
        name: promotion.name,
        description: promotion.description ?? '',
        type: normalizeType(promotion.type),
        value: String(promotion.value ?? ''),
        allocated_budget: String(promotion.allocated_budget ?? ''),
        min_order_amount: promotion.min_order_amount !== null ? String(promotion.min_order_amount) : '',
        max_discount_amount: promotion.max_discount_amount !== null ? String(promotion.max_discount_amount) : '',
        start_date: toDateTimeLocal(promotion.start_date),
        end_date: toDateTimeLocal(promotion.end_date),
        usage_limit: promotion.usage_limit !== null ? String(promotion.usage_limit) : '',
        is_active: Boolean(promotion.is_active),
        product_ids: promotion.products?.map((product) => product.product_id) ?? [],
    });

    const selectedProducts = useMemo(() => new Set(form.data.product_ids), [form.data.product_ids]);

    const toggleProduct = (productId: number) => {
        form.setData(
            'product_ids',
            selectedProducts.has(productId) ? form.data.product_ids.filter((id) => id !== productId) : [...form.data.product_ids, productId],
        );
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            value: Number(data.value),
            allocated_budget: Number(data.allocated_budget || 0),
            min_order_amount: data.min_order_amount === '' ? null : Number(data.min_order_amount),
            max_discount_amount: data.max_discount_amount === '' ? null : Number(data.max_discount_amount),
            usage_limit: data.usage_limit === '' ? null : Number(data.usage_limit),
        }));

        form.put(`/seller/promotions/${promotion.promotion_id}`);
    };

    return (
        <WorkspaceLayout>
            <Head title={`${t('Edit Promotion')} - ${promotion.name}`} />

            <Header
                title={t('Edit Promotion')}
                breadcrumbs={[
                    { label: t('Seller Dashboard'), href: '/seller/dashboard' },
                    { label: t('Promotions'), href: '/seller/promotions' },
                    { label: promotion.name, href: `/seller/promotions/${promotion.promotion_id}` },
                    { label: t('Edit'), href: '#', active: true },
                ]}
            />

            <form onSubmit={submit} className={styles.stack}>
                <Card variant="flat" padding="md">
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>{t('Basic Information')}</h2>

                        <FormField label={t('Promotion Name')} required error={form.errors.name}>
                            <Input
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                invalid={Boolean(form.errors.name)}
                            />
                        </FormField>

                        <FormField label={t('Description')} error={form.errors.description}>
                            <Input
                                value={form.data.description}
                                onChange={(event) => form.setData('description', event.target.value)}
                                invalid={Boolean(form.errors.description)}
                            />
                        </FormField>

                        <div className={styles.formGrid}>
                            <FormField label={t('Discount Type')} required error={form.errors.type}>
                                <Select
                                    value={form.data.type}
                                    onChange={(event) => form.setData('type', event.target.value)}
                                    invalid={Boolean(form.errors.type)}
                                >
                                    <option value="percentage">{t('Percentage')}</option>
                                    <option value="fixed_amount">{t('Fixed Amount Discount')}</option>
                                    <option value="free_shipping">{t('Free Shipping')}</option>
                                    <option value="buy_x_get_y">{t('Buy X Get Y')}</option>
                                </Select>
                            </FormField>

                            <FormField label={t('Discount Value')} required error={form.errors.value}>
                                <Input
                                    type="number"
                                    min="0"
                                    value={form.data.value}
                                    onChange={(event) => form.setData('value', event.target.value)}
                                    invalid={Boolean(form.errors.value)}
                                />
                            </FormField>
                        </div>
                    </div>
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>{t('Budget & Duration')}</h2>

                        <FormField
                            label={t('Budget (VND)')}
                            error={form.errors.allocated_budget}
                            hint={`${t('Available balance')}: ${formatVnd(Number(wallet?.balance ?? 0))}`}
                        >
                            <Input
                                type="number"
                                min="0"
                                value={form.data.allocated_budget}
                                onChange={(event) => form.setData('allocated_budget', event.target.value)}
                                invalid={Boolean(form.errors.allocated_budget)}
                            />
                        </FormField>

                        <div className={styles.formGrid}>
                            <FormField label={t('Start Date')} required error={form.errors.start_date}>
                                <Input
                                    type="datetime-local"
                                    value={form.data.start_date}
                                    onChange={(event) => form.setData('start_date', event.target.value)}
                                    invalid={Boolean(form.errors.start_date)}
                                />
                            </FormField>

                            <FormField label={t('End Date')} required error={form.errors.end_date}>
                                <Input
                                    type="datetime-local"
                                    value={form.data.end_date}
                                    onChange={(event) => form.setData('end_date', event.target.value)}
                                    invalid={Boolean(form.errors.end_date)}
                                />
                            </FormField>
                        </div>

                        <div className={styles.formGrid}>
                            <FormField label={t('Minimum Order Value')} error={form.errors.min_order_amount}>
                                <Input
                                    type="number"
                                    min="0"
                                    value={form.data.min_order_amount}
                                    onChange={(event) => form.setData('min_order_amount', event.target.value)}
                                    invalid={Boolean(form.errors.min_order_amount)}
                                />
                            </FormField>

                            <FormField label={t('Maximum Discount')} error={form.errors.max_discount_amount}>
                                <Input
                                    type="number"
                                    min="0"
                                    value={form.data.max_discount_amount}
                                    onChange={(event) => form.setData('max_discount_amount', event.target.value)}
                                    invalid={Boolean(form.errors.max_discount_amount)}
                                />
                            </FormField>
                        </div>

                        <div className={styles.formGrid}>
                            <FormField label={t('Usage Limit')} error={form.errors.usage_limit}>
                                <Input
                                    type="number"
                                    min="1"
                                    value={form.data.usage_limit}
                                    onChange={(event) => form.setData('usage_limit', event.target.value)}
                                    invalid={Boolean(form.errors.usage_limit)}
                                />
                            </FormField>

                            <FormField label={t('Status')} error={form.errors.is_active}>
                                <Select
                                    value={form.data.is_active ? 'active' : 'paused'}
                                    onChange={(event) => form.setData('is_active', event.target.value === 'active')}
                                    invalid={Boolean(form.errors.is_active)}
                                >
                                    <option value="active">{t('Active')}</option>
                                    <option value="paused">{t('Paused')}</option>
                                </Select>
                            </FormField>
                        </div>
                    </div>
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>{t('Select Products')}</h2>

                        <div className={styles.productSelectGrid}>
                            {products.map((product) => {
                                const selected = selectedProducts.has(product.product_id);

                                return (
                                    <button
                                        key={product.product_id}
                                        type="button"
                                        className={`${styles.productSelectItem} ${selected ? styles.productSelectItemActive : ''}`.trim()}
                                        onClick={() => toggleProduct(product.product_id)}
                                    >
                                        <span className={styles.productSelectBody}>
                                            <span className={styles.productSelectName}>{productName(product)}</span>
                                            <span className={styles.productSelectPrice}>{product.sku ?? ''}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {form.errors.product_ids && <p className={styles.muted}>{form.errors.product_ids}</p>}
                    </div>
                </Card>

                <div className={styles.formFooter}>
                    <Link href={`/seller/promotions/${promotion.promotion_id}`}>{t('Cancel')}</Link>
                    <Button type="submit" variant="primary" loading={form.processing}>
                        {t('Save Changes')}
                    </Button>
                </div>
            </form>
        </WorkspaceLayout>
    );
}
