// @ts-nocheck
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

// --- Kiểu dữ liệu ---
interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}
interface ShippingAddress {
    full_name: string;
    phone_number: string;
    street: string;
    ward: string;
    district: string;
    city: string;
}
interface Product {
    product_id: number;
    name: string;
    seller_id: number;
}
interface ProductVariant {
    variant_id: number;
    product: Product;
}
interface OrderItem {
    order_item_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    variant: ProductVariant;
    description?: string; // thêm description
}
interface Order {
    order_id: number;
    order_number: string;
    total_amount: number;
    status: number;
    created_at: string;
    customer: User;
    shippingAddress: ShippingAddress;
    items: OrderItem[];
}
interface PageProps {
    order: Order;
    flash?: { success?: string };
    auth: { user: { id: number } };
}

// helper trạng thái
const getStatusInfo = (status: number): { text: string; className: string } => {
    switch (status) {
        case 1:
            return { text: 'Đang chờ xử lý', className: 'text-yellow-600' };
        case 2:
            return { text: 'Đang xử lý', className: 'text-blue-600' };
        case 3:
            return { text: 'Đã giao cho vận chuyển', className: 'text-indigo-600' };
        case 4:
            return { text: 'Đã giao thành công', className: 'text-green-600' };
        case 5:
            return { text: 'Đã hủy', className: 'text-red-600' };
        default:
            return { text: 'Không xác định', className: 'text-gray-600' };
    }
};

export default function Show() {
    const { order, flash, auth } = usePage<PageProps>().props;
    const sellerId = auth.user.id;

    const sellerItems = order.items.filter((item) => item.variant.product.seller_id === sellerId);

    const { data, setData, put, processing, errors } = useForm({
        status: order.status,
    });

    const handleStatusUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('seller.orders.updateStatus', order.order_id), {
            preserveScroll: true,
        });
    };

    const statusInfo = getStatusInfo(order.status);

    return (
        <>
            <Head title={`Chi tiết đơn hàng ${order.order_number}`} />
            ```
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Chi tiết đơn hàng: {order.order_number}</h1>
                        <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                    </div>
                    <Link href={route('seller.orders.index')} className="text-blue-500 hover:underline">
                        &larr; Quay lại danh sách
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-4 border-l-4 border-green-500 bg-green-100 p-4 text-green-700" role="alert">
                        <p>{flash.success}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Thông tin khách hàng */}
                    <div className="space-y-6 md:col-span-1">
                        <div className="rounded-lg bg-white p-4 shadow">
                            <h3 className="mb-2 border-b pb-2 font-bold">Thông tin khách hàng</h3>
                            <p>
                                {order.customer.first_name} {order.customer.last_name}
                            </p>
                            <p>{order.customer.email}</p>
                            <p>{order.customer.phone_number}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow">
                            <h3 className="mb-2 border-b pb-2 font-bold">Địa chỉ giao hàng</h3>
                            <p>{order.shippingAddress.full_name}</p>
                            <p>{order.shippingAddress.phone_number}</p>
                            <p>{`${order.shippingAddress.street}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.city}`}</p>
                        </div>
                    </div>

                    {/* Sản phẩm & trạng thái */}
                    <div className="space-y-6 md:col-span-2">
                        <div className="rounded-lg bg-white p-4 shadow">
                            <h3 className="mb-2 border-b pb-2 font-bold">Sản phẩm của bạn trong đơn hàng</h3>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-left">Sản phẩm</th>
                                        <th className="py-2 text-left">Mô tả</th>
                                        <th className="py-2 text-center">Số lượng</th>
                                        <th className="py-2 text-right">Đơn giá</th>
                                        <th className="py-2 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sellerItems.map((item) => (
                                        <tr key={item.order_item_id} className="border-b">
                                            <td className="py-2">{item.variant.product.name}</td>
                                            <td className="py-2">{item.description || '-'}</td>
                                            <td className="py-2 text-center">{item.quantity}</td>
                                            <td className="py-2 text-right">{item.unit_price.toLocaleString('vi-VN')} ₫</td>
                                            <td className="py-2 text-right">{item.total_price.toLocaleString('vi-VN')} ₫</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="rounded-lg bg-white p-4 shadow">
                            <h3 className="mb-2 border-b pb-2 font-bold">Cập nhật trạng thái</h3>
                            <p className="mb-4">
                                Trạng thái hiện tại: <span className={`font-semibold ${statusInfo.className}`}>{statusInfo.text}</span>
                            </p>
                            <form onSubmit={handleStatusUpdate}>
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', parseInt(e.target.value))}
                                        className="block w-full rounded-md border-gray-300 shadow-sm md:w-1/2"
                                    >
                                        {[1, 2, 3, 4, 5].map((id) => {
                                            const s = getStatusInfo(id);
                                            return (
                                                <option key={id} value={id}>
                                                    {s.text}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
                                    >
                                        {processing ? 'Đang lưu...' : 'Cập nhật'}
                                    </button>
                                </div>
                                {errors.status && <p className="mt-2 text-xs text-red-500">{errors.status}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
