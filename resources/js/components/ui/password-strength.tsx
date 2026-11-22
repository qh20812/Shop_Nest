import { cx } from '@/lib/cx';

type PasswordStrengthProps = {
    value: string;
    className?: string;
};

const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh'] as const;

function scorePassword(value: string): number {
    if (!value) {
        return 0;
    }

    let score = 0;

    if (value.length >= 8) score += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^a-zA-Z0-9]/.test(value)) score += 1;

    return Math.min(score, 4);
}

export function PasswordStrength({ value, className }: PasswordStrengthProps) {
    const score = scorePassword(value);
    const label = labels[Math.max(0, score - 1)];
    const tone = score <= 1 ? 'danger' : score === 2 ? 'warning' : 'success';

    return (
        <div className={cx('sn-password', className)} aria-live="polite">
            <div className="sn-password__bars">
                {[1, 2, 3, 4].map((step) => (
                    <span key={step} className="sn-password__bar" data-active={step <= score ? 'true' : undefined} data-tone={tone} />
                ))}
            </div>
            {value && <span className="sn-password__label">Độ mạnh mật khẩu: {label}</span>}
        </div>
    );
}

export default PasswordStrength;
