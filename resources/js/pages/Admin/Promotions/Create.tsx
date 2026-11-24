import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import Header from '@/components/ui/header';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface Product {
    product_id: number;
    name: string;
    sku: string;
    price: number;
}

interface Category {
    category_id: number;
    name: string;
}

interface PageProps {
    products: Product[];
    categories: Category[];
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

export default function Create() {
    const { t } = useTranslation();
    const { products = [], categories = [], promotionTypes = {}, flash } = usePage<PageProps>().props;
    const [showErrorToast, setShowErrorToast] = useState(false);

    useEffect(() => {
        if (flash?.error) {
            setShowErrorToast(true);
        }
    }, [flash?.error]);

    const firstType = Object.keys(promotionTypes)[0] ?? 'percentage';

    const { data, setData, post, processing, errors } = useForm<FormState>({
        name: '',
        description: '',
        type: firstType,
        value: '',
        minimum_order_value: '',
        max_discount_amount: '',
        starts_at: '',
        expires_at: '',
        usage_limit_per_user: '',
        product_ids: [],
        category_ids: [],
        auto_apply_new_products: false,
        is_active: true,
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/promotions');
    };

    const handleMultiSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, key: 'product_ids' | 'category_ids') => {
        const values = Array.from(event.target.selectedOptions, (option) => Number(option.value));
        setData(key, values);
    };

    return (
        <AppLayout>
            <Head title={t('Create Promotion')} />

            {flash?.error && showErrorToast && <Toast type="error" message={flash.error} onClose={() => setShowErrorToast(false)} />}

            <Header
                title={t('Create Promotion')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Promotions'), href: '/admin/promotions' },
                    { label: t('Create'), href: '/admin/promotions/create', active: true },
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
                    <Button type="button" variant="secondary" onClick={() => router.get('/admin/promotions')}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" variant="primary" loading={processing}>
                        {processing ? t('Saving...') : t('Create')}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
