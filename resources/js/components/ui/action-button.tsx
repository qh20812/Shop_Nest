import * as React from 'react';

import { renderIcon, type IconProp } from '@/lib/icon';

import { Button } from './button';

interface ActionButtonProps {
    variant: 'primary' | 'secondary' | 'danger';
    type?: 'button' | 'submit';
    onClick?: () => void;
    icon?: IconProp;
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    form?: string;
}

const VARIANTS = {
    primary: 'primary',
    secondary: 'secondary',
    danger: 'destructive',
} as const;

export default function ActionButton({ variant, type = 'button', onClick, icon, children, disabled = false, loading = false, form }: ActionButtonProps) {
    return (
        <Button type={type} onClick={onClick} disabled={disabled} loading={loading} variant={VARIANTS[variant]} form={form}>
            {!loading && renderIcon(icon)}
            {children}
        </Button>
    );
}
