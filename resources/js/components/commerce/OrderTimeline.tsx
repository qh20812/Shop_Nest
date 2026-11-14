import { Check, Circle, X } from 'lucide-react';

import { cn } from '@/lib/utils';

type TimelineStep = {
    key: string;
    label: string;
    description?: string;
    timestamp?: string;
};

type OrderTimelineProps = {
    steps: TimelineStep[];
    current: number;
    tone?: 'default' | 'cancelled' | 'returned';
    className?: string;
};

const toneConfig = {
    default: {
        active: 'border-lacquer-red bg-lacquer-red text-warm-porcelain',
        done: 'border-jade bg-jade-soft text-jade',
        pending: 'border-border bg-warm-porcelain text-ink-faint',
        line: 'bg-border',
        label: 'text-ink',
    },
    cancelled: {
        active: 'border-brick bg-brick-soft text-brick',
        done: 'border-border bg-raw-linen text-ink-muted',
        pending: 'border-border bg-warm-porcelain text-ink-faint',
        line: 'bg-border',
        label: 'text-ink-muted',
    },
    returned: {
        active: 'border-turmeric bg-turmeric-soft text-turmeric',
        done: 'border-border bg-raw-linen text-ink-muted',
        pending: 'border-border bg-warm-porcelain text-ink-faint',
        line: 'bg-border',
        label: 'text-ink-muted',
    },
};

export function OrderTimeline({ steps, current, tone = 'default', className }: OrderTimelineProps) {
    const config = toneConfig[tone];
    const isTerminal = tone !== 'default';

    return (
        <ol className={cn('flex flex-col', className)} aria-label="Tiến trình đơn hàng">
            {steps.map((step, index) => {
                const done = index < current;
                const active = index === current;
                const state = done ? 'done' : active ? 'active' : 'pending';
                const isLast = index === steps.length - 1;

                return (
                    <li key={step.key} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <span
                                className={cn(
                                    'flex size-7 shrink-0 items-center justify-center rounded-pill border font-mono text-label-micro',
                                    config[state],
                                )}
                                aria-hidden="true"
                            >
                                {done ? (
                                    <Check className="size-3.5" />
                                ) : active ? (
                                    isTerminal ? (
                                        <X className="size-3.5" />
                                    ) : (
                                        <Circle className="size-2.5 fill-current" />
                                    )
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </span>
                            {!isLast && <span className={cn('my-1 w-px flex-1', config.line)} aria-hidden="true" />}
                        </div>
                        <div className={cn('min-w-0 flex-1', isLast ? 'pb-0' : 'pb-5')}>
                            <span className={cn('block text-body-sm font-semibold', active ? config.label : 'text-ink')}>{step.label}</span>
                            {step.description && <span className="mt-0.5 block text-body-sm text-ink-muted">{step.description}</span>}
                            {step.timestamp && <span className="mt-0.5 block font-mono text-label-micro text-ink-faint">{step.timestamp}</span>}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

export type { OrderTimelineProps, TimelineStep };
export default OrderTimeline;
