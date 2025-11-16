// Seller/Promotions/Create.tsx
import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

interface Product {
    product_id: number;
    name: string;
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
        selected_products: [] as number[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const validateForm = (): Record<string, string> => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = t('Promotion name is required');
        }

        if (!formData.value || parseFloat(formData.value) <= 0) {
            errors.value = t('Discount value must be greater than 0');
        }

        if (formData.type === 'percentage' && parseFloat(formData.value) > 90) {
            errors.value = t('Percentage discount cannot exceed 90%');
        }

        if (!formData.budget || parseFloat(formData.budget) <= 0) {
            errors.budget = t('Budget must be greater than 0');
        }

        if (parseFloat(formData.budget) > (wallet?.balance || 0)) {
            errors.budget = t('Budget cannot exceed available balance');
        }

        if (!formData.start_date) {
            errors.start_date = t('Start date is required');
        } else {
            const startDate = new Date(formData.start_date);
            const now = new Date();
            if (startDate <= now) {
                errors.start_date = t('Start date must be in the future');
            }
        }

        if (!formData.end_date) {
            errors.end_date = t('End date is required');
        } else if (formData.start_date && formData.end_date) {
            const startDate = new Date(formData.start_date);
            const endDate = new Date(formData.end_date);
            if (endDate <= startDate) {
                errors.end_date = t('End date must be after start date');
            }
        }

        if (formData.selected_products.length === 0) {
            errors.selected_products = t('At least one product must be selected');
        }

