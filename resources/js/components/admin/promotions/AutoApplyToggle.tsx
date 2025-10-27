import React, { useState } from 'react';

interface AutoApplyToggleProps {
    initialEnabled: boolean;
    promotionId?: number;
    onChange?: (enabled: boolean) => void;
    disabled?: boolean;
}

function getCsrfToken(): string {
    const element = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
    return element?.content ?? '';
}

export default function AutoApplyToggle({ initialEnabled, promotionId, onChange, disabled = false }: AutoApplyToggleProps) {
    const [enabled, setEnabled] = useState(initialEnabled);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggle = async () => {
        if (disabled) return;

        const next = !enabled;

        if (!promotionId) {
            setEnabled(next);
            onChange?.(next);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/admin/promotions/${promotionId}/auto-apply`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ enabled: next }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                setError(payload?.message || 'Unable to update auto-apply settings.');
                return;
            }

            setEnabled(next);
            onChange?.(next);
        } catch (exception) {
            setError(exception instanceof Error ? exception.message : 'Unexpected error while updating auto-apply flag.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: disabled ? 'not-allowed' : 'pointer' }}>
                <span style={{ color: 'var(--dark)', fontWeight: 500 }}>Auto apply to new products</span>
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={disabled || loading}
                    style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: enabled ? 'var(--primary)' : 'var(--border)',
                        position: 'relative',
                        transition: 'background 0.2s ease',
                    }}
                >
                    <span
                        style={{
                            position: 'absolute',
                            top: '3px',
                            left: enabled ? '22px' : '3px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: '#fff',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        }}
                    />
                </button>
                <span style={{ color: 'var(--dark-grey)', fontSize: '13px' }}>
                    {enabled ? 'Enabled' : 'Disabled'}
                </span>
            </label>
            {loading && <span style={{ fontSize: '12px', color: 'var(--dark-grey)' }}>Saving...</span>}
            {error && <span style={{ fontSize: '12px', color: 'var(--danger)' }}>{error}</span>}
        </div>
    );
}
