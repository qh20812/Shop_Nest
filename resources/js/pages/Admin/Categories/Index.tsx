import { router, usePage, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppLayout from '../../../layouts/app/AppLayout';
import FilterPanel from '../../../Components/ui/FilterPanel';
import DataTable from '../../../Components/ui/DataTable';
import Pagination from '../../../Components/ui/Pagination';
import Toast from '../../../Components/admin/users/Toast';
import ConfirmationModal from '../../../Components/ui/ConfirmationModal';
import ActionButtons, { type ActionConfig } from '../../../Components/ui/ActionButtons';
import StatusBadge from '../../../Components/ui/StatusBadge';
import { useTranslation } from '../../../lib/i18n';
import { htmlToPlainText } from '../../../utils/htmlUtils';

interface Category {
    category_id: number;
    name: { en: string; vi: string };
    description?: { en?: string; vi?: string } | null;
    parent_category_id?: number | null;
    is_active: boolean;
    created_at: string;
    deleted_at?: string | null;
    image_url?: string | null;
}

interface PageProps {
    categories: {
        data: Category[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    totalCategories: number;
    filters: { search?: string; status?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { t, locale } = useTranslation();
    const { categories = { data: [], links: [] }, totalCategories = 0, filters = {}, flash = {} } = usePage<PageProps>().props;



    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    // Toast state
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        categoryId: number | null;
        categoryName: string;
        action: 'hide' | 'restore' | 'forceDelete' | null;
        title: string;
        message: string;
    }>({
        isOpen: false,
        categoryId: null,
        categoryName: "",
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
    const applyFilters = () => {
        router.get('/admin/categories', { search, status }, { preserveState: true });
    };

    const getCategoryName = (category: Category): string => {
        return category.name[locale as keyof typeof category.name] || category.name['en'] || 'Unnamed Category';
    };

    const handleHide = (category: Category) => {
        const categoryName = getCategoryName(category);
        setConfirmModal({
            isOpen: true,
            categoryId: category.category_id,
            categoryName,
            action: 'hide',
            title: t("Confirm Hide Category"),
            message: `${t("Are you sure you want to hide category")} "${categoryName}"? ${t("This will make it invisible to users but can be restored later.")}`
        });
    };

    const handleRestore = (category: Category) => {
        const categoryName = getCategoryName(category);
        setConfirmModal({
            isOpen: true,
            categoryId: category.category_id,
            categoryName,
            action: 'restore',
            title: t("Confirm Restore Category"),
            message: `${t("Are you sure you want to restore category")} "${categoryName}"? ${t("This will make it visible to users again.")}`
        });
    };

    const handleForceDelete = (category: Category) => {
        const categoryName = getCategoryName(category);
        setConfirmModal({
            isOpen: true,
            categoryId: category.category_id,
            categoryName,
            action: 'forceDelete',
            title: t("Confirm Permanent Deletion"),
            message: `${t("Are you sure you want to permanently delete category")} "${categoryName}"? ${t("This action cannot be undone!")}`
        });
    };

    const handleConfirmAction = () => {
        if (!confirmModal.categoryId || !confirmModal.action) return;

        switch (confirmModal.action) {
            case 'hide':
                router.delete(`/admin/categories/${confirmModal.categoryId}`);
                break;
            case 'restore':
                router.patch(`/admin/categories/${confirmModal.categoryId}/restore`);
                break;
            case 'forceDelete':
                router.delete(`/admin/categories/${confirmModal.categoryId}/force-delete`);
                break;
        }
    };

    const handleCloseModal = () => {
        setConfirmModal({
            isOpen: false,
            categoryId: null,
            categoryName: "",
            action: null,
            title: "",
            message: "",
        });
    };

    const handleCloseToast = () => {
        setToast(null);
    };

    // Define columns for DataTable
    const categoryColumns = [
        {
            header: "ID",
            cell: (category: Category) => `#${category.category_id}`
        },
        {
            header: t("Category Name"),
            cell: (category: Category) => {
                const categoryName = category.name[locale as keyof typeof category.name] || category.name['en'];
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                            src={category.image_url || `https://via.placeholder.com/40?text=${categoryName.charAt(0)}`} 
                            alt={categoryName} 
                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} 
                        />
                        <span>{categoryName}</span>
                    </div>
                );
            }
        },
        {
            header: t("Description"), 
            cell: (category: Category) => {
                const description = category.description?.[locale as keyof typeof category.description] || category.description?.['en'];
                if (!description) return t('No description');
                
                const plainText = htmlToPlainText(description);
                const truncated = plainText.length > 50 ? `${plainText.substring(0, 50)}...` : plainText;
                
                return (
                    <div style={{ 
                        whiteSpace: "pre-line",
                        maxWidth: "300px",
                        lineHeight: "1.4",
                        fontSize: "14px"
                    }}>
                        {truncated}
                    </div>
                );
            }
        },
        {
            header: t("Status"),
            cell: (category: Category) => (
                <StatusBadge status={category.deleted_at ? 'hidden' : (category.is_active ? 'active' : 'inactive')} />
            )
        },
        {
            header: t("Created Date"),
            accessorKey: "created_at" as keyof Category
        },
        {
            header: t("Actions"),
            cell: (category: Category) => {
                const actions: ActionConfig[] = [];
                
                if (category.deleted_at) {
                    // Category is hidden - show Restore and Delete Permanently
                    actions.push(
                        {
                            type: 'button',
                            onClick: () => handleRestore(category),
                            variant: 'primary',
                            icon: 'bx bx-refresh',
                            label: t('Restore')
                        },
                        {
                            type: 'button',
                            onClick: () => handleForceDelete(category),
                            variant: 'danger',
                            icon: 'bx bx-trash',
                            label: t('Delete Permanently')
                        }
                    );
                } else {
                    // Category is active - show Edit and Hide
                    actions.push(
                        {
                            type: 'link',
                            href: `/admin/categories/${category.category_id}/edit`,
                            variant: 'primary',
                            icon: 'bx bx-edit',
                            label: t('Edit')
                        },
                        {
                            type: 'button',
                            onClick: () => handleHide(category),
                            variant: 'danger',
                            icon: 'bx bx-hide',
                            label: t('Hide')
                        }
                    );
                }
                
                return <ActionButtons actions={actions} />;
            }
        }
    ];

    return (
        <AppLayout>
            <Head title={t("Category Management")} />
            
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
                title={t("Category Management")}
                breadcrumbs={[
                    { label: t("Dashboard"), href: "/admin/dashboard" },
                    { label: t("Categories"), href: "/admin/categories", active: true }
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t("Search by name...")
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: t("-- All Categories --"),
                        options: [
                            { value: "", label: t("All Categories") },
                            { value: "active", label: t("Active Categories") },
                            { value: "inactive", label: t("Inactive Categories") },
                            { value: "trashed", label: t("Hidden Categories") }
                        ]
                    }
                ]}
                buttonConfigs={[
                    {
                        href: "/admin/categories/create",
                        label: t("Add Category"),
                        icon: "bx-plus",
                        color: "success"
                    }
                ]}
                onApplyFilters={applyFilters}
            />

            {/* Bảng dữ liệu */}
            <DataTable
                columns={categoryColumns}
                data={categories.data}
                headerTitle={`${t("Category List")} (${totalCategories})`}
                headerIcon="bx-list-ul"
                emptyMessage={t("No categories found")}
            />

            {/* Phân trang */}
            <Pagination 
                links={categories.links}
                filters={{
                    search,
                    status
                }}
                preserveState={true}
                preserveScroll={true}
            />

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
