import React, { useState } from 'react';
import type { PromotionRule } from './RuleBuilder';

interface RulePreviewProps {
    rules: PromotionRule[];
    promotionId?: number;
    disabled?: boolean;
}

interface PreviewResult {
    matched_products: number;
    products_preview: Array<{
        product_id: number;
        name: string;
        brand?: string | null;
        category?: string | null;
    }>;
}

function getCsrfToken(): string {
    const element = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
    return element?.content ?? '';
}

export default function RulePreview({ rules, promotionId, disabled = false }: RulePreviewProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PreviewResult | null>(null);

    const handlePreview = async () => {
        setError(null);
        setResult(null);

        if (disabled || !rules.length) {
            setError('Add at least one rule to preview matching products.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/admin/promotions/preview-matching', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    selection_rules: rules,
                    promotion_id: promotionId,
                }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                setError(payload?.message || 'Failed to preview selection rules.');
                return;
            }

            const payload: { success: boolean; matched_products?: number; products_preview?: PreviewResult['products_preview']; message?: string } =
                await response.json();

            if (!payload.success) {
                setError(payload.message || 'Failed to load preview data.');
                return;
            }

            setResult({
                matched_products: payload.matched_products ?? 0,
                products_preview: payload.products_preview ?? [],
            });
        } catch (exception) {
            setError(exception instanceof Error ? exception.message : 'Unexpected error while previewing rules.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button type="button" className="btn btn-primary" onClick={handlePreview} disabled={disabled || loading}>
                    {loading ? 'Checking…' : 'Preview Matching Products'}
                </button>
                {result && (
                    <span style={{ color: 'var(--dark)', fontWeight: 500 }}>
                        {result.matched_products} products match the current rules
                    </span>
                )}
            </div>

            {error && (
                <div style={{ color: 'var(--danger)', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            {result && result.products_preview.length > 0 && (
                <div
                    style={{
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '12px',
                        background: 'var(--light)',
                    }}
                >
                    <h5 style={{ margin: '0 0 8px 0', color: 'var(--dark)', fontSize: '14px' }}>Preview (first {result.products_preview.length})</h5>
                    <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--dark-grey)', fontSize: '14px' }}>
                        {result.products_preview.map((product) => (
                            <li key={`preview-${product.product_id}`}>
                                #{product.product_id} — {product.name}
                                {product.brand ? ` | Brand: ${product.brand}` : ''}
                                {product.category ? ` | Category: ${product.category}` : ''}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
