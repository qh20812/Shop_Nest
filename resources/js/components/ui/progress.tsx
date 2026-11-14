import { cn } from '@/lib/utils';

type ProgressTone = 'accent' | 'success' | 'warning' | 'danger' | 'ink';

type ProgressProps = {
    value: number;
    max?: number;
    tone?: ProgressTone;
    label?: string;
    showValue?: boolean;
    className?: string;
};

const toneClasses: Record<ProgressTone, string> = {
    accent: 'bg-lacquer-red',
    success: 'bg-jade',
    warning: 'bg-turmeric',
    danger: 'bg-brick',
    ink: 'bg-ink',
};

export function Progress({ value, max = 100, tone = 'accent', label, showValue = false, className }: ProgressProps) {
    const safeMax = max > 0 ? max : 100;
    const safeValue = Math.min(Math.max(value, 0), safeMax);
    const percentage = Math.round((safeValue / safeMax) * 100);

    return (
        <div className={cn('flex w-full flex-col gap-1.5', className)}>
            {(label || showValue) && (
                <div className="flex items-center justify-between gap-3">
                    {label && <span className="text-body-sm text-ink-muted">{label}</span>}
                    {showValue && <span className="font-mono text-label-code text-ink">{percentage}%</span>}
                </div>
            )}
            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={safeMax}
                aria-valuenow={safeValue}
                aria-label={label}
                className="h-2 w-full overflow-hidden rounded-pill bg-raw-linen"
            >
                <div
                    className={cn('h-full w-full origin-left rounded-pill transition-transform duration-300 ease-nep', toneClasses[tone])}
                    style={{ transform: `scaleX(${percentage / 100})` }}
                />
            </div>
        </div>
    );
}

export default Progress;
