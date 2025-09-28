import React from 'react';
import { useTranslation } from '../../lib/i18n';

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const { t } = useTranslation();

    // Helper function to map status to CSS class names from Page.css
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'approved':
                return 'status completed';
            case 'pending':
                return 'status pending';
            case 'suspended':
                return 'status process';
            case 'rejected':
                return 'status pending'; // Using pending style for rejected
            case 'active':
                return 'status completed';
            case 'hidden':
                return 'status process';
            default:
                return 'status pending';
        }
    };

    // Helper function to get translated status text
    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return t('Pending');
            case 'approved': return t('Approved');
            case 'rejected': return t('Rejected');
            case 'suspended': return t('Suspended');
            case 'active': return t('Active');
            case 'hidden': return t('Hidden');
            default: return status;
        }
    };

    return (
        <span className={getStatusClass(status)}>
            {getStatusText(status)}
        </span>
    );
}
