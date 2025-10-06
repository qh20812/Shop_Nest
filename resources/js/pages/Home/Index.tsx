import React from 'react';
import { Head, Link } from '@inertiajs/react';
import HomeLayout from '../../layouts/app/HomeLayout';

export default function Home() {
    // --- mock data ---
    const flashSales = [
        { id: 1, name: 'Tai nghe Bluetooth', image: 'https://cf.shopee.vn/file/2b74a9e2c8334f5a8cf63c568f9c9a5c_tn', price: 199000, discount: 30 },
        { id: 2, name: 'Chuột Gaming RGB', image: 'https://cf.shopee.vn/file/b9e63f48c4c424ea3fa3329d646b9e9c_tn', price: 259000, discount: 40 },
        { id: 3, name: 'Bàn phím cơ', image: 'https://cf.shopee.vn/file/36e3ecdf6c6d7d3c8a6acb9a315dfb2e_tn', price: 489000, discount: 25 },
        { id: 4, name: 'Ổ cắm điện thông minh', image: 'https://cf.shopee.vn/file/cc792cb0db9c0f084c9fd5c46a3d0de7_tn', price: 99000, discount: 10 },
        { id: 5, name: 'Loa mini bluetooth', image: 'https://cf.shopee.vn/file/f8d067e8dfc2cf8cb4e045a33e4b7b14_tn', price: 149000, discount: 35 },
    ];

    const categories = [
        { id: 1, name: 'Điện thoại', image: 'https://cf.shopee.vn/file/sg-11134201-7rd58-lp2h58nknzx3a3_tn' },
        { id: 2, name: 'Laptop', image: 'https://cf.shopee.vn/file/sg-11134201-7rd5f-lp2h58nknzx3a4_tn' },
        { id: 3, name: 'Tai nghe', image: 'https://cf.shopee.vn/file/sg-11134201-7rd57-lp2h58nknzx3a5_tn' },
        { id: 4, name: 'Đồng hồ', image: 'https://cf.shopee.vn/file/sg-11134201-7rd58-lp2h58nknzx3a6_tn' },
        { id: 5, name: 'Gia dụng', image: 'https://cf.shopee.vn/file/sg-11134201-7rd5e-lp2h58nknzx3a7_tn' },
    ];

    const topSearches = [
        { id: 1, title: 'Áo thun nam', searches: '50K+', image: 'https://cf.shopee.vn/file/sg-11134201-7rd5i-lp2h58nknzx3a8_tn' },
        { id: 2, title: 'Điện thoại iPhone', searches: '42K+', image: 'https://cf.shopee.vn/file/sg-11134201-7rd58-lp2h58nknzx3a9_tn' },
        { id: 3, title: 'Son môi', searches: '30K+', image: 'https://cf.shopee.vn/file/sg-11134201-7rd5a-lp2h58nknzx3a0_tn' },
        { id: 4, title: 'Giày thể thao', searches: '27K+', image: 'https://cf.shopee.vn/file/sg-11134201-7rd5j-lp2h58nknzx3b1_tn' },
        { id: 5, title: 'Balo học sinh', searches: '25K+', image: 'https://cf.shopee.vn/file/sg-11134201-7rd5a-lp2h58nknzx3b2_tn' },
    ];

    const dailyDiscover = [
        { id: 1, name: 'Áo sơ mi nam', image: 'https://cf.shopee.vn/file/sg-11134201-7rd5g-lp2h58nknzx3b3_tn', price: 129000 },
        { id: 2, name: 'Quần jean nữ', image: 'https://cf.shopee.vn/file/sg-11134201-7rd5g-lp2h58nknzx3b4_tn', price: 179000 },
        { id: 3, name: 'Tai nghe có dây', image: 'https://cf.shopee.vn/file/sg-11134201-7rd5g-lp2h58nknzx3b5_tn', price: 59000 },
        { id: 4, name: 'Bình giữ nhiệt', image: 'https://cf.shopee.vn/file/sg-11134201-7rd5g-lp2h58nknzx3b6_tn', price: 99000 },
        { id: 5, name: 'Đèn bàn học', image: 'https://cf.shopee.vn/file/sg-11134201-7rd5g-lp2h58nknzx3b7_tn', price: 149000 },
    ];

    return (
        <HomeLayout>
            <Head title="ShopNest - Trang chủ" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Welcome Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to ShopNest</h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Khám phá những sản phẩm tuyệt vời và ưu đãi hấp dẫn!
                    </p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                    >
                        Đăng nhập
                    </Link>
                </div>

                {/* FLASH SALE */}
                <section className="mb-12 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-blue-800 mb-6">🔥 Flash Sale</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {flashSales.map(item => (
                            <div key={item.id} className="bg-white border rounded-lg shadow-sm hover:shadow-xl p-3 text-center transition-all cursor-pointer">
                                <img src={item.image} alt={item.name} className="object-cover w-full h-28 rounded-lg mb-2" />
                                <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                                <p className="text-red-500 font-semibold mt-1">{item.price.toLocaleString()}₫</p>
                                <span className="text-xs text-gray-500">Giảm {item.discount}%</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CATEGORIES */}
                <section className="mb-12 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-blue-800 mb-6">🏷️ Danh mục</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categories.map(cat => (
                            <div key={cat.id} className="text-center bg-white border rounded-lg shadow-sm hover:shadow-md p-3 cursor-pointer transition-all">
                                <img src={cat.image} alt={cat.name} className="object-cover w-full h-24 rounded-lg mb-2" />
                                <h3 className="text-sm font-medium text-gray-800">{cat.name}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* TOP SEARCH */}
                <section className="mb-12 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-blue-800 mb-6">🔍 Tìm kiếm hàng đầu</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {topSearches.map(s => (
                            <div key={s.id} className="text-center bg-white border rounded-lg shadow-sm hover:shadow-md p-3 cursor-pointer transition-all">
                                <img src={s.image} alt={s.title} className="object-cover w-full h-24 rounded-lg mb-2" />
                                <h3 className="text-sm font-medium text-gray-800">{s.title}</h3>
                                <p className="text-xs text-gray-500">{s.searches} lượt tìm</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* DAILY DISCOVER */}
                <section className="mb-12 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-blue-800 mb-6">💡 Gợi ý hôm nay</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {dailyDiscover.map(item => (
                            <div key={item.id} className="bg-white border rounded-lg shadow-sm hover:shadow-xl p-3 text-center transition-all cursor-pointer">
                                <img src={item.image} alt={item.name} className="object-cover w-full h-28 rounded-lg mb-2" />
                                <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                                <p className="text-red-500 font-semibold mt-1">{item.price.toLocaleString()}₫</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </HomeLayout>
    );
}