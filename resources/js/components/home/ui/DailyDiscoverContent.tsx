import React from 'react';
import DailyDiscoverCard from './DailyDiscoverCard';
import { useToast } from '@/Contexts/ToastContext';

interface Product {
    id: number;
    image: string;
    name: string;
    price: number;
    discount_price?: number;
    rating: number;
    sold_count: number;
}

interface DailyDiscoverContentProps {
    products: Product[];
}

export default function DailyDiscoverContent({ products }: DailyDiscoverContentProps) {
    const toast = useToast();

    const handleFavorite = (product: Product) => {
        // Show toast notification
        toast.info(
            'Đã thêm vào yêu thích!',
            `Sản phẩm "${product.name}" đã được thêm vào danh sách yêu thích.`
        );
        
        // TODO: Implement favorite logic
        console.log('Add to favorite:', product);
    };

    

    return (
        <>
            <div className="daily-discover-content">
                <div className="daily-discover-grid">
                    {products.map((product) => {
                        const hasDiscount = product.discount_price && product.price > product.discount_price;
                        const currentPrice = product.discount_price ?? product.price;
                        const originalPrice = hasDiscount ? product.price : undefined;
                        
                        return (
                            <DailyDiscoverCard
                                key={product.id}
                                image={product.image}
                                name={product.name}
                                rating={product.rating}
                                currentPrice={currentPrice}
                                originalPrice={originalPrice}
                                isSale={!!hasDiscount}
                                isNew={false}
                                href={`/product/${product.id}`}
                                onFavorite={() => handleFavorite(product)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Popup Add to Cart has been removed from Daily Discover - add-to-cart is handled on the product detail page */}
        </>
    );
}
