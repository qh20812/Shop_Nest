import { Minus, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';

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

    const buttonClasses = cn(
        'focus-ring flex items-center justify-center text-ink transition-colors hover:bg-raw-linen disabled:cursor-not-allowed disabled:text-ink-faint',
        size === 'sm' ? 'size-control-sm' : 'size-control-md',
    );

    return (
        <div
            role="group"
            aria-label="Số lượng"
            className={cn(
                'inline-flex items-center overflow-hidden rounded-control border border-border bg-warm-porcelain',
                disabled && 'opacity-50',
                className,
            )}
        >
            <button type="button" aria-label="Giảm số lượng" disabled={!canDecrease} className={buttonClasses} onClick={() => update(value - step)}>
                <Minus aria-hidden="true" className="size-4" />
            </button>
            <input
                type="text"
                readOnly
                value={value}
                aria-label="Số lượng hiện tại"
                className={cn(
                    'h-full border-x border-border bg-transparent text-center font-mono text-label-code text-ink focus:outline-none',
                    size === 'sm' ? 'w-9' : 'w-12',
                )}
            />
            <button type="button" aria-label="Tăng số lượng" disabled={!canIncrease} className={buttonClasses} onClick={() => update(value + step)}>
                <Plus aria-hidden="true" className="size-4" />
            </button>
        </div>
    );
}

export default QuantityStepper;