        return errors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

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
            product_ids: formData.selected_products
        };

        router.post('/seller/promotions', submitData, {
            onSuccess: () => {
                router.visit('/seller/promotions', {
                    method: 'get',
                    data: { success: t('Promotion created successfully!') }
                });
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            }
        });
    };

    const handleProductToggle = (productId: number) => {
        setFormData(prev => ({
            ...prev,
            selected_products: prev.selected_products.includes(productId)
                ? prev.selected_products.filter(id => id !== productId)
                : [...prev.selected_products, productId]
        }));
    };

    const handleSelectAll = () => {
        setFormData(prev => ({
            ...prev,
            selected_products: filteredProducts.map(p => p.product_id)
        }));
    };

    const handleDeselectAll = () => {
        setFormData(prev => ({
            ...prev,
            selected_products: []
        }));
    };

    return (
        <AppLayout>
            <Head title={t("Create Promotion")} />

            <div className="content">
                <main>
                    <div className="header">
                        <div className="left">
                            <h1>{t("Create New Promotion")}</h1>
                            <div className="breadcrumb">
                                <li><a href="/seller/dashboard">{t("Dashboard")}</a></li>
                                <li><a href="/seller/promotions">{t("Promotions")}</a></li>
                                <li><a className="active">{t("Create")}</a></li>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="promotion-form">
                        <div className="form-section">
                            <h3 className="form-section-title">{t("Basic Information")}</h3>

                            <div className="form-group">
                                <label className="form-label">{t("Promotion Name")}</label>
                                <input
                                    type="text"
                                    className={`form-input-field ${errors.name ? 'error' : ''}`}
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder={t("Enter promotion name")}
                                />
                                {errors.name && <div className="form-error">{errors.name}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t("Discount Type")}</label>
                                <select
                                    className={`form-input-field ${errors.type ? 'error' : ''}`}
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="percentage">{t("Percentage")}</option>
                                    <option value="fixed">{t("Fixed Amount Discount")}</option>
                                </select>
                                {errors.type && <div className="form-error">{errors.type}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    {formData.type === 'percentage' ? t("Discount Percentage") : t("Discount Amount")}
                                </label>
                                <input
                                    type="number"
                                    className={`form-input-field ${errors.value ? 'error' : ''}`}
                                    value={formData.value}
                                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                                    placeholder={formData.type === 'percentage' ? "10" : "50000"}
                                    min="0"
                                    max={formData.type === 'percentage' ? "90" : undefined}
                                />
                                {errors.value && <div className="form-error">{errors.value}</div>}
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">{t("Budget & Duration")}</h3>

                            <div className="form-group">
                                <label className="form-label">{t("Budget (VND)")}</label>
                                <input
                                    type="number"
                                    className={`form-input-field ${errors.budget ? 'error' : ''}`}
                                    value={formData.budget}
                                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                    placeholder="100000"
                                    min="0"
                                    max={wallet?.balance || 0}
                                />
                                <div style={{ fontSize: '12px', color: 'var(--dark-grey)', marginTop: '4px' }}>
                                    {t("Available balance")}: {wallet?.balance?.toLocaleString() || 0} VND
                                </div>
                                {errors.budget && <div className="form-error">{errors.budget}</div>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">{t("Start Date")}</label>
                                    <input
                                        type="datetime-local"
                                        className={`form-input-field ${errors.start_date ? 'error' : ''}`}
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                    />
                                    {errors.start_date && <div className="form-error">{errors.start_date}</div>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t("End Date")}</label>
                                    <input
                                        type="datetime-local"
                                        className={`form-input-field ${errors.end_date ? 'error' : ''}`}
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                    />
                                    {errors.end_date && <div className="form-error">{errors.end_date}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">{t("Select Products")}</h3>

                            {/* Search and Bulk Actions */}
                            <div className="product-selection-header">
                                <div className="search-container">
                                    <input
                                        type="text"
                                        placeholder={t("Search products...")}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="form-input-field search-input"
                                    />
                                </div>
                                <div className="bulk-actions">
                                    <button
                                        type="button"
                                        onClick={handleSelectAll}
                                        className="btn btn-secondary btn-small"
                                        disabled={filteredProducts.length === 0}
                                    >
                                        {t("Select All")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeselectAll}
                                        className="btn btn-secondary btn-small"
                                        disabled={formData.selected_products.length === 0}
                                    >
                                        {t("Deselect All")}
                                    </button>
                                </div>
                            </div>

                            {/* Selection Summary */}
                            <div className="selection-summary">
                                {t("Selected")}: {formData.selected_products.length} {t("products")}
                            </div>

                            {/* Product Grid */}
                            <div className="product-selection-grid">
                                {filteredProducts.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">📦</div>
                                        <div className="empty-state-title">
                                            {searchTerm ? t("No products found") : t("No products available")}
                                        </div>
                                        <div className="empty-state-description">
                                            {searchTerm
                                                ? t("Try adjusting your search terms")
                                                : t("You need to add products before creating promotions")
                                            }
                                        </div>
                                        {!searchTerm && (
                                            <a href="/seller/products/create" className="btn btn-primary">
                                                {t("Add Product")}
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    filteredProducts.map(product => (
                                        <div
                                            key={product.product_id}
                                            className={`product-select-item ${formData.selected_products.includes(product.product_id) ? 'selected' : ''}`}
                                            onClick={() => handleProductToggle(product.product_id)}
                                        >
                                            <div className="product-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.selected_products.includes(product.product_id)}
                                                    onChange={() => {}} // Handled by onClick
                                                    readOnly
                                                />
                                            </div>
                                            <img
                                                src={product.images?.find(img => img.is_primary)?.image_url || '/default-product.png'}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                            <div className="product-info">
                                                <div className="product-name">{product.name}</div>
                                                <div className="product-price">
                                                    {product.variants?.[0]?.price?.toLocaleString()} VND
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {errors.selected_products && <div className="form-error">{errors.selected_products}</div>}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <a href="/seller/promotions" className="btn btn-secondary">
                                {t("Cancel")}
                            </a>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? t("Creating...") : t("Create Promotion")}
                            </button>
                        </div>
                    </form>

                    {/* Confirmation Dialog */}
                    {showConfirmDialog && (
                        <div className="modal-overlay" onClick={() => setShowConfirmDialog(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>{t("Confirm Create Promotion")}</h3>
                                </div>
                                <div className="modal-body">
                                    <div className="confirmation-details">
                                        <div className="detail-row">
                                            <span className="detail-label">{t("Promotion Name")}:</span>
                                            <span className="detail-value">{formData.name}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">{t("Discount Type")}:</span>
                                            <span className="detail-value">
                                                {formData.type === 'percentage' ? t("Percentage") : t("Fixed Amount Discount")}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">{t("Discount Value")}:</span>
                                            <span className="detail-value">
                                                {formData.value} {formData.type === 'percentage' ? '%' : 'VND'}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">{t("Budget")}:</span>
                                            <span className="detail-value">{parseFloat(formData.budget).toLocaleString()} VND</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">{t("Products Selected")}:</span>
                                            <span className="detail-value">{formData.selected_products.length}</span>
                                        </div>
                                    </div>
                                    <p className="confirmation-message">
                                        {t("Are you sure you want to create this promotion? This will deduct from your wallet balance.")}
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowConfirmDialog(false)}
                                    >
                                        {t("Cancel")}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleConfirmSubmit}
                                    >
                                        {t("Confirm Create")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </AppLayout>
    );
}
