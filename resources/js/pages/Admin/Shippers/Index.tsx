import React, { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "../../../layouts/app/AppLayout";
import FilterPanel from "@/Components/ui/FilterPanel";
import DataTable from "@/Components/ui/DataTable";
import Pagination from "@/Components/ui/Pagination";
import Toast from "@/Components/admin/users/Toast";
import ConfirmationModal from "@/Components/ui/ConfirmationModal";
import Avatar from '@/Components/ui/Avatar';
import ActionButtons, { ActionConfig } from '@/Components/ui/ActionButtons';
import StatusBadge from '@/Components/ui/StatusBadge';
import '@/../css/Page.css';
import { useTranslation } from '../../../lib/i18n';
interface ShipperProfile {
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    id_card_number: string;
    vehicle_type: string;
    license_plate: string;
}

interface Shipper {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone_number: string;
    is_active: boolean;
    shipper_profile: ShipperProfile;
}

interface PageProps {
    shippers: {
        data: Shipper[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    totalShippers: number;
    filters: {
        status?: string;
        search?: string;
    };
    statusOptions: Record<string, string>;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { t } = useTranslation();
    const { shippers, totalShippers = 0, filters, statusOptions, flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");

    // Toast state
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        shipperId: number | null;
        shipperName: string;
    }>({
        isOpen: false,
        shipperId: null,
        shipperName: "",
    });

    // When there's flash from backend, show toast
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: "success", message: flash.success });
        } else if (flash?.error) {
            setToast({ type: "error", message: flash.error });
        }
    }, [flash]);

    const applyFilters = () => {
        router.get("/admin/shippers", { search, status }, { preserveState: true });
    };

    const handleCloseModal = () => {
        setConfirmModal({
            isOpen: false,
            shipperId: null,
            shipperName: "",
        });
    };

    const handleCloseToast = () => {
        setToast(null);
    };

    // Helper function to get translated status text for filter options
    const getStatusText = (status: string) => {
        switch (status) {
            case 'approved':
                return t('Approved');
            case 'pending':
                return t('Pending');
            case 'suspended':
                return t('Suspended');
            case 'rejected':
                return t('Rejected');
            default:
                return t('Pending');
        }
    };

    // Define columns for DataTable
    const shipperColumns = [
        {
            header: "ID",
            cell: (shipper: Shipper) => `#${shipper.id}`
        },
        {
            header: t('Shipper'),
            cell: (shipper: Shipper) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Avatar user={shipper} />
                    <div>
                        <p style={{ fontWeight: "500", margin: 0 }}>
                            {(() => {
                                const fullName = `${shipper.first_name || ''} ${shipper.last_name || ''}`.trim();
                                return fullName || shipper.username || 'Unknown Shipper';
                            })()}
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--dark-grey)", margin: 0 }}>
                            {shipper.email}
                        </p>
                    </div>
                </div>
            )
        },
        {
            header: t('Contact'),
            cell: (shipper: Shipper) => shipper.phone_number || 'N/A'
        },
        {
            header: t('Vehicle'),
            cell: (shipper: Shipper) => (
                <div>
                    <div>{shipper.shipper_profile.vehicle_type}</div>
                    <div style={{ fontSize: "12px", color: "var(--dark-grey)" }}>
                        {shipper.shipper_profile.license_plate}
                    </div>
                </div>
            )
        },
        {
            header: t('Status'),
            cell: (shipper: Shipper) => (
                <StatusBadge status={shipper.shipper_profile.status} />
            )
        },
        {
            header: t('Actions'),
            cell: (shipper: Shipper) => {
                const actions: ActionConfig[] = [
                    {
                        type: 'link',
                        label: t('View Details'),
                        href: `/admin/shippers/${shipper.id}`,
                        icon: 'bx bx-show',
                        variant: 'primary'
                    }
                ];
                return <ActionButtons actions={actions} />;
            }
        }
    ];

    return (
        <AppLayout>
            <Head title={t('Shipper Management')} />
            
            <FilterPanel
                title={t('Shipper Management')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: "/admin/dashboard" },
                    { label: t('Shippers'), href: "/admin/shippers", active: true },
                ]}
                onApplyFilters={applyFilters}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t('Search by name, email, or phone...'),
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: t('-- All Statuses --'),
                        options: Object.entries(statusOptions).map(([value]) => ({
                            value,
                            label: getStatusText(value),
                        })),
                    },
                ]}
            />

            <DataTable
                columns={shipperColumns}
                data={shippers.data}
                headerTitle={`${t('Shipper List')} (${totalShippers})`}
                headerIcon="bx-user-pin"
                emptyMessage={t('No shippers found')}
            />

            <Pagination links={shippers.links} />

            {/* Toast Notification */}
            {toast && (
                <Toast 
                    type={toast.type} 
                    message={toast.message} 
                    onClose={handleCloseToast} 
                />
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={() => {}}
                title="Confirm Action"
                message={`Are you sure you want to perform this action on ${confirmModal.shipperName}?`}
            />
        </AppLayout>
    );
}