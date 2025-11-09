import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// Định nghĩa kiểu dữ liệu
interface Category {
    category_id: number;
    name: string;
}

interface Brand {
    brand_id: number;
    name: string;
}

interface PageProps {
    categories: Category[];
    brands: Brand[];
}

interface FormData {
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number | null;
    brand_id: number | null;
}

export default function Create({ categories, brands }: PageProps) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: categories[0]?.category_id || null,
        brand_id: brands[0]?.brand_id || null,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('seller.products.store'));
    };

    return (
        <>
            <Head title="Tạo sản phẩm mới" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Tạo sản phẩm mới</h1>
                <form onSubmit={submit} className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto">
                    {/* Các trường input cho tên, giá, mô tả, etc. */}
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
                            Lưu sản phẩm
                        </button>
                        <Link href={route('seller.products.index')} className="text-gray-600 hover:underline">Hủy</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
