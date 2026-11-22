import { cx } from '@/lib/cx';

type ProgressTone = 'accent' | 'success' | 'warning' | 'danger' | 'ink';

type ProgressProps = {
    value: number;
    max?: number;
    tone?: ProgressTone;
    label?: string;
    showValue?: boolean;
    className?: string;
};

export function Progress({ value, max = 100, tone = 'accent', label, showValue = false, className }: ProgressProps) {
    const safeMax = max > 0 ? max : 100;
    const safeValue = Math.min(Math.max(value, 0), safeMax);
    const percentage = Math.round((safeValue / safeMax) * 100);

    return (
        <div data-slot="progress" className={cx('sn-progress', className)}>
            {(label || showValue) && (
                <div className="sn-progress__head">
                    {label && <span className="sn-progress__label">{label}</span>}
                    {showValue && <span className="sn-progress__value">{percentage}%</span>}
                </div>
            )}
            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={safeMax}
                aria-valuenow={safeValue}
                aria-label={label}
                className="sn-progress__track"
            >
                <div data-tone={tone} className="sn-progress__bar" style={{ transform: `scaleX(${percentage / 100})` }} />
            </div>
        </div>
    );
}

export default Progress;
export type { ProgressProps, ProgressTone };
