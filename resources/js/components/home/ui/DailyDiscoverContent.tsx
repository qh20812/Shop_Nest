import React from 'react';
import { router } from '@inertiajs/react';
import DailyDiscoverCard from './DailyDiscoverCard';

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
    const handleProductClick = (product: Product) => {
        router.get(`/product/${product.id}`);
    };

    return (
        <div className="daily-discover-content">
            <div className="daily-discover-grid">
                {products.map((product) => {
                    const discountPercent = product.discount_price && product.price > product.discount_price
                        ? Math.round(((product.price - product.discount_price) / product.price) * 100)
                        : null;
                    return (
                        <DailyDiscoverCard
                            key={product.id}
                            image={product.image}
                            name={product.name}
                            discountPercent={discountPercent}
                            price={product.discount_price ?? product.price}
                            originalPrice={product.discount_price ? product.price : undefined}
                            rating={product.rating}
                            reviewCount={product.sold_count}
                            onClick={() => handleProductClick(product)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
