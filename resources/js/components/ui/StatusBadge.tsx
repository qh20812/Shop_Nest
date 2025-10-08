import React from 'react';
import { useTranslation } from '../../lib/i18n';

interface StatusBadgeProps {
    status: string | number;
    type?: 'order' | 'payment' | 'general';
}

export default function StatusBadge({ status, type = 'general' }: StatusBadgeProps) {
    const { t } = useTranslation();

    // Helper function to map status to CSS class names from Page.css
    const getStatusClass = (status: string | number, type: string) => {
        if (type === 'order') {
            // Handle both number and string status
            if (typeof status === 'number') {
                switch (status) {
                    case 0: return 'status pending';
                    case 1: return 'status process';
                    case 2: return 'status process';
                    case 3: return 'status completed';
                    case 4: return 'status pending';
                    default: return 'status pending';
                }
            } else {
                // Handle string status (enum format)
                switch (status) {
                    case 'pending_confirmation': return 'status pending';
                    case 'processing': return 'status process';
                    case 'pending_assignment': return 'status process';
                    case 'assigned_to_shipper': return 'status process';
                    case 'delivering': return 'status process';
                    case 'delivered': return 'status completed';
                    case 'completed': return 'status completed';
                    case 'cancelled': return 'status pending';
                    case 'returned': return 'status pending';
                    // Legacy support
                    case 'pending': return 'status pending';
                    case 'shipped': return 'status process';
                    default: return 'status pending';
                }
            }
        } else if (type === 'payment') {
            // Handle both number and string payment status
            if (typeof status === 'number') {
                switch (status) {
                    case 0: return 'status pending'; // Unpaid
                    case 1: return 'status completed'; // Paid
                    case 2: return 'status pending'; // Failed
                    case 3: return 'status process'; // Refunded
                    default: return 'status pending';
                }
            } else {
                switch (status) {
                    case 'paid': return 'status completed';
                    case 'unpaid':
                    case 'pending': return 'status pending';
                    case 'failed': return 'status pending';
                    case 'refunded': return 'status process';
                    default: return 'status pending';
                }
            }
        } else {
            // General status handling
            switch (status) {
                case 'approved':
                    return 'status completed';
                case 'pending':
                    return 'status pending';
                case 'suspended':
                    return 'status process';
                case 'rejected':
                    return 'status pending';
                case 'active':
                    return 'status completed';
                case 'inactive':
                    return 'status pending';
                case 'hidden':
                    return 'status process';
                default:
                    return 'status pending';
            }
        }
    };

    // Helper function to get translated status text
    const getStatusText = (status: string | number, type: string) => {
        if (type === 'order') {
            // Handle both number and string status
            if (typeof status === 'number') {
                switch (status) {
                    case 0: return t('Pending');
                    case 1: return t('Processing');
                    case 2: return t('Shipped');
                    case 3: return t('Delivered');
                    case 4: return t('Cancelled');
                    default: 
                        return t('Unknown');
                }
            } else {
                // Handle string status (enum format)
                switch (status) {
                    case 'pending_confirmation': return t('Pending Confirmation');
                    case 'processing': return t('Processing');
                    case 'pending_assignment': return t('Pending Assignment');
                    case 'assigned_to_shipper': return t('Assigned to Shipper');
                    case 'delivering': return t('Delivering');
                    case 'delivered': return t('Delivered');
                    case 'completed': return t('Completed');
                    case 'cancelled': return t('Cancelled');
                    case 'returned': return t('Returned');
                    // Legacy support
                    case 'pending': return t('Pending Confirmation');
                    case 'shipped': return t('Delivering');
                    default: 
                        console.warn(`Unknown order status: ${status}`);
                        return t('Unknown');
                }
            }
        } else if (type === 'payment') {
            // Handle both number and string payment status
            if (typeof status === 'number') {
                switch (status) {
                    case 0: return t('Unpaid');
                    case 1: return t('Paid');
                    case 2: return t('Failed');
                    case 3: return t('Refunded');
                    default: 
                        return t('Unknown');
                }
            } else {
                switch (status) {
                    case 'paid': return t('Paid');
                    case 'unpaid': return t('Unpaid');
                    case 'pending': return t('Pending');
                    case 'failed': return t('Failed');
                    case 'refunded': return t('Refunded');
                    default: 
                        return t('Unknown');
                }
            }
        } else {
            // General status
            switch (status) {
                case 'pending': return t('Pending');
                case 'approved': return t('Approved');
                case 'rejected': return t('Rejected');
                case 'suspended': return t('Suspended');
                case 'active': return t('Active');
                case 'inactive': return t('Inactive');
                case 'hidden': return t('Hidden');
                default: return String(status);
            }
        }
    };

    return (
        <span className={getStatusClass(status, type)}>
            {getStatusText(status, type)}
        </span>
    );
}
