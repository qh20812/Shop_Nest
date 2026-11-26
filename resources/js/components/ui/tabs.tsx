import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

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
    surface?: 'content' | 'glass';
    className?: string;
    ariaLabel?: string;
};

export function Tabs({ items, value, onValueChange, variant = 'underline', surface = 'content', className, ariaLabel }: TabsProps) {
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
        <div role="tablist" aria-label={ariaLabel} data-variant={variant} data-surface={surface} className={cx('sn-tabs', className)}>
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
                        data-variant={variant}
                        data-active={active ? 'true' : undefined}
                        onClick={() => onValueChange(item.value)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        className="sn-tab"
                    >
                        {Icon && <Icon aria-hidden="true" />}
                        <span>{item.label}</span>
                        {typeof item.count === 'number' && (
                            <span data-active={active ? 'true' : undefined} className="sn-tab__count">
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
