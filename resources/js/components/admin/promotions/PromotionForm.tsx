import { type InertiaForm } from '@inertiajs/react';
import { CalendarClock, FileText, Target } from 'lucide-react';
import React, { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatDate, formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import { promotionScopeLabel, promotionStatusLabel, promotionTypeLabel, promotionValueLabel, type PromotionSeller } from './promotion-display';
import styles from './PromotionForm.module.css';
import PromotionPicker from './PromotionPicker';
import PromotionStatusBadge from './PromotionStatusBadge';

export interface PromotionProductOption {
    product_id: number;
    name: string;
    sku: string;
    price?: number;
}

export interface PromotionCategoryOption {
    category_id: number;
    name: string;
}

export interface PromotionFormData {
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
}

export interface PromotionFormPromotion {
    promotion_id: number;
    status: string;
    used_count?: number | null;
    allocated_budget?: number | string | null;
    spent_budget?: number | string | null;
    roi_percentage?: number | string | null;
    created_by_type?: string | null;
    seller?: PromotionSeller | null;
}

interface PromotionFormProps {
    form: InertiaForm<PromotionFormData>;
    mode: 'create' | 'edit';
    products: PromotionProductOption[];
    categories: PromotionCategoryOption[];
    promotionTypes: Record<string, string>;
    promotion?: PromotionFormPromotion | null;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

const toNumber = (value: number | string | null | undefined): number | null => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = Number(value);

    return Number.isFinite(numeric) ? numeric : null;
};

const formatBudget = (value: number | string | null | undefined): string => {
    const numeric = toNumber(value);

    return numeric === null ? '-' : formatVnd(numeric);
};

export default function PromotionForm({ form, mode, products, categories, promotionTypes, promotion, onSubmit, onCancel }: PromotionFormProps) {
    const { t } = useTranslation();
    const { data, setData, errors, processing } = form;

    const isEdit = mode === 'edit';
    const canEditStatus = Boolean(isEdit && promotion && ['active', 'paused'].includes(promotion.status));
    const statusValue = promotion ? (canEditStatus ? (data.is_active ? 'active' : 'paused') : promotion.status) : '';
    const roi = toNumber(promotion?.roi_percentage);

    const productOptions = useMemo(
        () =>
            products.map((product) => ({
                id: product.product_id,
                label: `${product.name} (${product.sku})`,
                searchText: `${product.name} ${product.sku}`,
            })),
        [products],
    );

    const categoryOptions = useMemo(
        () =>
            categories.map((category) => ({
                id: category.category_id,
                label: category.name,
                searchText: category.name,
            })),
        [categories],
    );

    const summaryFacts = [
        { key: 'type', label: t('Type'), value: promotionTypeLabel(data.type, promotionTypes, t) },
        { key: 'value', label: t('Discount Value'), value: promotionValueLabel(data.type, data.value) },
        { key: 'start', label: t('Start Date'), value: data.starts_at ? formatDate(data.starts_at) : '-' },
        { key: 'end', label: t('End Date'), value: data.expires_at ? formatDate(data.expires_at) : '-' },
        {
            key: 'usage',
            label: t('Usage Limit Per User'),
            value: data.usage_limit_per_user === '' ? t('Unlimited') : data.usage_limit_per_user,
        },
        { key: 'products', label: t('Products'), value: formatNumber(data.product_ids.length) },
        { key: 'categories', label: t('Categories'), value: formatNumber(data.category_ids.length) },
        { key: 'auto', label: t('Auto Apply New Products'), value: data.auto_apply_new_products ? t('Yes') : t('No') },
    ];

    return (
        <div className={styles.layout}>
            <div className={styles.panel}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <section className={styles.section} aria-labelledby="promotion-general">
                        <div className={styles.sectionHead}>
                            <h2 id="promotion-general" className={styles.sectionTitle}>
                                <FileText aria-hidden="true" className={styles.sectionIcon} />
                                {t('General Information')}
                            </h2>
                        </div>

                        <div className={styles.fieldGrid}>
                            <FormField label={t('Promotion Name')} htmlFor="promotion-name" required error={errors.name}>
                                <Input
                                    id="promotion-name"
                                    value={data.name}
                                    onChange={(event) => setData('name', event.target.value)}
                                    placeholder={t('Enter promotion name')}
                                    invalid={Boolean(errors.name)}
                                    required
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

                            {isEdit && promotion && (
                                <FormField label={t('Promotion Status')} htmlFor="promotion-status" error={errors.is_active}>
                                    <Select
                                        id="promotion-status"
                                        value={statusValue}
                                        disabled={!canEditStatus}
                                        onChange={(event) => {
                                            if (!canEditStatus) {
                                                return;
                                            }

                                            setData('is_active', event.target.value === 'active');
                                        }}
                                    >
                                        <option value="active">{t('Active')}</option>
                                        <option value="paused">{t('Paused')}</option>
                                        <option value="draft" disabled>
                                            {promotionStatusLabel('draft', t)}
                                        </option>
                                        <option value="expired" disabled>
                                            {promotionStatusLabel('expired', t)}
                                        </option>
                                    </Select>
                                </FormField>
                            )}

                            <FormField label={t('Discount Value')} htmlFor="promotion-value" required error={errors.value}>
                                <Input
                                    id="promotion-value"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.value}
                                    onChange={(event) => setData('value', event.target.value)}
                                    invalid={Boolean(errors.value)}
                                    required
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

                        {isEdit && promotion && !canEditStatus && (
                            <p className={styles.hint}>{t('Status updates automatically based on schedule.')}</p>
                        )}

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

                    <section className={styles.section} aria-labelledby="promotion-schedule">
                        <div className={styles.sectionHead}>
                            <h2 id="promotion-schedule" className={styles.sectionTitle}>
                                <CalendarClock aria-hidden="true" className={styles.sectionIcon} />
                                {t('Schedule')}
                            </h2>
                        </div>

                        <div className={styles.fieldGrid}>
                            <FormField label={t('Start Date')} htmlFor="promotion-starts" required error={errors.starts_at}>
                                <Input
                                    id="promotion-starts"
                                    type="date"
                                    value={data.starts_at}
                                    onChange={(event) => setData('starts_at', event.target.value)}
                                    invalid={Boolean(errors.starts_at)}
                                    required
                                />
                            </FormField>

                            <FormField label={t('End Date')} htmlFor="promotion-expires" required error={errors.expires_at}>
                                <Input
                                    id="promotion-expires"
                                    type="date"
                                    value={data.expires_at}
                                    onChange={(event) => setData('expires_at', event.target.value)}
                                    invalid={Boolean(errors.expires_at)}
                                    required
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

                    <section className={styles.section} aria-labelledby="promotion-targeting">
                        <div className={styles.sectionHead}>
                            <h2 id="promotion-targeting" className={styles.sectionTitle}>
                                <Target aria-hidden="true" className={styles.sectionIcon} />
                                {t('Applies to')}
                            </h2>
                        </div>

                        <div className={styles.fieldGrid}>
                            <PromotionPicker
                                id="promotion-products"
                                label={t('Select Products')}
                                options={productOptions}
                                selected={data.product_ids}
                                onChange={(selected) => setData('product_ids', selected)}
                                placeholder={t('Search products')}
                                emptyMessage={t('No matching products')}
                                error={errors.product_ids}
                            />

                            <PromotionPicker
                                id="promotion-categories"
                                label={t('Select Categories')}
                                options={categoryOptions}
                                selected={data.category_ids}
                                onChange={(selected) => setData('category_ids', selected)}
                                placeholder={t('Search categories')}
                                emptyMessage={t('No matching categories')}
                                error={errors.category_ids}
                            />
                        </div>

                        <label className={styles.checkboxRow}>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={data.auto_apply_new_products}
                                onChange={(event) => setData('auto_apply_new_products', event.target.checked)}
                            />
                            {t('Auto Apply New Products')}
                        </label>
                    </section>

                    <div className={styles.footer}>
                        <Button type="button" variant="secondary" onClick={onCancel}>
                            {t('Cancel')}
                        </Button>
                        <Button type="submit" variant="primary" loading={processing}>
                            {processing ? t('Saving...') : isEdit ? t('Save Changes') : t('Create Promotion')}
                        </Button>
                    </div>
                </form>
            </div>

            <aside className={styles.rail} aria-label={t('Summary')}>
                <section className={styles.railSection}>
                    <h2 className={styles.railTitle}>{t('Summary')}</h2>
                    <dl className={styles.facts}>
                        {summaryFacts.map((fact) => (
                            <div key={fact.key} className={styles.fact}>
                                <dt className={styles.factLabel}>{fact.label}</dt>
                                <dd className={styles.factValue}>{fact.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {promotion && (
                    <section className={styles.railSection}>
                        <h2 className={styles.railTitle}>{t('Current')}</h2>
                        <dl className={styles.facts}>
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('Status')}</dt>
                                <dd className={styles.factValue}>
                                    <PromotionStatusBadge status={promotion.status} />
                                </dd>
                            </div>
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('Scope')}</dt>
                                <dd className={styles.factValue}>{promotionScopeLabel(promotion, t)}</dd>
                            </div>
                            {promotion.seller?.username && (
                                <div className={styles.fact}>
                                    <dt className={styles.factLabel}>{t('Username')}</dt>
                                    <dd className={styles.factValue}>@{promotion.seller.username}</dd>
                                </div>
                            )}
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('Allocated Budget')}</dt>
                                <dd className={styles.factValue}>{formatBudget(promotion.allocated_budget)}</dd>
                            </div>
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('Spent Budget')}</dt>
                                <dd className={styles.factValue}>{formatBudget(promotion.spent_budget)}</dd>
                            </div>
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('ROI')}</dt>
                                <dd className={styles.factValue}>{roi === null ? '-' : `${roi.toFixed(2)}%`}</dd>
                            </div>
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('Usage')}</dt>
                                <dd className={styles.factValue}>{formatNumber(promotion.used_count ?? 0)}</dd>
                            </div>
                        </dl>
                    </section>
                )}
            </aside>
        </div>
    );
}
