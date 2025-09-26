import { router, usePage, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppLayout from '../../../layouts/app/AppLayout';
import FilterPanel from '../../../components/admin/FilterPanel';
import DataTable from '../../../components/admin/DataTable';
import Pagination from '../../../components/admin/users/Pagination';
import Toast from '../../../components/admin/users/Toast';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import ActionButtons, { type ActionConfig } from '../../../components/admin/ActionButtons';
import { useTranslation } from '../../../lib/i18n';

interface Category {
    category_id: number;
    name: string;
    description?: string;
    created_at: string;
}

interface PageProps {
    categories: {
        data: Category[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { t } = useTranslation();
    const { categories = { data: [], links: [] }, filters = {}, flash = {} } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');

    // Toast state
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        categoryId: number | null;
        categoryName: string;
    }>({
        isOpen: false,
        categoryId: null,
        categoryName: "",
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
        router.get('/admin/categories', { search }, { preserveState: true });
    };

    const handleDelete = (category: Category) => {
        setConfirmModal({
            isOpen: true,
            categoryId: category.category_id,
            categoryName: category.name,
        });
    };

    const handleConfirmDelete = () => {
        if (confirmModal.categoryId) {
            router.delete(`/admin/categories/${confirmModal.categoryId}`);
        }
    };

    const handleCloseModal = () => {
        setConfirmModal({
            isOpen: false,
            categoryId: null,
            categoryName: "",
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
            header: "Category Name",
            accessorKey: "name" as keyof Category
        },
        {
            header: "Description", 
            cell: (category: Category) => category.description || t('No description')
        },
        {
            header: "Created Date",
            accessorKey: "created_at" as keyof Category
        },
        {
            header: "Actions",
            cell: (category: Category) => {
                const actions: ActionConfig[] = [
                    {
                        type: 'link',
                        href: `/admin/categories/${category.category_id}/edit`,
                        variant: 'primary',
                        icon: 'bx bx-edit',
                        label: t('Edit')
                    },
                    {
                        type: 'button',
                        onClick: () => handleDelete(category),
                        variant: 'danger',
                        icon: 'bx bx-trash',
                        label: t('Delete')
                    }
                ];
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
                title="Category Management"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Categories", href: "/admin/categories", active: true }
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: "Search by name..."
                }}
                buttonConfigs={[
                    {
                        href: "/admin/categories/create",
                        label: "Add Category",
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
                headerTitle="Category List"
                headerIcon="bx-list-ul"
                emptyMessage="No categories found"
            />

            {/* Phân trang */}
            <Pagination links={categories.links} />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title={t("Confirm Category Deletion")}
                message={`${t("Are you sure you want to delete category")} "${confirmModal.categoryName}"? ${t("This action cannot be undone.")}`}
            />
        </AppLayout>
    );
}
