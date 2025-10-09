import React from 'react';
import { Head } from '@inertiajs/react';
import HomeLayout from '../../layouts/app/HomeLayout';
import CategoryCarousel from '@/components/home/ui/CategoryCarousel';
import FlashSaleSection from '@/components/home/ui/FlashSaleSection';
import TopSearchSection from '@/components/home/ui/TopSearchSection';
import DailyDiscoverSection from '@/components/home/ui/DailyDiscoverSection';

export default function Home() {
    // All categories data
    const categories = [
        { img: "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp", name: "Điện thoại" },
        { img: "https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w640_nl.webp", name: "Thời trang nữ" },
        { img: "https://down-vn.img.susercontent.com/file/74ca517e1fa74dc4d974e5d03c3139de@resize_w640_nl.webp", name: "Thời trang nam" },
        { img: "https://down-vn.img.susercontent.com/file/31234a27876fb89cd522d7e3db1ba5ca@resize_w640_nl.webp", name: "Giày dép" },
        { img: "https://down-vn.img.susercontent.com/file/7abfbfee3c4844652b4a8245e473d857@resize_w640_nl.webp", name: "Điện tử" },
        { img: "https://down-vn.img.susercontent.com/file/24b194a695ea59d384768b7b471d563f@resize_w640_nl.webp", name: "Đồ gia dụng" },
        { img: "https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d@resize_w640_nl.webp", name: "Sức khỏe" },
        { img: "https://down-vn.img.susercontent.com/file/6cb7e633f8b63757463b676bd19a50e4@resize_w640_nl.webp", name: "Thể thao" },
        { img: "https://down-vn.img.susercontent.com/file/c3f3edfaa9f6dafc4825b77d8449999d@resize_w640_nl.webp", name: "Phụ kiện" },
        { img: "https://down-vn.img.susercontent.com/file/099edde1ab31df35bc255912bab54a5e@resize_w640_nl.webp", name: "Đồ chơi" },
        { img: "https://down-vn.img.susercontent.com/file/36013311815c55d303b0e6c62d6a8139@resize_w640_nl.webp", name: "Đồ dùng học tập" },
        { img: "https://down-vn.img.susercontent.com/file/ec14dd4fc238e676e43be2a911414d4d@resize_w640_nl.webp", name: "Làm đẹp" },
        // Add more categories to demonstrate carousel
        { img: "https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w640_nl.webp", name: "Đồng hồ" },
        { img: "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp", name: "Máy tính" },
        { img: "https://down-vn.img.susercontent.com/file/74ca517e1fa74dc4d974e5d03c3139de@resize_w640_nl.webp", name: "Đồ nội thất" },
        { img: "https://down-vn.img.susercontent.com/file/31234a27876fb89cd522d7e3db1ba5ca@resize_w640_nl.webp", name: "Xe cộ" },
        { img: "https://down-vn.img.susercontent.com/file/7abfbfee3c4844652b4a8245e473d857@resize_w640_nl.webp", name: "Nhà cửa" },
        { img: "https://down-vn.img.susercontent.com/file/24b194a695ea59d384768b7b471d563f@resize_w640_nl.webp", name: "Du lịch" },
    ];

    return (
        <HomeLayout>
            <Head title="ShopNest - Trang chủ" />
            <div className="home-content">
                <CategoryCarousel categories={categories} />
                <FlashSaleSection />
                <TopSearchSection />
                <DailyDiscoverSection />
            </div>
        </HomeLayout>
    );
}