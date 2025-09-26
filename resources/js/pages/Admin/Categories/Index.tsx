import { Link, router, usePage, Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../../layouts/app/AppLayout';
import FilterPanel from '../../../components/admin/FilterPanel';
import DataTable from '../../../components/admin/DataTable';
import Pagination from '../../../components/admin/users/Pagination';
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

    const applyFilters = () => {
        router.get('/admin/categories', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc muốn xoá danh mục này?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    // Define columns for DataTable
    const categoryColumns = [
        {
            header: "ID",
            accessorKey: "id" as keyof Category
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
            cell: (category: Category) => (
                <div>
                    <Link href={`/admin/categories/${category.category_id}/edit`} className="mr-2 text-blue-600">
                        {t('Edit')}
                    </Link>
                    <button onClick={() => handleDelete(category.category_id)} className="text-red-600">
                        {t('Delete')}
                    </button>
                </div>
            )
        }
    ];

    return (
        <AppLayout>
            <Head title={t("Category Management")} />
            {/* Thông báo */}
            {flash?.success && <div className="mb-3 rounded bg-green-100 p-2 text-green-700">{flash.success}</div>}
            {flash?.error && <div className="mb-3 rounded bg-red-100 p-2 text-red-700">{flash.error}</div>}

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
        </AppLayout>
    );
}
