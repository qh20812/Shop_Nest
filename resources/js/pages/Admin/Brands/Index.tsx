import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../../layouts/app/AppLayout';

interface Brand {
    id: number;
    name: string;
    description?: string;
    created_at: string;
}

interface PageProps {
    brands: {
        data: Brand[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { brands = { data: [], links: [] }, filters = {}, flash = {} } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = () => {
        router.get('/admin/brands', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc muốn xoá thương hiệu này?')) {
            router.delete(`/admin/brands/${id}`);
        }
    };

    return (
        <AppLayout>
            <div>
                <h1 className="mb-4 text-xl font-bold">Quản lý Thương hiệu</h1>

                {/* Thông báo */}
                {flash?.success && <div className="mb-3 rounded bg-green-100 p-2 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="mb-3 rounded bg-red-100 p-2 text-red-700">{flash.error}</div>}

                {/* Bộ lọc và thêm mới */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Tìm kiếm thương hiệu..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mr-2 border px-2 py-1"
                        />
                        <button onClick={applyFilters} className="rounded bg-blue-500 px-3 py-1 text-white">
                            Lọc
                        </button>
                    </div>
                    <Link href="/admin/brands/create" className="rounded bg-green-500 px-3 py-1 text-white">
                        Thêm thương hiệu
                    </Link>
                </div>

                {/* Bảng danh sách */}
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">ID</th>
                            <th className="border px-2 py-1">Tên thương hiệu</th>
                            <th className="border px-2 py-1">Mô tả</th>
                            <th className="border px-2 py-1">Ngày tạo</th>
                            <th className="border px-2 py-1">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.data.length > 0 ? (
                            brands.data.map((brand) => (
                                <tr key={brand.id}>
                                    <td className="border px-2 py-1">{brand.id}</td>
                                    <td className="border px-2 py-1">{brand.name}</td>
                                    <td className="border px-2 py-1">{brand.description || 'Không có'}</td>
                                    <td className="border px-2 py-1">{brand.created_at}</td>
                                    <td className="border px-2 py-1">
                                        <Link href={`/admin/brands/${brand.id}/edit`} className="mr-2 text-blue-600">
                                            Sửa
                                        </Link>
                                        <button onClick={() => handleDelete(brand.id)} className="text-red-600">
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-4 text-center">
                                    Không có thương hiệu nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Phân trang */}
                <div className="mt-4">
                    {brands.links.map((link) => (
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
