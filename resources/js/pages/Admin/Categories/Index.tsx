import { Head, router, usePage } from '@inertiajs/react';
import { EyeOff, ImageOff, ListTree, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import FilterPanel from '@/components/ui/filter-panel';
import Pagination from '@/components/ui/pagination';
import StatusBadge from '@/components/ui/status-badge';
import { formatDate } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { htmlToPlainText } from '@/utils/htmlUtils';

import styles from '@/components/admin/admin.module.css';

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

type CategoryAction = 'hide' | 'restore' | 'forceDelete';

export default function Index() {
    const { t, locale } = useTranslation();
    const { categories = { data: [], links: [] }, totalCategories = 0, filters = {}, flash = {} } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        categoryId: number | null;
        action: CategoryAction | null;
        title: string;
        message: string;
    }>({ isOpen: false, categoryId: null, action: null, title: '', message: '' });

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const applyFilters = () => {
        router.get('/admin/categories', { search, status }, { preserveState: true });
    };

    const getCategoryName = (category: Category): string => {
        return category.name[locale as keyof typeof category.name] || category.name['en'] || t('Unnamed Category');
    };

    const openConfirm = (category: Category, action: CategoryAction) => {
        const categoryName = getCategoryName(category);
        const labels: Record<CategoryAction, { title: string; message: string }> = {
            hide: {
                title: t('Confirm Hide Category'),
                message: `${t('Are you sure you want to hide category')} "${categoryName}"? ${t('This will make it invisible to users but can be restored later.')}`,
            },
            restore: {
                title: t('Confirm Restore Category'),
                message: `${t('Are you sure you want to restore category')} "${categoryName}"? ${t('This will make it visible to users again.')}`,
            },
            forceDelete: {
                title: t('Confirm Permanent Deletion'),
                message: `${t('Are you sure you want to permanently delete category')} "${categoryName}"? ${t('This action cannot be undone!')}`,
            },
        };

        setConfirmModal({ isOpen: true, categoryId: category.category_id, action, ...labels[action] });
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

    const categoryColumns = [
        {
            key: 'id',
            header: 'ID',
            cell: (category: Category) => <span className={styles.numeric}>#{category.category_id}</span>,
        },
        {
            key: 'name',
            header: t('Category Name'),
            cell: (category: Category) => {
                const categoryName = getCategoryName(category);

                return (
                    <div className={styles.brandCell}>
                        {category.image_url ? (
                            <img src={category.image_url} alt={categoryName} className={styles.thumb} />
                        ) : (
                            <span className={styles.brandInitial} aria-hidden="true">
                                <ImageOff className={styles.placeholderIcon} />
                            </span>
                        )}
                        <span className={styles.brandName}>{categoryName}</span>
                    </div>
                );
            },
        },
        {
            key: 'description',
            header: t('Description'),
            cell: (category: Category) => {
                const description = category.description?.[locale as keyof typeof category.description] || category.description?.['en'];
                if (!description) return <span className={styles.faint}>{t('No description')}</span>;

                const plainText = htmlToPlainText(description);
                const truncated = plainText.length > 50 ? `${plainText.substring(0, 50)}...` : plainText;

                return <span className={styles.brandMeta}>{truncated}</span>;
            },
        },
        {
            key: 'status',
            header: t('Status'),
            cell: (category: Category) => <StatusBadge status={category.deleted_at ? 'hidden' : category.is_active ? 'active' : 'inactive'} />,
        },
        {
            key: 'created_at',
            header: t('Created Date'),
            cell: (category: Category) => <span className={styles.numeric}>{formatDate(category.created_at)}</span>,
        },
        {
            key: 'actions',
            header: t('Actions'),
            cell: (category: Category) => {
                const actions: ActionConfig[] = [];

                if (category.deleted_at) {
                    actions.push(
                        {
                            type: 'button',
                            onClick: () => openConfirm(category, 'restore'),
                            variant: 'primary',
                            icon: RotateCcw,
                            label: t('Restore'),
                        },
                        {
                            type: 'button',
                            onClick: () => openConfirm(category, 'forceDelete'),
                            variant: 'danger',
                            icon: Trash2,
                            label: t('Delete Permanently'),
                        },
                    );
                } else {
                    actions.push(
                        {
                            type: 'link',
                            href: `/admin/categories/${category.category_id}/edit`,
                            variant: 'primary',
                            icon: Pencil,
                            label: t('Edit'),
                        },
                        {
                            type: 'button',
                            onClick: () => openConfirm(category, 'hide'),
                            variant: 'danger',
                            icon: EyeOff,
                            label: t('Hide'),
                        },
                    );
                }

                return <ActionButtons actions={actions} />;
            },
        },
    ];

    return (
        <WorkspaceLayout>
            <Head title={t('Category Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <FilterPanel
                title={t('Category Management')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Categories'), href: '/admin/categories', active: true },
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t('Search by name...'),
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: t('-- All Categories --'),
                        options: [
                            { value: '', label: t('All Categories') },
                            { value: 'active', label: t('Active Categories') },
                            { value: 'inactive', label: t('Inactive Categories') },
                            { value: 'trashed', label: t('Hidden Categories') },
                        ],
                    },
                ]}
                buttonConfigs={[
                    {
                        href: '/admin/categories/create',
                        label: t('Add Category'),
                        icon: Plus,
                        color: 'success',
                    },
                ]}
                onApplyFilters={applyFilters}
            />

            <DataTable
                columns={categoryColumns}
                data={categories.data}
                headerTitle={`${t('Category List')} (${totalCategories})`}
                headerIcon={ListTree}
                emptyMessage={t('No categories found')}
            />

            <Pagination links={categories.links} filters={{ search, status }} preserveState preserveScroll />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, categoryId: null, action: null, title: '', message: '' })}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </WorkspaceLayout>
    );
}
