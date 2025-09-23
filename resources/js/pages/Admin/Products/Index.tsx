import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';

// Định nghĩa kiểu dữ liệu cho props `products`
interface Product {
    product_id: number;
    name: string;
    category: { name: string };
    brand: { name: string };
    seller: { username: string };
    status: number;
}

interface PaginatedProducts {
    data: Product[];
    // Thêm các thuộc tính khác của paginator nếu cần
}

interface Props {
    products: PaginatedProducts;
}

export default function ProductIndex({ products }: Props) {
    return (
        <AppLayout>
            <Head title="Quản lý Sản phẩm" />
            
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Danh sách Sản phẩm</h1>

                <div className="bg-white shadow-md rounded my-6">
                    <table className="min-w-max w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Tên sản phẩm</th>
                                <th className="py-3 px-6 text-left">Danh mục</th>
                                <th className="py-3 px-6 text-center">Thương hiệu</th>
                                <th className="py-3 px-6 text-center">Người bán</th>
                                <th className="py-3 px-6 text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {products.data.map((product) => (
                                <tr key={product.product_id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{product.name}</td>
                                    <td className="py-3 px-6 text-left">{product.category.name}</td>
                                    <td className="py-3 px-6 text-center">{product.brand.name}</td>
                                    <td className="py-3 px-6 text-center">{product.seller.username}</td>
                                    <td className="py-3 px-6 text-center">{product.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}