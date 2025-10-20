import React from 'react';
import RuleBuilder, { type PromotionRule } from './RuleBuilder';
import RulePreview from './RulePreview';
import AutoApplyToggle from './AutoApplyToggle';
import InputError from '@/components/input-error';

interface ProductOption {
    product_id: number;
    name: string;
    sku?: string | null;
}

interface CategoryOption {
    category_id: number;
    name: string;
}

export interface PromotionFormData {
    name: string;
    description: string;
    type: string;
    value: number | string;
    minimum_order_value: number | string | null;
    max_discount_amount: number | string | null;
    starts_at: string;
    expires_at: string;
    usage_limit_per_user: number | string | null;
    is_active: boolean;
    product_ids: number[];
    category_ids: number[];
    selection_rules: PromotionRule[];
    auto_apply_new_products: boolean;
}

interface PromotionFormProps {
    data: PromotionFormData;
    setData: <Key extends keyof PromotionFormData>(field: Key, value: PromotionFormData[Key]) => void;
    errors: Record<string, string | undefined>;
    processing: boolean;
    products: ProductOption[];
    categories: CategoryOption[];
    ruleOptions: { types: string[]; operators: string[] };
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    selectionMode: 'manual' | 'rules';
    setSelectionMode: (mode: 'manual' | 'rules') => void;
    promotionId?: number;
    submitLabel: string;
}

export default function PromotionForm({
    data,
    setData,
    errors,
    processing,
    products,
    categories,
    ruleOptions,
    onSubmit,
    selectionMode,
    setSelectionMode,
    promotionId,
    submitLabel,
}: PromotionFormProps) {
    const handleSelectChange = (field: 'product_ids' | 'category_ids', event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(event.target.selectedOptions).map((option) => Number(option.value));
        setData(field, selected as never);
    };

    return (
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <section className="card">
                <h3 className="card-title">Promotion details</h3>
                <div className="card-body" style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                    <div className="form-control">
                        <label>Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div className="form-control">
                        <label>Type</label>
                        <select
                            value={data.type}
                            onChange={(event) => setData('type', event.target.value)}
                            required
                        >
                            <option value="percentage">Percentage Discount</option>
                            <option value="fixed_amount">Fixed Amount Discount</option>
                            <option value="free_shipping">Free Shipping</option>
                            <option value="buy_x_get_y">Buy X Get Y</option>
                        </select>
                        <InputError message={errors.type} />
                    </div>
                    <div className="form-control">
                        <label>Value</label>
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={Number(data.value)}
                            onChange={(event) => setData('value', Number(event.target.value))}
                            required
                        />
                        <InputError message={errors.value} />
                    </div>
                    <div className="form-control">
                        <label>Minimum order value</label>
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={data.minimum_order_value ?? ''}
                            onChange={(event) => setData('minimum_order_value', event.target.value)}
                        />
                        <InputError message={errors.minimum_order_value} />
                    </div>
                    <div className="form-control">
                        <label>Maximum discount amount</label>
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={data.max_discount_amount ?? ''}
                            onChange={(event) => setData('max_discount_amount', event.target.value)}
                        />
                        <InputError message={errors.max_discount_amount} />
                    </div>
                    <div className="form-control">
                        <label>Usage limit per customer</label>
                        <input
                            type="number"
                            min={0}
                            value={data.usage_limit_per_user ?? ''}
                            onChange={(event) => setData('usage_limit_per_user', event.target.value)}
                        />
                        <InputError message={errors.usage_limit_per_user} />
                    </div>
                    <div className="form-control">
                        <label>Start date</label>
                        <input
                            type="datetime-local"
                            value={data.starts_at}
                            onChange={(event) => setData('starts_at', event.target.value)}
                            required
                        />
                        <InputError message={errors.starts_at} />
                    </div>
                    <div className="form-control">
                        <label>End date</label>
                        <input
                            type="datetime-local"
                            value={data.expires_at}
                            onChange={(event) => setData('expires_at', event.target.value)}
                            required
                        />
                        <InputError message={errors.expires_at} />
                    </div>
                </div>
                <div className="form-control" style={{ marginTop: '12px' }}>
                    <label>Description</label>
                    <textarea
                        value={data.description}
                        onChange={(event) => setData('description', event.target.value)}
                        rows={3}
                    />
                    <InputError message={errors.description} />
                </div>
            </section>

            <section className="card">
                <h3 className="card-title">Targeting mode</h3>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="radio"
                                name="selection_mode"
                                value="manual"
                                checked={selectionMode === 'manual'}
                                onChange={() => setSelectionMode('manual')}
                            />
                            Manual selection
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="radio"
                                name="selection_mode"
                                value="rules"
                                checked={selectionMode === 'rules'}
                                onChange={() => setSelectionMode('rules')}
                            />
                            Rule-based selection
                        </label>
                    </div>

                    {selectionMode === 'manual' ? (
                        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                            <div className="form-control">
                                <label>Products</label>
                                <select multiple value={data.product_ids.map(String)} onChange={(event) => handleSelectChange('product_ids', event)}>
                                    {products.map((product: ProductOption) => (
                                        <option key={product.product_id} value={product.product_id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.product_ids} />
                            </div>
                            <div className="form-control">
                                <label>Categories</label>
                                <select multiple value={data.category_ids.map(String)} onChange={(event) => handleSelectChange('category_ids', event)}>
                                    {categories.map((category: CategoryOption) => (
                                        <option key={category.category_id} value={category.category_id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category_ids} />
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <RuleBuilder
                                value={data.selection_rules}
                                onChange={(rules) => setData('selection_rules', rules)}
                                ruleOptions={ruleOptions}
                                error={errors.selection_rules}
                            />
                            <RulePreview rules={data.selection_rules} promotionId={promotionId} />
                            <AutoApplyToggle
                                initialEnabled={data.auto_apply_new_products}
                                onChange={(next) => setData('auto_apply_new_products', next)}
                                promotionId={promotionId}
                            />
                        </div>
                    )}
                </div>
            </section>

            <section className="card">
                <h3 className="card-title">Status</h3>
                <div className="card-body">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(event) => setData('is_active', event.target.checked)}
                        />
                        Promotion is active
                    </label>
                </div>
            </section>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                    {processing ? 'Saving…' : submitLabel}
                </button>
            </div>
        </form>
    );
}
