import { cn } from '@/lib/utils';

type TypingIndicatorProps = {
    label?: string;
    className?: string;
};

export function TypingIndicator({ label = 'Đang soạn tin', className }: TypingIndicatorProps) {
    return (
        <div className={cn('flex items-center gap-2 text-body-sm text-ink-muted', className)} aria-live="polite">
            <span className="flex items-center gap-1 rounded-surface border border-border bg-rice-paper px-3 py-2" aria-hidden="true">
                {[0, 1, 2].map((index) => (
                    <span
                        key={index}
                        className="size-1.5 animate-bounce rounded-pill bg-ink-faint"
                        style={{ animationDelay: `${index * 120}ms`, animationDuration: '900ms' }}
                    />
                ))}
            </span>
            <span>{label}</span>
        </div>
    );
}

export type { TypingIndicatorProps };
export default TypingIndicator;
