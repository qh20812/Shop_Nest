// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import AppLayout from '../../../layouts/app/AppLayout';
import FilterPanel from '@/Components/ui/FilterPanel';
import DataTable from '@/Components/ui/DataTable';
import Pagination from '@/Components/ui/Pagination';
import Toast from '@/Components/admin/users/Toast';
import ConfirmationModal from '@/Components/ui/ConfirmationModal';
import ActionButtons, { ActionConfig } from '@/Components/ui/ActionButtons';
import StatusBadge from '@/Components/ui/StatusBadge';
import ProductInfoCell from '@/Components/admin/products/ProductInfoCell';
import '@/../css/Page.css';
import { useTranslation } from '../../../lib/i18n';

interface Category {
    category_id: number;
    name: { en: string; vi: string };
}

interface Brand {
    brand_id: number;
    name: { en: string; vi: string };
}

interface Product {
    product_id: number;
    name: { en: string; vi: string };
    category: Category;
    brand: Brand;
    price: number;
}

interface PageProps {
    products: {
        data: Product[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    flash?: { success?: string; error?: string };
}

export default function SellerIndex() {
    const { products = { data: [], links: [] }, flash = {} } = usePage<PageProps>().props;

    // Toast state
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        productId: number | null;
        productName: string;
    }>({ isOpen: false, productId: null, productName: '' });

    useEffect(() => {
        if (flash?.success) setToast({ type: 'success', message: flash.success });
        else if (flash?.error) setToast({ type: 'error', message: flash.error });
    }, [flash]);

    const handleDelete = (product: Product) => {
        setConfirmModal({
            isOpen: true,
            productId: product.product_id,
            productName: product.name.vi || product.name.en,
        });
    };

    const confirmDelete = () => {
        if (!confirmModal.productId) return;
        router.delete(route('seller.products.destroy', confirmModal.productId));
        setConfirmModal({ isOpen: false, productId: null, productName: '' });
    };

    const closeModal = () => setConfirmModal({ isOpen: false, productId: null, productName: '' });
    const closeToast = () => setToast(null);

    const productColumns = [
        {
            id: 'name',
            header: 'Tên sản phẩm',
            cell: (product: Product) => product.name.vi || product.name.en || '-',
        },
        {
            id: 'category',
            header: 'Danh mục',
            cell: (product: Product) => product.category?.name?.vi || product.category?.name?.en || '-',
        },
        {
            id: 'brand',
            header: 'Thương hiệu',
            cell: (product: Product) => product.brand?.name?.vi || product.brand?.name?.en || '-',
        },
        {
            id: 'price',
            header: 'Giá',
            cell: (product: Product) => (product.price ?? 0).toLocaleString() + ' VND',
        },
        {
            id: 'actions',
            header: 'Hành động',
            cell: (product: Product) => (
                <>
                    <Link
                        href={route('seller.products.edit', product.product_id)}
                        className="text-blue-500 hover:underline mr-4"
                    >
                        Sửa
                    </Link>
                    <button
                        onClick={() => handleDelete(product)}
                        className="text-red-500 hover:underline"
                    >
                        Xóa
                    </button>
                </>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Quản lý Sản phẩm" />

            {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Sản phẩm của tôi</h1>
                <Link
                    href={route('seller.products.create')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Thêm sản phẩm mới
                </Link>
            </div>

            <DataTable
                columns={productColumns}
                data={products.data}
                headerTitle={`Danh sách sản phẩm (${products.data.length})`}
                emptyMessage="Chưa có sản phẩm nào."
            />

            <Pagination links={products.links} />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={closeModal}
                onConfirm={confirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc muốn xóa sản phẩm "${confirmModal.productName}"?`}
            />
        </AppLayout>
    );
}
