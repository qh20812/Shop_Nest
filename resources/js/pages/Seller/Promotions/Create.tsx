import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import { FormField } from '@/components/ui/form-field';
import Header from '@/components/ui/header';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Package, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import styles from '../seller.module.css';

interface Product {
    product_id: number;
    name: string | { vi?: string; en?: string } | null;
    images: Array<{ image_url: string; is_primary: boolean }>;
    variants: Array<{ price: number }>;
}

interface Wallet {
    balance: number;
    currency: string;
}

export default function Create() {
    const { t } = useTranslation();
    const { products = [], wallet } = usePage<{ products?: Product[]; wallet?: Wallet }>().props;

    const [formData, setFormData] = useState({
        name: '',
        type: 'percentage',
        value: '',
        budget: '',
        start_date: '',
        end_date: '',
        selected_products: [] as number[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const filteredProducts = useMemo(
        () =>
            products.filter((product) => {
                const name = typeof product.name === 'string' ? product.name : product.name?.vi || product.name?.en || '';
                return name.toLowerCase().includes(searchTerm.toLowerCase());
            }),
        [products, searchTerm],
    );

    const validateForm = (): Record<string, string> => {
        const validation: Record<string, string> = {};

        if (!formData.name.trim()) {
            validation.name = t('Promotion name is required');
        }

        if (!formData.value || parseFloat(formData.value) <= 0) {
            validation.value = t('Discount value must be greater than 0');
        }

        if (formData.type === 'percentage' && parseFloat(formData.value) > 90) {
            validation.value = t('Percentage discount cannot exceed 90%');
        }

        if (!formData.budget || parseFloat(formData.budget) <= 0) {
            validation.budget = t('Budget must be greater than 0');
        }

        if (parseFloat(formData.budget) > (wallet?.balance || 0)) {
            validation.budget = t('Budget cannot exceed available balance');
        }

        if (!formData.start_date) {
            validation.start_date = t('Start date is required');
        } else {
            const startDate = new Date(formData.start_date);
            const now = new Date();
            if (startDate <= now) {
                validation.start_date = t('Start date must be in the future');
            }
        }

        if (!formData.end_date) {
            validation.end_date = t('End date is required');
        } else if (formData.start_date && formData.end_date) {
            const startDate = new Date(formData.start_date);
            const endDate = new Date(formData.end_date);
            if (endDate <= startDate) {
                validation.end_date = t('End date must be after start date');
            }
        }

        if (formData.selected_products.length === 0) {
            validation.selected_products = t('At least one product must be selected');
        }

        return validation;
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setShowConfirmDialog(true);
    };

    const handleConfirmSubmit = () => {
        setShowConfirmDialog(false);
        setIsSubmitting(true);
        setErrors({});

        // Map form data to backend expected format
        const submitData = {
            name: formData.name,
            type: formData.type === 'fixed' ? 'fixed_amount' : formData.type,
            value: parseFloat(formData.value),
            allocated_budget: parseFloat(formData.budget),
            start_date: formData.start_date,
            end_date: formData.end_date,
            product_ids: formData.selected_products,
        };

        router.post('/seller/promotions', submitData, {
            onSuccess: () => {
                router.visit('/seller/promotions', {
                    method: 'get',
                    data: { success: t('Promotion created successfully!') },
                });
            },
            onError: (formErrors) => {
                setErrors(formErrors);
                setIsSubmitting(false);
            },
        });
    };

    const handleProductToggle = (productId: number) => {
        setFormData((prev) => ({
            ...prev,
            selected_products: prev.selected_products.includes(productId)
                ? prev.selected_products.filter((id) => id !== productId)
                : [...prev.selected_products, productId],
        }));
    };

    const handleSelectAll = () => {
        setFormData((prev) => ({
            ...prev,
            selected_products: filteredProducts.map((product) => product.product_id),
        }));
    };

    const handleDeselectAll = () => {
        setFormData((prev) => ({
            ...prev,
            selected_products: [],
        }));
    };

    return (
        <WorkspaceLayout>
            <Head title={t('Create Promotion')} />

            <Header
                title={t('Create New Promotion')}
                breadcrumbs={[
                    { label: t('Seller Dashboard'), href: '/seller/dashboard' },
                    { label: t('Promotions'), href: '/seller/promotions' },
                    { label: t('Create'), href: '/seller/promotions/create', active: true },
                ]}
            />

            <form onSubmit={handleSubmit} className={styles.stack}>
                <Card variant="flat" padding="md">
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>{t('Basic Information')}</h2>

                        <FormField label={t('Promotion Name')} required error={errors.name}>
                            <Input
                                value={formData.name}
                                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                                placeholder={t('Enter promotion name')}
                            />
                        </FormField>

                        <FormField label={t('Discount Type')} required error={errors.type}>
                            <Select value={formData.type} onChange={(event) => setFormData({ ...formData, type: event.target.value })}>
                                <option value="percentage">{t('Percentage')}</option>
                                <option value="fixed">{t('Fixed Amount Discount')}</option>
                            </Select>
                        </FormField>

                        <FormField
                            label={formData.type === 'percentage' ? t('Discount Percentage') : t('Discount Amount')}
                            required
                            error={errors.value}
                        >
                            <Input
                                type="number"
                                value={formData.value}
                                onChange={(event) => setFormData({ ...formData, value: event.target.value })}
                                placeholder={formData.type === 'percentage' ? '10' : '50000'}
                                min="0"
                                max={formData.type === 'percentage' ? '90' : undefined}
                            />
                        </FormField>
                    </div>
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>{t('Budget & Duration')}</h2>

                        <FormField
                            label={t('Budget (VND)')}
                            required
                            error={errors.budget}
                            hint={`${t('Available balance')}: ${formatVnd(Number(wallet?.balance ?? 0))}`}
                        >
                            <Input
                                type="number"
                                value={formData.budget}
                                onChange={(event) => setFormData({ ...formData, budget: event.target.value })}
                                placeholder="100000"
                                min="0"
                                max={wallet?.balance || 0}
                            />
                        </FormField>

                        <div className={styles.formGrid}>
                            <FormField label={t('Start Date')} required error={errors.start_date}>
                                <Input
                                    type="datetime-local"
                                    value={formData.start_date}
                                    onChange={(event) => setFormData({ ...formData, start_date: event.target.value })}
                                />
                            </FormField>

                            <FormField label={t('End Date')} required error={errors.end_date}>
                                <Input
                                    type="datetime-local"
                                    value={formData.end_date}
                                    onChange={(event) => setFormData({ ...formData, end_date: event.target.value })}
                                />
                            </FormField>
                        </div>
                    </div>
                </Card>

                <Card variant="flat" padding="md">
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>{t('Select Products')}</h2>

                        <div className={styles.selectionBar}>
                            <div className={styles.selectionSearch}>
                                <Input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder={t('Search products...')}
                                    aria-label={t('Search products')}
                                    leadingIcon={Search}
                                />
                            </div>
                            <div className={styles.actions}>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleSelectAll}
                                    disabled={filteredProducts.length === 0}
                                >
                                    {t('Select All')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleDeselectAll}
                                    disabled={formData.selected_products.length === 0}
                                >
                                    {t('Deselect All')}
                                </Button>
                            </div>
                        </div>

                        <p className={styles.selectionSummary}>
                            {t('Selected')}: {formData.selected_products.length} {t('products')}
                        </p>

                        {filteredProducts.length === 0 ? (
                            <EmptyState
                                icon={Package}
                                title={searchTerm ? t('No products found') : t('No products available')}
                                description={
                                    searchTerm ? t('Try adjusting your search terms') : t('You need to add products before creating promotions')
                                }
                                actions={
                                    !searchTerm ? (
                                        <Button asChild variant="primary" size="sm">
                                            <Link href="/seller/products/create">{t('Add Product')}</Link>
                                        </Button>
                                    ) : undefined
                                }
                            />
                        ) : (
                            <div className={styles.productSelectGrid}>
                                {filteredProducts.map((product) => {
                                    const selected = formData.selected_products.includes(product.product_id);
                                    const name = typeof product.name === 'string' ? product.name : product.name?.vi || product.name?.en || '';
                                    const image = product.images?.find((item) => item.is_primary)?.image_url;

                                    return (
                                        <button
                                            key={product.product_id}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() => handleProductToggle(product.product_id)}
                                            className={`${styles.productSelectItem} ${selected ? styles.productSelectItemActive : ''}`}
                                        >
                                            {image ? (
                                                <img src={image} alt={name} className={styles.productThumb} />
                                            ) : (
                                                <span className={styles.productThumb} aria-hidden="true" />
                                            )}
                                            <span className={styles.productSelectBody}>
                                                <span className={styles.productSelectName}>{name}</span>
                                                <span className={styles.productSelectPrice}>
                                                    {formatVnd(Number(product.variants?.[0]?.price ?? 0))}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {errors.selected_products && (
                            <span className="sn-field__error" role="alert">
                                {errors.selected_products}
                            </span>
                        )}
                    </div>
                </Card>

                <div className={styles.actionsEnd}>
                    <Button asChild variant="secondary">
                        <Link href="/seller/promotions">{t('Cancel')}</Link>
                    </Button>
                    <Button type="submit" variant="primary" loading={isSubmitting}>
                        {t('Create Promotion')}
                    </Button>
                </div>
            </form>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title={t('Confirm Create Promotion')}
                description={
                    <span className={styles.confirmList}>
                        <span className={styles.confirmRow}>
                            <span>{t('Promotion Name')}</span>
                            <span className={styles.confirmValue}>{formData.name}</span>
                        </span>
                        <span className={styles.confirmRow}>
                            <span>{t('Discount Type')}</span>
                            <span className={styles.confirmValue}>
                                {formData.type === 'percentage' ? t('Percentage') : t('Fixed Amount Discount')}
                            </span>
                        </span>
                        <span className={styles.confirmRow}>
                            <span>{t('Discount Value')}</span>
                            <span className={styles.confirmValue}>
                                {formData.value} {formData.type === 'percentage' ? '%' : 'VND'}
                            </span>
                        </span>
                        <span className={styles.confirmRow}>
                            <span>{t('Budget')}</span>
                            <span className={styles.confirmValue}>{formatVnd(parseFloat(formData.budget))}</span>
                        </span>
                        <span className={styles.confirmRow}>
                            <span>{t('Products Selected')}</span>
                            <span className={styles.confirmValue}>{formData.selected_products.length}</span>
                        </span>
                        <span className={styles.muted}>
                            {t('Are you sure you want to create this promotion? This will deduct from your wallet balance.')}
                        </span>
                    </span>
                }
                confirmLabel={t('Confirm Create')}
                cancelLabel={t('Cancel')}
                tone="warning"
                loading={isSubmitting}
                onConfirm={handleConfirmSubmit}
            />
        </WorkspaceLayout>
    );
}
