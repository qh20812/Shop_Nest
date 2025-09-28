// @ts-nocheck 
import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
// Giả sử bạn có một Layout cho Seller
// import SellerLayout from '@/Layouts/SellerLayout';

// Định nghĩa kiểu dữ liệu cho TypeScript
interface Category {
    category_id: number;
    name: string;
}

interface Product {
    product_id: number;
    name: string;
    price: number;
    category: Category;
}

interface Paginator<T> {
    data: T[];
    // Thêm các thuộc tính khác của paginator nếu cần
    // links: { url: string | null; label: string; active: boolean }[];
}

interface PageProps {
    products: Paginator<Product>;
    flash?: {
        success?: string;
    };
}

export default function Index() {
    const { products, flash } = usePage<PageProps>().props;

    return (
        // <SellerLayout>
            <>
                <Head title="Quản lý Sản phẩm" />

                <div className="container mx-auto p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Sản phẩm của tôi</h1>
                        <Link href={route('seller.products.create')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Thêm sản phẩm mới
                        </Link>
                    </div>

                    {flash?.success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                            <p>{flash.success}</p>
                        </div>
                    )}

                    <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Tên sản phẩm</th>
                                    <th className="py-3 px-6 text-left">Danh mục</th>
                                    <th className="py-3 px-6 text-center">Giá</th>
                                    <th className="py-3 px-6 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {products.data.map((product) => (
                                    <tr key={product.product_id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">{product.name}</td>
                                        <td className="py-3 px-6 text-left">{product.category.name}</td>
                                        <td className="py-3 px-6 text-center">{product.price.toLocaleString()}</td>
                                        <td className="py-3 px-6 text-center">
                                            <Link href={route('seller.products.edit', product.product_id)} className="text-blue-500 hover:underline">Sửa</Link>
                                            <Link
                                                href={route('seller.products.destroy', product.product_id)}
                                                method="delete"
                                                as="button"
                                                className="text-red-500 hover:underline ml-4"
                                                onBefore={() => confirm('Bạn có chắc muốn xóa sản phẩm này?')}
                                            >
                                                Xóa
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {products.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-4 px-6 text-center text-gray-500">Chưa có sản phẩm nào.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Component phân trang có thể đặt ở đây */}
                </div>
            </>
        // </SellerLayout>
    );
}
