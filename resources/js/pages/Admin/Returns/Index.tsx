
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../../layouts/app/AppLayout';
import Pagination from '../../../components/ui/Pagination';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Order {
    id: number;
    code: string;
}

interface ReturnRequest {
    return_id: number;
    description: string;
    status: number;
    customer: User;
    order: Order;
    created_at: string;
}

interface PageProps {
    returns: {
        data: ReturnRequest[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; status?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { returns = { data: [], links: [] }, filters = {}, flash = {} } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = () => {
        router.get('/admin/returns', { search, status }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc muốn xoá yêu cầu trả hàng này?')) {
            router.delete(`/admin/returns/${id}`);
        }
    };

    // Map trạng thái số -> chữ
    const renderStatus = (status: number) => {
        switch (status) {
            case 1: return 'Chờ xử lý';
            case 2: return 'Đã duyệt';
            case 3: return 'Đã từ chối';
            case 4: return 'Đã hoàn tiền';
            case 5: return 'Đã đổi hàng';
            default: return 'Không xác định';
        }
    };

    return (
        <AppLayout>
            <div>
                <h1 className="mb-4 text-xl font-bold">Quản lý Yêu cầu Trả hàng</h1>

                {/* Thông báo */}
                {flash?.success && <div className="mb-3 rounded bg-green-100 p-2 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="mb-3 rounded bg-red-100 p-2 text-red-700">{flash.error}</div>}

            {/* Bộ lọc */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mr-2 border px-2 py-1"
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="mr-2 border px-2 py-1">
                    <option value="">-- Trạng thái --</option>
                    <option value="1">Chờ xử lý</option>
                    <option value="2">Đã duyệt</option>
                    <option value="3">Đã từ chối</option>
                    <option value="4">Đã hoàn tiền</option>
                    <option value="5">Đã đổi hàng</option>
                </select>
                <button onClick={applyFilters} className="rounded bg-blue-500 px-3 py-1 text-white">
                    Lọc
                </button>
            </div>

            {/* Bảng danh sách */}
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">Người yêu cầu</th>
                        <th className="border px-2 py-1">Đơn hàng</th>
                        <th className="border px-2 py-1">Mô tả</th>
                        <th className="border px-2 py-1">Trạng thái</th>
                        <th className="border px-2 py-1">Ngày tạo</th>
                        <th className="border px-2 py-1">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {returns.data.length > 0 ? (
                        returns.data.map((r) => (
                            <tr key={r.return_id}>
                                <td className="border px-2 py-1">{r.return_id}</td>
                                <td className="border px-2 py-1">
                                    {r.customer?.name} ({r.customer?.email})
                                </td>
                                <td className="border px-2 py-1">
                                    {r.order?.code ? `#${r.order.code}` : 'Không có'}
                                </td>
                                <td className="border px-2 py-1">{r.description}</td>
                                <td className="border px-2 py-1">{renderStatus(r.status)}</td>
                                <td className="border px-2 py-1">{r.created_at}</td>
                                <td className="border px-2 py-1">
                                    <Link href={`/admin/returns/${r.return_id}/edit`} className="mr-2 text-blue-600">
                                        Sửa
                                    </Link>
                                    <button onClick={() => handleDelete(r.return_id)} className="text-red-600">
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="py-4 text-center">
                                Không có yêu cầu trả hàng nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Phân trang */}
            <Pagination links={returns.links} />
            </div>
        </AppLayout>
    );
}
