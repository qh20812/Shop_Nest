import { useTranslation } from '@/lib/i18n';
import { Minus, Plus } from 'lucide-react';

import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type QuantityStepperProps = {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (value: number) => void;
    size?: 'sm' | 'md';
    disabled?: boolean;
    className?: string;
};

export function QuantityStepper({ value, min = 1, max = 99, step = 1, onChange, size = 'md', disabled = false, className }: QuantityStepperProps) {
    const { t } = useTranslation();
    const canDecrease = !disabled && value > min;
    const canIncrease = !disabled && value < max;

    const update = (next: number) => onChange(Math.min(Math.max(next, min), max));

    return (
        <div
            role="group"
            aria-label={t('Quantity')}
            className={cx(styles.quantityRoot, className)}
            data-size={size}
            data-disabled={disabled ? 'true' : undefined}
        >
            <button
                type="button"
                aria-label={t('Decrease quantity')}
                disabled={!canDecrease}
                className={styles.quantityButton}
                onClick={() => update(value - step)}
            >
                <Minus aria-hidden="true" className={styles.icon} />
            </button>
            <input
                type="text"
                readOnly
                value={value}
                aria-label={t('Current quantity')}
                inputMode="numeric"
                autoComplete="off"
                className={styles.quantityInput}
            />
            <button
                type="button"
                aria-label={t('Increase quantity')}
                disabled={!canIncrease}
                className={styles.quantityButton}
                onClick={() => update(value + step)}
            >
                <Plus aria-hidden="true" className={styles.icon} />
            </button>
        </div>
    );
}

export default QuantityStepper;
