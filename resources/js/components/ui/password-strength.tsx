import { Progress } from '@/components/ui/progress';
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
    if (!value) {
        return null;
    }

    const score = scorePassword(value);
    const label = labels[Math.max(0, score - 1)];
    const tone = score <= 1 ? 'danger' : score === 2 ? 'warning' : 'success';

    return (
        <div className={cx(className)} aria-live="polite">
            <Progress value={score} max={4} tone={tone} label={`Độ mạnh mật khẩu: ${label}`} />
        </div>
    );
}

export default PasswordStrength;
