import { useTranslation } from '@/lib/i18n';
import { Tag, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type PromoFieldProps = {
    value: string;
    onChange: (value: string) => void;
    onApply: () => void;
    onRemove?: () => void;
    appliedCode?: string | null;
    appliedLabel?: string;
    error?: string | null;
    loading?: boolean;
    className?: string;
};

export function PromoField({ value, onChange, onApply, onRemove, appliedCode, appliedLabel, error, loading = false, className }: PromoFieldProps) {
    const { t } = useTranslation();
    return (
        <div className={cx(styles.promo, className)}>
            <label htmlFor="promo-code" className={styles.promoLabel}>
                {t('Promotions and discount codes')}
            </label>

            {appliedCode ? (
                <div className={styles.promoApplied}>
                    <div className={styles.promoAppliedMain}>
                        <Tag aria-hidden="true" className={styles.promoIcon} />
                        <span className={styles.promoCode}>{appliedCode}</span>
                        {appliedLabel ? <span className={styles.promoLabelText}>{appliedLabel}</span> : null}
                    </div>
                    {onRemove ? (
                        <button type="button" aria-label={t('Remove discount code')} className={styles.promoRemove} onClick={onRemove}>
                            <X aria-hidden="true" className={styles.promoIcon} />
                        </button>
                    ) : null}
                </div>
            ) : (
                <div className={styles.promoRow}>
                    <Input
                        id="promo-code"
                        value={value}
                        onChange={(event) => onChange(event.target.value.toUpperCase())}
                        placeholder={t('Enter a promotion code')}
                        className={cx(styles.promoInput)}
                        invalid={Boolean(error)}
                    />
                    <Button type="button" variant="secondary" loading={loading} onClick={onApply}>
                        {t('Apply')}
                    </Button>
                </div>
            )}

            {error ? (
                <span role="alert" className={styles.promoError}>
                    {error}
                </span>
            ) : null}
        </div>
    );
}

export type { PromoFieldProps };
export default PromoField;
