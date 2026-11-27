import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { RadioCard } from '@/components/ui/radio-card';
import { cx } from '@/lib/cx';

import { PaymentMarks, type PaymentMethod } from './PaymentMarks';
import styles from './commerce.module.css';

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
                <span className={styles.refundTitle}>
                    {Icon ? <Icon aria-hidden="true" className={styles.refundIcon} /> : null}
                    {title}
                </span>
            }
            description={description}
            className={cx(className)}
        >
            {marks && marks.length > 0 ? (
                <span className={styles.paymentMarksRow}>
                    <PaymentMarks methods={marks} />
                </span>
            ) : null}
            {children}
        </RadioCard>
    );
}

export type { PaymentOptionProps };
export default PaymentOption;
