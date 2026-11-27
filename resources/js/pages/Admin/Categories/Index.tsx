import { Head, Link, router, usePage } from '@inertiajs/react';
import { Check, EyeOff, ImageOff, ListTree, Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import StatusBadge from '@/components/ui/status-badge';
import { cx } from '@/lib/cx';
import { formatDate, formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { htmlToPlainText } from '@/utils/htmlUtils';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Categories.module.css';

interface TranslatedName {
    en?: string;
    vi?: string;
}

interface ParentCategory {
    category_id: number;
    name?: TranslatedName;
}

interface Category {
    category_id: number;
    name: TranslatedName;
    description?: TranslatedName | null;
    parent_category_id?: number | null;
    parent?: ParentCategory | null;
    children_count?: number;
    products_count?: number;
    is_active: boolean;
    created_at: string;
    deleted_at?: string | null;
    image_url?: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface CategoryPaginator {
    data: Category[];
    links: PaginationLink[];
    from?: number | null;
    to?: number | null;
    total?: number;
}

interface PageProps {
    categories: CategoryPaginator;
    totalCategories: number;
    statusCounts: Record<string, number>;
    filters: { search?: string; status?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

type CategoryAction = 'hide' | 'restore' | 'forceDelete';

const resolveName = (value: TranslatedName | string | undefined, locale: string, fallback: string): string => {
    if (!value) {
        return fallback;
    }

    if (typeof value === 'string') {
        return value;
    }

    return value[locale as keyof TranslatedName] || value.en || value.vi || fallback;
};

export default function Index() {
    const { t, locale } = useTranslation();
    const { categories, totalCategories, statusCounts = {}, filters = {}, flash } = usePage<PageProps>().props;

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
        setSearch(filters.search || '');
        setStatus(filters.status || '');
    }, [filters.search, filters.status]);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const applyFilters = () => {
        router.get('/admin/categories', { search: search || undefined, status: status || undefined }, { preserveState: true, preserveScroll: true });
    };

    const getCategoryName = (category: Category): string => resolveName(category.name, locale, t('Unnamed Category'));

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

    const closeConfirm = () => setConfirmModal({ isOpen: false, categoryId: null, action: null, title: '', message: '' });

    const handleConfirmAction = () => {
        if (!confirmModal.categoryId || !confirmModal.action) {
            return;
        }

        const categoryId = confirmModal.categoryId;
        const action = confirmModal.action;
        closeConfirm();

        switch (action) {
            case 'hide':
                router.delete(`/admin/categories/${categoryId}`, { preserveScroll: true });
                break;
            case 'restore':
                router.patch(`/admin/categories/${categoryId}/restore`, {}, { preserveScroll: true });
                break;
            case 'forceDelete':
                router.delete(`/admin/categories/${categoryId}/force-delete`, { preserveScroll: true });
                break;
        }
    };

    const handleActivate = (category: Category) => {
        router.patch(`/admin/categories/${category.category_id}/activate`, {}, { preserveScroll: true });
    };

    const visibleTotal = categories.total ?? totalCategories;
    const hasFilters = Boolean(filters.search || filters.status);
    const rangeLabel =
        visibleTotal > 0
            ? `${formatNumber(categories.from ?? 0)}-${formatNumber(categories.to ?? 0)} / ${formatNumber(visibleTotal)}`
            : formatNumber(0);

    const summaryItems = [
        { key: 'total', label: t('Total Categories'), value: statusCounts.total ?? 0 },
        { key: 'active', label: t('Active Categories'), value: statusCounts.active ?? 0 },
        { key: 'inactive', label: t('Inactive Categories'), value: statusCounts.inactive ?? 0 },
        { key: 'trashed', label: t('Hidden Categories'), value: statusCounts.trashed ?? 0 },
    ];

    const columns = [
        {
            key: 'category',
            header: t('Category Name'),
            cell: (category: Category) => {
                const categoryName = getCategoryName(category);

                return (
                    <div className={styles.category}>
                        {category.image_url ? (
                            <img src={category.image_url} alt={categoryName} className={styles.thumb} />
                        ) : (
                            <span className={styles.placeholder} aria-hidden="true">
                                <ImageOff className={styles.placeholderIcon} />
                            </span>
                        )}
                        <div className={styles.categoryBody}>
                            <span className={styles.categoryName} title={categoryName}>
                                {categoryName}
                            </span>
                            <span className={styles.categoryMeta}>
                                <span>#{category.category_id}</span>
                                <span>{formatDate(category.created_at)}</span>
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'description',
            header: t('Description'),
            cell: (category: Category) => {
                const description = category.description?.[locale as keyof TranslatedName] || category.description?.en;
                if (!description) {
                    return <span className={styles.description}>{t('No description')}</span>;
                }

                const plainText = htmlToPlainText(description);

                return (
                    <span className={styles.description} title={plainText}>
                        {plainText}
                    </span>
                );
            },
        },
        {
            key: 'structure',
            header: t('Structure'),
            cell: (category: Category) => (
                <div className={styles.structure}>
                    <span className={styles.parent} title={resolveName(category.parent?.name, locale, t('No Parent Category'))}>
                        {resolveName(category.parent?.name, locale, t('No Parent Category'))}
                    </span>
                    <span className={styles.counts}>
                        {formatNumber(category.children_count ?? 0)} {t('Subcategories')} / {formatNumber(category.products_count ?? 0)}{' '}
                        {t('Products')}
                    </span>
                </div>
            ),
        },
        {
            key: 'status',
            header: t('Status'),
            cell: (category: Category) => <StatusBadge status={category.deleted_at ? 'hidden' : category.is_active ? 'active' : 'inactive'} />,
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
                    actions.push({
                        type: 'link',
                        href: `/admin/categories/${category.category_id}/edit`,
                        variant: 'primary',
                        icon: Pencil,
                        label: t('Edit'),
                    });

                    if (!category.is_active) {
                        actions.push({
                            type: 'button',
                            onClick: () => handleActivate(category),
                            variant: 'primary',
                            icon: Check,
                            label: t('Activate'),
                        });
                    }

                    actions.push({
                        type: 'button',
                        onClick: () => openConfirm(category, 'hide'),
                        variant: 'danger',
                        icon: EyeOff,
                        label: t('Hide'),
                    });
                }

                return <ActionButtons actions={actions} />;
            },
        },
    ];

    return (
        <WorkspaceLayout>
            <Head title={t('Category Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Categories'), current: true },
                    ]}
                    title={t('Category Management')}
                    count={formatNumber(visibleTotal)}
                    actions={
                        <Button asChild variant="primary" size="sm">
                            <Link href="/admin/categories/create">
                                <Plus aria-hidden="true" />
                                {t('Add Category')}
                            </Link>
                        </Button>
                    }
                />

                <form
                    className={cx(styles.filters, 'sn-glass-surface')}
                    aria-label={t('Filters')}
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <FormField label={t('Search')} htmlFor="category-search">
                        <Input
                            id="category-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t('Search by name...')}
                            leadingIcon={Search}
                            surface="glass"
                        />
                    </FormField>

                    <FormField label={t('Status')} htmlFor="category-status-filter">
                        <Select id="category-status-filter" value={status} onChange={(event) => setStatus(event.target.value)} surface="glass">
                            <option value="">{t('All Categories')}</option>
                            <option value="active">{t('Active Categories')}</option>
                            <option value="inactive">{t('Inactive Categories')}</option>
                            <option value="trashed">{t('Hidden Categories')}</option>
                        </Select>
                    </FormField>

                    <div className={styles.filterActions}>
                        <Button type="submit" variant="primary" leftIcon={Search}>
                            {t('Apply')}
                        </Button>
                    </div>
                </form>

                <dl className={styles.summaryRail}>
                    {summaryItems.map((item) => (
                        <div key={item.key} className={styles.summary}>
                            <dt className={styles.summaryLabel}>{item.label}</dt>
                            <dd className={styles.summaryValue}>{formatNumber(item.value)}</dd>
                        </div>
                    ))}
                </dl>

                <div className={styles.table}>
                    <DataTable
                        columns={columns}
                        data={categories.data}
                        headerTitle={t('Category List')}
                        headerIcon={ListTree}
                        headerMeta={rangeLabel}
                        emptyMessage={hasFilters ? t('No categories match the filters.') : t('No categories found')}
                    />
                </div>

                <Pagination links={categories.links} filters={{ search, status }} />
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </WorkspaceLayout>
    );
}
