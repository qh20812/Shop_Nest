import React from 'react';
import { Head } from '@inertiajs/react';
import HomeLayout from '../../layouts/app/HomeLayout';
import CategoryCarousel from '@/components/home/ui/CategoryCarousel';
import FlashSaleSection from '@/components/home/ui/FlashSaleSection';
import DailyDiscoverSection from '@/components/home/ui/DailyDiscoverSection';

interface Category {
    id: number;
    name: string;
    img: string;
}

interface FlashSaleProduct {
    id: number;
    name: string;
    image: string;
    original_price: number;
    flash_sale_price: number;
    discount_percentage: number;
    sold_count: number;
    quantity_limit: number;
    remaining_quantity: number;
}

interface FlashSaleEvent {
    id: number;
    name: string;
    end_time: string;
    banner_image?: string;
}

interface FlashSale {
    event: FlashSaleEvent;
    products: FlashSaleProduct[];
}

interface DailyDiscoverProduct {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    discount_price?: number;
    category: string;
    brand: string;
    rating: number;
    sold_count: number;
}

interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
}

interface HomeProps {
    categories: Category[];
    flashSale: FlashSale | null;
    dailyDiscover: DailyDiscoverProduct[];
    user: User | null;
}

export default function Home({ categories, flashSale, dailyDiscover, user }: HomeProps) {

    return (
        <HomeLayout>
            <Head title="ShopNest - Trang chủ" />
            <div className="home-content">
                <CategoryCarousel categories={categories} />
                <FlashSaleSection flashSale={flashSale} />
                <DailyDiscoverSection products={dailyDiscover} user={user} />
            </div>
        </HomeLayout>
    );
}