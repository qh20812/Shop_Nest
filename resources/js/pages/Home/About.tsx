import React from 'react';
import { Head } from '@inertiajs/react';
import HomeLayout from '../../layouts/app/HomeLayout';

export default function About() {
    return (
        <HomeLayout>
            <Head title="Về chúng tôi - ShopNest" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-blue-800 mb-6">Về chúng tôi</h1>
                    
                    <div className="prose max-w-none">
                        <p className="text-lg text-gray-600 mb-6">
                            ShopNest là nền tảng thương mại điện tử hàng đầu, mang đến trải nghiệm mua sắm tuyệt vời cho khách hàng.
                        </p>
                        
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sứ mệnh của chúng tôi</h2>
                        <p className="text-gray-600 mb-6">
                            Chúng tôi cam kết cung cấp những sản phẩm chất lượng cao với giá cả hợp lý, 
                            đồng thời mang đến dịch vụ khách hàng xuất sắc.
                        </p>
                        
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tại sao chọn ShopNest?</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Sản phẩm đa dạng, chất lượng cao</li>
                            <li>Giá cả cạnh tranh</li>
                            <li>Giao hàng nhanh chóng</li>
                            <li>Dịch vụ khách hàng 24/7</li>
                            <li>Chính sách đổi trả linh hoạt</li>
                        </ul>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}
