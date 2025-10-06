import React, { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "../../../layouts/app/AppLayout";
import FilterPanel from "@/components/ui/FilterPanel";
import DataTable from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import Toast from "@/components/admin/users/Toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import ActionButtons, { ActionConfig } from '@/components/ui/ActionButtons';
import StatusBadge from '@/components/ui/StatusBadge';
import '@/../css/Page.css';
import { useTranslation } from '../../../lib/i18n';

interface Brand {
    brand_id: number;
    name: string;
    description?: string;
    logo_url?: string;
    is_active: boolean;
    deleted_at: string | null;
    products_count: number;
    created_at: string;
}

interface PageProps {
    brands: {
        data: Brand[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; status?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { t } = useTranslation();
    const { brands = { data: [], links: [] }, filters = {}, flash = {} } = usePage<PageProps>().props;

    // Helper function to convert HTML to plain text
    const htmlToPlainText = (html: string): string => {
        if (!html) return '';
        // Replace <br>, <p>, <li> with newline
        let text = html.replace(/<\/?(br|p|li)>/gi, '\n');
        // Remove all other HTML tags
        text = text.replace(/<[^>]+>/g, '');
        // Replace multiple newlines with single
        text = text.replace(/\n{2,}/g, '\n');
        // Decode HTML entities
        text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        return text.trim();
    };

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    // Toast state
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        brandId: number | null;
        brandName: string;
        action: 'deactivate' | 'restore' | null;
        title: string;
        message: string;
    }>({
        isOpen: false,
        brandId: null,
        brandName: "",
        action: null,
        title: "",
        message: "",
    });

    // Listen for flash messages from backend
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: "success", message: flash.success });
        } else if (flash?.error) {
            setToast({ type: "error", message: flash.error });
        }
    }, [flash]);

    // Auto-apply search filter on typing (debounced)
    useEffect(() => {
        const delayTimer = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/admin/brands', {
                    search: search || undefined,
                    status: status || undefined
                }, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        }, 500);

        return () => clearTimeout(delayTimer);
    }, [search, filters.search, status]);

    const applyFilters = () => {
        router.get('/admin/brands', { search, status }, { preserveState: true });
    };

    const handleDeactivate = (brand: Brand) => {
        setConfirmModal({
            isOpen: true,
            brandId: brand.brand_id,
            brandName: brand.name,
            action: 'deactivate',
            title: t("Confirm Deactivate Brand"),
            message: `${t("Are you sure you want to deactivate brand")} "${brand.name}"? ${t("This will make it inactive but can be restored later.")}`
        });
    };

    const handleRestore = (brand: Brand) => {
        setConfirmModal({
            isOpen: true,
            brandId: brand.brand_id,
            brandName: brand.name,
            action: 'restore',
            title: t("Confirm Restore Brand"),
            message: `${t("Are you sure you want to restore brand")} "${brand.name}"? ${t("This will make it active again.")}`
        });
    };

    const handleConfirmAction = () => {
        if (!confirmModal.brandId || !confirmModal.action) return;

        switch (confirmModal.action) {
            case 'deactivate':
                router.delete(`/admin/brands/${confirmModal.brandId}`);
                break;
            case 'restore':
                router.patch(`/admin/brands/${confirmModal.brandId}/restore`);
                break;
        }
    };

    const handleCloseModal = () => {
        setConfirmModal({
            isOpen: false,
            brandId: null,
            brandName: "",
            action: null,
            title: "",
            message: "",
        });
    };

    const handleCloseToast = () => {
        setToast(null);
    };

    // Define columns for DataTable
    const brandColumns = [
        {
            header: "ID",
            cell: (brand: Brand) => `#${brand.brand_id}`
        },
        {
            header: t("Brand"),
            cell: (brand: Brand) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {brand.logo_url ? (
                        <img
                            src={`/storage/${brand.logo_url}`}
                            alt={brand.name}
                            style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "contain",
                                borderRadius: "4px",
                                border: "1px solid var(--grey)"
                            }}
                        />
                    ) : (
                        <div style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "var(--grey)",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            color: "var(--dark-grey)"
                        }}>
                            {brand.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <div style={{ fontWeight: "500", color: "var(--dark)" }}>
                            {brand.name}
                        </div>
                        {brand.description && (
                            <div style={{ 
                                fontSize: "12px", 
                                color: "var(--dark-grey)", 
                                whiteSpace: "pre-line",
                                maxWidth: "300px",
                                lineHeight: "1.4"
                            }}>
                                {(() => {
                                    const plainText = htmlToPlainText(brand.description);
                                    return plainText.length > 50 ? `${plainText.substring(0, 50)}...` : plainText;
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: t("Products"),
            cell: (brand: Brand) => (
                <span style={{ 
                    padding: "4px 8px", 
                    background: "var(--light-primary)", 
                    color: "var(--primary)", 
                    borderRadius: "12px", 
                    fontSize: "12px",
                    fontWeight: "500"
                }}>
                    {brand.products_count} {t("Products")}
                </span>
            )
        },
        {
            header: t("Status"),
            cell: (brand: Brand) => (
                <StatusBadge status={brand.deleted_at ? 'inactive' : 'active'} />
            )
        },
        {
            header: t("Actions"),
            cell: (brand: Brand) => {
                const actions: ActionConfig[] = [];
                
                if (!brand.deleted_at) {
                    // Active brand - show Edit and Deactivate
                    actions.push(
                        {
                            type: 'link',
                            href: `/admin/brands/${brand.brand_id}/edit`,
                            variant: 'primary',
                            icon: 'bx bx-edit',
                            label: t('Edit')
                        },
                        {
                            type: 'button',
                            onClick: () => handleDeactivate(brand),
                            variant: 'danger',
                            icon: 'bx bx-hide',
                            label: t('Deactivate')
                        }
                    );
                } else {
                    // Inactive brand - show Restore
                    actions.push({
                        type: 'button',
                        onClick: () => handleRestore(brand),
                        variant: 'primary',
                        icon: 'bx bx-revision',
                        label: t('Restore')
                    });
                }
                
                return <ActionButtons actions={actions} />;
            }
        }
    ];

    return (
        <AppLayout>
            <Head title={t("Brand Management")} />
            
            {/* Toast notification */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={handleCloseToast}
                />
            )}

            {/* Header và Bộ lọc */}
            <FilterPanel
                title={t("Brand Management")}
                breadcrumbs={[
                    { label: t("Dashboard"), href: "/admin/dashboard" },
                    { label: t("Brands"), href: "/admin/brands", active: true }
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t("Search by brand name...")
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: t("-- All Brands --"),
                        options: [
                            { value: "", label: t("Active Brands") },
                            { value: "inactive", label: t("Inactive Brands") }
                        ]
                    }
                ]}
                buttonConfigs={[
                    {
                        href: "/admin/brands/create",
                        label: t("Create Brand"),
                        icon: "bx-plus",
                        color: "success"
                    }
                ]}
                onApplyFilters={applyFilters}
            />

            {/* Bảng dữ liệu */}
            <DataTable
                columns={brandColumns}
                data={brands.data}
                headerTitle={t("Brand List")}
                headerIcon="bx-store"
                emptyMessage={t("No brands found")}
            />

            {/* Phân trang */}
            <Pagination links={brands.links} />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </AppLayout>
    );
}
