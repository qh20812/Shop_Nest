import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import Header from '@/components/ui/header';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface ProductOption {
    product_id: number;
    name: string;
    sku: string;
}

interface CategoryOption {
    category_id: number;
    name: string;
}

interface PromotionPayload {
    promotion_id: number;
    name: string;
    description: string | null;
    type: string;
    value: number | string;
    min_order_amount: number | string | null;
    max_discount_amount: number | string | null;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    products: ProductOption[];
    categories: CategoryOption[];
    auto_apply_new_products: boolean;
    is_active: boolean;
    status: string;
}

interface PageProps {
    promotion: PromotionPayload;
    products: ProductOption[];
    categories: CategoryOption[];
    promotionTypes: Record<string, string>;
    flash?: { success?: string; error?: string };
    errors: Record<string, string>;
    [key: string]: unknown;
}

type FormState = {
    name: string;
    description: string;
    type: string;
    value: string;
    minimum_order_value: string;
    max_discount_amount: string;
    starts_at: string;
    expires_at: string;
    usage_limit_per_user: string;
    product_ids: number[];
    category_ids: number[];
    auto_apply_new_products: boolean;
    is_active: boolean;
};

const formatDateInput = (value: string) => {
    if (!value) {
        return '';
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function Edit() {
    const { t } = useTranslation();
    const { promotion, products = [], categories = [], promotionTypes = {}, flash } = usePage<PageProps>().props;

    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const selectedProductIds = useMemo(() => promotion.products.map((product) => product.product_id), [promotion.products]);
    const selectedCategoryIds = useMemo(() => promotion.categories.map((category) => category.category_id), [promotion.categories]);
    const isStatusEditable = useMemo(() => ['active', 'paused'].includes(promotion.status), [promotion.status]);

    const { data, setData, put, processing, errors } = useForm<FormState>({
        name: promotion.name ?? '',
        description: promotion.description ?? '',
        type: promotion.type,
        value: String(promotion.value ?? ''),
        minimum_order_value: promotion.min_order_amount !== null ? String(promotion.min_order_amount) : '',
        max_discount_amount: promotion.max_discount_amount !== null ? String(promotion.max_discount_amount) : '',
        starts_at: formatDateInput(promotion.start_date),
        expires_at: formatDateInput(promotion.end_date),
        usage_limit_per_user: promotion.usage_limit !== null ? String(promotion.usage_limit) : '',
        product_ids: selectedProductIds,
        category_ids: selectedCategoryIds,
        auto_apply_new_products: promotion.auto_apply_new_products,
        is_active: promotion.is_active,
    });

    const statusValue = useMemo(() => {
        if (isStatusEditable) {
            return data.is_active ? 'active' : 'paused';
        }

        return promotion.status;
    }, [data.is_active, isStatusEditable, promotion.status]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/admin/promotions/${promotion.promotion_id}`);
    };

    const handleMultiSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, key: 'product_ids' | 'category_ids') => {
        const values = Array.from(event.target.selectedOptions, (option) => Number(option.value));
        setData(key, values);
    };

    return (
        <WorkspaceLayout>
            <Head title={`${t('Edit Promotion')} - ${promotion.name}`} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <Header
                title={t('Edit Promotion')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Promotions'), href: '/admin/promotions' },
                    { label: t('Edit'), href: '#', active: true },
                ]}
            />

            <form className={styles.stack} onSubmit={handleSubmit}>
                <section className={styles.formSection}>
                    <h2 className={styles.formSectionTitle}>{t('General Information')}</h2>
                    <div className={styles.formGrid}>
                        <FormField label={t('Promotion Name')} htmlFor="promotion-name" required error={errors.name}>
                            <Input
                                id="promotion-name"
                                value={data.name}
                                onChange={(event) => setData('name', event.target.value)}
                                placeholder={t('Enter promotion name')}
                                invalid={Boolean(errors.name)}
                            />
                        </FormField>

                        <FormField label={t('Promotion Type')} htmlFor="promotion-type" error={errors.type}>
                            <Select
                                id="promotion-type"
                                value={data.type}
                                onChange={(event) => setData('type', event.target.value)}
                                invalid={Boolean(errors.type)}
                            >
                                {Object.entries(promotionTypes).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {t(label)}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label={t('Promotion Status')} htmlFor="promotion-status" error={errors.is_active}>
                            <Select
                                id="promotion-status"
                                value={statusValue}
                                disabled={!isStatusEditable}
                                onChange={(event) => {
                                    if (!isStatusEditable) {
                                        return;
                                    }

                                    setData('is_active', event.target.value === 'active');
                                }}
                            >
                                <option value="active">{t('Active')}</option>
                                <option value="paused">{t('Paused')}</option>
                                <option value="draft" disabled>
                                    {t('Draft')}
                                </option>
                                <option value="expired" disabled>
                                    {t('Expired')}
                                </option>
                            </Select>
                        </FormField>

                        <FormField label={t('Discount Value')} htmlFor="promotion-value" required error={errors.value}>
                            <Input
                                id="promotion-value"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.value}
                                onChange={(event) => setData('value', event.target.value)}
                                invalid={Boolean(errors.value)}
                            />
                        </FormField>

                        <FormField label={t('Minimum Order Value')} htmlFor="promotion-minimum" error={errors.minimum_order_value}>
                            <Input
                                id="promotion-minimum"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.minimum_order_value}
                                onChange={(event) => setData('minimum_order_value', event.target.value)}
                                invalid={Boolean(errors.minimum_order_value)}
                            />
                        </FormField>

                        <FormField label={t('Maximum Discount Amount')} htmlFor="promotion-maximum" error={errors.max_discount_amount}>
                            <Input
                                id="promotion-maximum"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.max_discount_amount}
                                onChange={(event) => setData('max_discount_amount', event.target.value)}
                                invalid={Boolean(errors.max_discount_amount)}
                            />
                        </FormField>
                    </div>

                    {!isStatusEditable && <p className={styles.note}>{t('Status updates automatically based on schedule.')}</p>}

                    <FormField label={t('Description')} htmlFor="promotion-description" error={errors.description}>
                        <textarea
                            id="promotion-description"
                            className={styles.textArea}
                            value={data.description}
                            onChange={(event) => setData('description', event.target.value)}
                            placeholder={t('Describe the promotion...')}
                        />
                    </FormField>
                </section>

                <section className={styles.formSection}>
                    <h2 className={styles.formSectionTitle}>{t('Scheduling and Budget')}</h2>
                    <div className={styles.formGrid}>
                        <FormField label={t('Start Date')} htmlFor="promotion-starts" required error={errors.starts_at}>
                            <Input
                                id="promotion-starts"
                                type="date"
                                value={data.starts_at}
                                onChange={(event) => setData('starts_at', event.target.value)}
                                invalid={Boolean(errors.starts_at)}
                            />
                        </FormField>

                        <FormField label={t('End Date')} htmlFor="promotion-expires" required error={errors.expires_at}>
                            <Input
                                id="promotion-expires"
                                type="date"
                                value={data.expires_at}
                                onChange={(event) => setData('expires_at', event.target.value)}
                                invalid={Boolean(errors.expires_at)}
                            />
                        </FormField>

                        <FormField label={t('Usage Limit Per User')} htmlFor="promotion-usage" error={errors.usage_limit_per_user}>
                            <Input
                                id="promotion-usage"
                                type="number"
                                min="0"
                                value={data.usage_limit_per_user}
                                onChange={(event) => setData('usage_limit_per_user', event.target.value)}
                                invalid={Boolean(errors.usage_limit_per_user)}
                            />
                        </FormField>
                    </div>
                </section>

                <section className={styles.formSection}>
                    <h2 className={styles.formSectionTitle}>{t('Targeting')}</h2>
                    <div className={styles.formGrid}>
                        <FormField label={t('Select Products')} htmlFor="promotion-products" error={errors.product_ids}>
                            <select
                                id="promotion-products"
                                multiple
                                className={styles.multiSelect}
                                value={data.product_ids.map(String)}
                                onChange={(event) => handleMultiSelectChange(event, 'product_ids')}
                            >
                                {products.map((product) => (
                                    <option key={product.product_id} value={product.product_id}>
                                        {`${product.name} (${product.sku})`}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label={t('Select Categories')} htmlFor="promotion-categories" error={errors.category_ids}>
                            <select
                                id="promotion-categories"
                                multiple
                                className={styles.multiSelect}
                                value={data.category_ids.map(String)}
                                onChange={(event) => handleMultiSelectChange(event, 'category_ids')}
                            >
                                {categories.map((category) => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    </div>

                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={data.auto_apply_new_products}
                            onChange={(event) => setData('auto_apply_new_products', event.target.checked)}
                        />
                        {t('Auto Apply New Products')}
                    </label>
                </section>

                <div className={styles.formFooter}>
                    <Button type="button" variant="secondary" onClick={() => router.get(`/admin/promotions/${promotion.promotion_id}`)}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" variant="primary" loading={processing}>
                        {processing ? t('Saving...') : t('Save Changes')}
                    </Button>
                </div>
            </form>
        </WorkspaceLayout>
    );
}
