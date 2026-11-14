import { cn } from '@/lib/utils';

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
    const tone = score <= 1 ? 'bg-brick' : score === 2 ? 'bg-turmeric' : 'bg-jade';

    return (
        <div className={cn('flex flex-col gap-1.5', className)} aria-live="polite">
            <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                    <span
                        key={step}
                        className={cn('h-1.5 flex-1 rounded-pill transition-colors duration-150', step <= score ? tone : 'bg-raw-linen')}
                    />
                ))}
            </div>
            {value && <span className="text-body-sm text-ink-muted">Độ mạnh mật khẩu: {label}</span>}
        </div>
    );
}

export default PasswordStrength;
