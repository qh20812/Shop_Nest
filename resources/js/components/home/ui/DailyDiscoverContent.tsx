import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import DailyDiscoverCard from './DailyDiscoverCard';
import PopupAddToCart from './PopupAddToCart';
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
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<{
        id: number;
        name: string;
        image: string;
        quantity: number;
    } | null>(null);
    const toast = useToast();

    const handleProductClick = (productId: number) => {
        router.get(`/product/${productId}`);
    };

    const handleAddToCart = (product: Product) => {
        // Set selected product for popup
        setSelectedProduct({
            id: product.id,
            name: product.name,
            image: product.image,
            quantity: 1
        });
        
        // Show popup
        setIsPopupOpen(true);
        
        // Show toast notification
        toast.success(
            'Thêm vào giỏ hàng thành công!',
            'Sản phẩm đã được thêm vào giỏ hàng của bạn.'
        );
        
        // TODO: Implement actual add to cart API call
        console.log('Add to cart:', product);
    };

    const handleFavorite = (product: Product) => {
        // Show toast notification
        toast.info(
            'Đã thêm vào yêu thích!',
            `Sản phẩm "${product.name}" đã được thêm vào danh sách yêu thích.`
        );
        
        // TODO: Implement favorite logic
        console.log('Add to favorite:', product);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedProduct(null);
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
                                onAddToCart={() => handleAddToCart(product)}
                                onViewDetails={() => handleProductClick(product.id)}
                                onFavorite={() => handleFavorite(product)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Popup Add to Cart */}
            <PopupAddToCart
                isOpen={isPopupOpen}
                product={selectedProduct}
                onClose={handleClosePopup}
            />
        </>
    );
}
