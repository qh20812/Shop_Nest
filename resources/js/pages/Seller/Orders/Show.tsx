import Toast from '@/Components/admin/users/Toast';
import AppLayout from '@/layouts/app/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

// ==================== Type Definitions ====================

interface Product {
    id: number;
    name: string;
    variant?: string;
    quantity: number;
    price: number;
}

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
}

interface Address {
    address_line: string;
    city: string;
    state?: string;
    postal_code?: string;
}

interface OrderHistory {
    status: number;
    note?: string;
    created_at: string;
}

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    shipping_fee: number;
    payment_method: string;
    status: number;
    created_at: string;
    customer: Customer;
    address: Address;
    products: Product[];
    history?: OrderHistory[];
}

// ✅ FIXED: define global PageProps for Inertia
interface InertiaPageProps<T> {
    props: T;
}

// ✅ Use type-safe PageProps
interface PageProps {
    order: Order;
    flash?: { success?: string; error?: string };
}

// ==================== Status Helper ====================

const getStatusInfo = (status: number) => {
    switch (Number(status)) {
        case 0:
            return { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' };
        case 1:
            return { text: 'Processing', className: 'bg-blue-100 text-blue-800' };
        case 2:
            return { text: 'Shipped', className: 'bg-indigo-100 text-indigo-800' };
        case 3:
            return { text: 'Delivered', className: 'bg-green-100 text-green-800' };
        case 4:
            return { text: 'Cancelled', className: 'bg-red-100 text-red-800' };
        default:
            return { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    }
};

const STATUS_OPTIONS = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Processing' },
    { value: 2, label: 'Shipped' },
    { value: 3, label: 'Delivered' },
    { value: 4, label: 'Cancelled' },
];

// ==================== Component ====================

export default function Show() {
    // ✅ No more TS error here
    const page = usePage<{ order: Order; flash?: { success?: string; error?: string } }>();
    const { order, flash } = page.props;

    const [status, setStatus] = useState(order.status);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleUpdateStatus = () => {
        setLoading(true);
        router.put(
            `/seller/orders/${order.id}/status`,
            { status },
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
                onSuccess: () => setToast({ type: 'success', message: 'Order status updated successfully!' }),
                onError: () => setToast({ type: 'error', message: 'Failed to update order status.' }),
            },
        );
    };

    const s = getStatusInfo(order.status);

    return (
        <AppLayout>
            <Head title={`Order #${order.order_number}`} />
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <main className="content-main">
                <div className="header mb-6 flex items-center justify-between">
                    <div className="left">
                        <h1>Order #{order.order_number}</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link href="/seller/dashboard">Dashboard</Link>
                            </li>
                            <li>
                                <Link href="/seller/orders">Orders</Link>
                            </li>
                            <li>Details</li>
                        </ul>
                    </div>
                    <span className={`status-badge rounded-full px-3 py-1 text-sm font-medium ${s.className}`}>{s.text}</span>
                </div>

                <div className="bottom-data space-y-6">
                    {/* Customer Info + Address */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="card rounded-2xl bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold">Customer Information</h3>
                            <p>
                                <strong>Name:</strong> {order.customer.first_name} {order.customer.last_name}
                            </p>
                            {order.customer.email && (
                                <p>
                                    <strong>Email:</strong> {order.customer.email}
                                </p>
                            )}
                            {order.customer.phone && (
                                <p>
                                    <strong>Phone:</strong> {order.customer.phone}
                                </p>
                            )}
                        </div>

                        <div className="card rounded-2xl bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
                            <p>{order.address?.address_line || '—'}</p>
                            <p>
                                {order.address
                                    ? `${order.address.city || ''}, ${order.address.state || ''} ${order.address.postal_code || ''}`
                                    : 'No address provided'}
                            </p>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="card rounded-2xl bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold">Products</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Product</th>
                                        <th className="p-2 text-left">Variant</th>
                                        <th className="p-2 text-center">Qty</th>
                                        <th className="p-2 text-right">Price</th>
                                        <th className="p-2 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.products?.map((p) => (
                                        <tr key={p.id} className="border-t hover:bg-gray-50">
                                            <td className="p-2">{p.name}</td>
                                            <td className="p-2">{p.variant || '-'}</td>
                                            <td className="p-2 text-center">{p.quantity}</td>
                                            <td className="p-2 text-right">${p.price.toLocaleString('en-US')}</td>
                                            <td className="p-2 text-right">${(p.price * p.quantity).toLocaleString('en-US')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="card max-w-md rounded-2xl bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold">Payment Summary</h3>
                        <p>
                            <strong>Payment Method:</strong> {order.payment_method}
                        </p>
                        <p>
                            <strong>Shipping Fee:</strong> ${order.shipping_fee.toLocaleString('en-US')}
                        </p>
                        <p className="mt-2 text-lg font-bold">Total: ${order.total_amount.toLocaleString('en-US')}</p>
                    </div>

                    {/* Update Status */}
                    <div className="card rounded-2xl bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold">Update Order Status</h3>
                        <div className="flex flex-wrap gap-3">
                            <select value={status} onChange={(e) => setStatus(Number(e.target.value))} className="form-input-field w-60">
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleUpdateStatus} disabled={loading} className="btn btn-primary">
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>

                    {/* History */}
                    {order.history && order.history.length > 0 && (
                        <div className="card rounded-2xl bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold">Order History</h3>
                            <ul className="space-y-2">
                                {order.history.map((h, index) => {
                                    const info = getStatusInfo(h.status);
                                    return (
                                        <li key={index} className="flex justify-between border-b pb-1">
                                            <span className={`rounded px-2 py-1 text-xs font-medium ${info.className}`}>{info.text}</span>
                                            <span className="text-sm text-gray-500">{new Date(h.created_at).toLocaleString('en-US')}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    <div>
                        <Link href="/seller/orders" className="btn btn-secondary">
                            ← Back to Orders
                        </Link>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
