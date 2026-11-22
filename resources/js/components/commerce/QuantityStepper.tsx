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
    const canDecrease = !disabled && value > min;
    const canIncrease = !disabled && value < max;

    const update = (next: number) => onChange(Math.min(Math.max(next, min), max));

    return (
        <div
            role="group"
            aria-label="Số lượng"
            className={cx(styles.quantityRoot, className)}
            data-size={size}
            data-disabled={disabled ? 'true' : undefined}
        >
            <button
                type="button"
                aria-label="Giảm số lượng"
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
                aria-label="Số lượng hiện tại"
                inputMode="numeric"
                autoComplete="off"
                className={styles.quantityInput}
            />
            <button
                type="button"
                aria-label="Tăng số lượng"
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
