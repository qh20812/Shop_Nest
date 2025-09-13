// File: resources/js/pages/Admin/Categories/Index.tsx

import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Giả sử bạn có một layout chung
import { type PageProps } from '@/types';

// Định nghĩa kiểu dữ liệu cho một danh mục
interface Category {
    category_id: number;
    name: string;
    description: string;
    created_at: string;
}

// Định nghĩa kiểu cho dữ liệu phân trang
interface PaginatedCategories {
    data: Category[];
    // Thêm các thuộc tính phân trang khác nếu cần
    links: { url: string | null; label: string; active: boolean }[];
}

export default function CategoryIndex() {
    // Lấy dữ liệu 'categories' được truyền từ CategoryController
    const { categories } = usePage<PageProps & { categories: PaginatedCategories }>().props;

    return (
        <AppLayout>
            <Head title="Quản lý Danh mục" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-semibold mb-6">Danh sách Danh mục</h1>

                            {/* Nút thêm mới (sẽ làm chức năng sau) */}
                            <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Thêm mới
                            </button>

                            {/* Bảng hiển thị dữ liệu */}
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Danh mục</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Hành động</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.data.map((category) => (
                                        <tr key={category.category_id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{category.category_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                                            <td className="px-6 py-4">{category.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900">Sửa</a>
                                                <a href="#" className="ml-4 text-red-600 hover:text-red-900">Xóa</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* Component phân trang (sẽ làm sau) */}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}