import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../../layouts/app/AppLayout';

interface Category {
    id: number;
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

    return (
        <AppLayout>
            <div>
                <h1 className="mb-4 text-xl font-bold">Quản lý Danh mục</h1>

                {/* Thông báo */}
                {flash?.success && <div className="mb-3 rounded bg-green-100 p-2 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="mb-3 rounded bg-red-100 p-2 text-red-700">{flash.error}</div>}

                {/* Bộ lọc và thêm mới */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mr-2 border px-2 py-1"
                        />
                        <button onClick={applyFilters} className="rounded bg-blue-500 px-3 py-1 text-white">
                            Lọc
                        </button>
                    </div>
                    <Link href="/admin/categories/create" className="rounded bg-green-500 px-3 py-1 text-white">
                        Thêm danh mục
                    </Link>
                </div>

                {/* Bảng danh sách */}
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">ID</th>
                            <th className="border px-2 py-1">Tên danh mục</th>
                            <th className="border px-2 py-1">Mô tả</th>
                            <th className="border px-2 py-1">Ngày tạo</th>
                            <th className="border px-2 py-1">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.data.length > 0 ? (
                            categories.data.map((category) => (
                                <tr key={category.id}>
                                    <td className="border px-2 py-1">{category.id}</td>
                                    <td className="border px-2 py-1">{category.name}</td>
                                    <td className="border px-2 py-1">{category.description || 'Không có'}</td>
                                    <td className="border px-2 py-1">{category.created_at}</td>
                                    <td className="border px-2 py-1">
                                        <Link href={`/admin/categories/${category.id}/edit`} className="mr-2 text-blue-600">
                                            Sửa
                                        </Link>
                                        <button onClick={() => handleDelete(category.id)} className="text-red-600">
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-4 text-center">
                                    Không có danh mục nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Phân trang */}
                <div className="mt-4">
                    {categories.links.map((link) => (
                        <button
                            key={link.url || link.label}
                            disabled={!link.url}
                            className={`mr-1 border px-2 py-1 ${link.active ? 'bg-blue-500 text-white' : ''}`}
                            onClick={() => link.url && router.get(link.url)}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
