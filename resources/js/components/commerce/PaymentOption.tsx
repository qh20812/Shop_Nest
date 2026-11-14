import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { RadioCard } from '@/components/ui/radio-card';
import { cn } from '@/lib/utils';

import { PaymentMarks, type PaymentMethod } from './PaymentMarks';

type PaymentOptionProps = {
    name?: string;
    value: string;
    selected: boolean;
    title: string;
    description?: string;
    icon?: LucideIcon;
    marks?: PaymentMethod[];
    disabled?: boolean;
    onChange: (value: string) => void;
    children?: React.ReactNode;
    className?: string;
};

export function PaymentOption({
    name = 'payment_method',
    value,
    selected,
    title,
    description,
    icon: Icon,
    marks,
    disabled,
    onChange,
    children,
    className,
}: PaymentOptionProps) {
    return (
        <RadioCard
            name={name}
            value={value}
            checked={selected}
            disabled={disabled}
            onChange={() => onChange(value)}
            title={
                <span className="inline-flex items-center gap-2">
                    {Icon && <Icon aria-hidden="true" className="size-4 text-ink-muted" />}
                    {title}
                </span>
            }
            description={description}
            meta={marks && marks.length > 0 ? <PaymentMarks methods={marks} /> : undefined}
            className={cn(className)}
        >
            {children}
        </RadioCard>
    );
}

export type { PaymentOptionProps };
export default PaymentOption;
