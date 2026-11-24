import { Download } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

export type ExportButtonVariant = 'primary' | 'secondary' | 'outline';

export interface ExportButtonProps {
    label: string;
    onClick: () => void;
    icon?: string;
    loading?: boolean;
    disabled?: boolean;
    variant?: ExportButtonVariant;
    className?: string;
}

const variantMap = {
    primary: 'primary',
    secondary: 'secondary',
    outline: 'outline',
} as const;

const ExportButton: React.FC<ExportButtonProps> = ({ label, onClick, loading = false, disabled = false, variant = 'primary', className }) => {
    return (
        <Button type="button" variant={variantMap[variant]} size="md" className={className} onClick={onClick} disabled={disabled} loading={loading}>
            {!loading && <Download aria-hidden="true" />}
            {label}
        </Button>
    );
};

export default ExportButton;
