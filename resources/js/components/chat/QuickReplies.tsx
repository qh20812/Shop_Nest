import { cn } from '@/lib/utils';

type QuickReply = {
    id?: string;
    label: string;
    value?: string;
};

type QuickRepliesProps = {
    items: Array<QuickReply | string>;
    onSelect: (value: string) => void;
    disabled?: boolean;
    className?: string;
};

export function QuickReplies({ items, onSelect, disabled = false, className }: QuickRepliesProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className={cn('flex flex-wrap gap-2', className)} aria-label="Gợi ý câu hỏi">
            {items.map((item) => {
                const label = typeof item === 'string' ? item : item.label;
                const value = typeof item === 'string' ? item : (item.value ?? item.label);

                return (
                    <button
                        key={typeof item === 'string' ? item : (item.id ?? item.label)}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSelect(value)}
                        className="focus-ring inline-flex min-h-control-sm items-center rounded-pill border border-border bg-warm-porcelain px-3.5 py-1.5 text-body-sm text-ink transition-colors hover:border-lacquer-red hover:text-lacquer-red disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

export type { QuickRepliesProps, QuickReply };
export default QuickReplies;
