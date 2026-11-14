import type { LucideIcon } from 'lucide-react';

import { RadioCard } from '@/components/ui/radio-card';
import { cn } from '@/lib/utils';

type RefundOptionItem = {
    value: string;
    title: string;
    description?: string;
    icon?: LucideIcon;
    disabled?: boolean;
};

type RefundOptionProps = {
    options: RefundOptionItem[];
    value: string;
    onChange: (value: string) => void;
    name?: string;
    className?: string;
};

export function RefundOption({ options, value, onChange, name = 'refund_method', className }: RefundOptionProps) {
    return (
        <div className={cn('flex flex-col gap-3', className)} role="radiogroup" aria-label="Hình thức hoàn tiền">
            {options.map((option) => {
                const Icon = option.icon;

                return (
                    <RadioCard
                        key={option.value}
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        disabled={option.disabled}
                        onChange={() => onChange(option.value)}
                        title={
                            <span className="inline-flex items-center gap-2">
                                {Icon && <Icon aria-hidden="true" className="size-4 text-ink-muted" />}
                                {option.title}
                            </span>
                        }
                        description={option.description}
                    />
                );
            })}
        </div>
    );
}

export type { RefundOptionItem, RefundOptionProps };
export default RefundOption;
