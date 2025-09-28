// @ts-nocheck 
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// Định nghĩa kiểu dữ liệu
interface Product {
    product_id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number;
    brand_id: number;
}

interface Category {
    category_id: number;
    name: string;
}

interface Brand {
    brand_id: number;
    name: string;
}

interface PageProps {
    product: Product;
    categories: Category[];
    brands: Brand[];
}

export default function Edit({ product, categories, brands }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category_id: product.category_id || null,
        brand_id: product.brand_id || null,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('seller.products.update', product.product_id));
    };

    return (
        <>
            <Head title={`Chỉnh sửa: ${product.name}`} />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Chỉnh sửa: {product.name}</h1>
                <form onSubmit={submit} className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto">
                    {/* Các trường input tương tự form Create, đã điền sẵn dữ liệu */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Tên sản phẩm</label>
                        <input id="name" value={data.name} onChange={e => setData('name', e.target.value)} type="text" className="w-full border rounded p-2" />
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>
                    {/* Thêm các trường khác tương tự */}
                     <div className="mb-4">
                        <label htmlFor="category_id" className="block text-gray-700 text-sm font-bold mb-2">Danh mục</label>
                        <select id="category_id" value={data.category_id ?? ''} onChange={e => setData('category_id', parseInt(e.target.value))} className="w-full border rounded p-2">
                            {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
                        </select>
                        {errors.category_id && <div className="text-red-500 text-xs mt-1">{errors.category_id}</div>}
                    </div>

                    <div className="flex items-center justify-between">
                        <button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400">
                            Cập nhật
                        </button>
                        <Link href={route('seller.products.index')} className="text-gray-600 hover:underline">Hủy</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
