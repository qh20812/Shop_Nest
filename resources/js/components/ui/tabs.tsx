import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type TabItem = {
    value: string;
    label: React.ReactNode;
    icon?: LucideIcon;
    count?: number;
    disabled?: boolean;
};

type TabsProps = {
    items: TabItem[];
    value: string;
    onValueChange: (value: string) => void;
    variant?: 'underline' | 'pill' | 'filter';
    className?: string;
    ariaLabel?: string;
};

const containerClasses = {
    underline: 'flex items-center gap-6 overflow-x-auto border-b border-border',
    pill: 'flex items-center gap-1 overflow-x-auto rounded-control bg-raw-linen p-1',
    filter: 'flex items-center gap-2 overflow-x-auto',
};

const tabClasses = {
    underline:
        'border-b-2 border-transparent pb-3 -mb-px text-body-sm font-medium text-ink-muted transition-colors hover:text-ink focus-ring',
    pill: 'rounded-chip px-3 py-2 text-body-sm font-medium text-ink-muted transition-colors hover:text-ink focus-ring',
    filter:
        'rounded-chip border px-3.5 py-2 text-body-sm font-medium transition-colors focus-ring border-border bg-warm-porcelain text-ink-muted hover:border-ink-muted',
};

const activeClasses = {
    underline: 'border-lacquer-red text-lacquer-red',
    pill: 'bg-warm-porcelain text-lacquer-red',
    filter: 'border-lacquer-red bg-lacquer-wash text-lacquer-red',
};

export function Tabs({ items, value, onValueChange, variant = 'underline', className, ariaLabel }: TabsProps) {
    const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const focusTab = (index: number) => {
        const next = tabRefs.current[index];

        if (next) {
            next.focus();
            onValueChange(items[index].value);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
        const enabledIndexes = items.map((item, itemIndex) => (item.disabled ? -1 : itemIndex)).filter((itemIndex) => itemIndex >= 0);

        if (enabledIndexes.length === 0) {
            return;
        }

        const currentPosition = enabledIndexes.indexOf(index);
        let nextIndex: number | null = null;

        if (event.key === 'ArrowRight') {
            nextIndex = enabledIndexes[(currentPosition + 1) % enabledIndexes.length];
        }

        if (event.key === 'ArrowLeft') {
            nextIndex = enabledIndexes[(currentPosition - 1 + enabledIndexes.length) % enabledIndexes.length];
        }

        if (event.key === 'Home') {
            nextIndex = enabledIndexes[0];
        }

        if (event.key === 'End') {
            nextIndex = enabledIndexes[enabledIndexes.length - 1];
        }

        if (nextIndex !== null) {
            event.preventDefault();
            focusTab(nextIndex);
        }
    };

    return (
        <div role="tablist" aria-label={ariaLabel} className={cn(containerClasses[variant], className)}>
            {items.map((item, index) => {
                const active = item.value === value;
                const Icon = item.icon;

                return (
                    <button
                        key={item.value}
                        ref={(node) => {
                            tabRefs.current[index] = node;
                        }}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-disabled={item.disabled || undefined}
                        disabled={item.disabled}
                        tabIndex={active ? 0 : -1}
                        onClick={() => onValueChange(item.value)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        className={cn(
                            'inline-flex shrink-0 items-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50',
                            tabClasses[variant],
                            active && activeClasses[variant],
                        )}
                    >
                        {Icon && <Icon aria-hidden="true" className="size-4" />}
                        <span>{item.label}</span>
                        {typeof item.count === 'number' && (
                            <span
                                className={cn(
                                    'rounded-pill px-1.5 py-0.5 font-mono text-label-micro',
                                    active ? 'bg-lacquer-wash text-lacquer-deep' : 'bg-raw-linen text-ink-muted',
                                )}
                            >
                                {item.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export type { TabItem, TabsProps };
export default Tabs;
