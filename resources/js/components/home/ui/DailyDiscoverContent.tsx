import React, { useState, useEffect } from 'react';
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
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    // Try to fetch user's current wishlist items on mount
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/user/wishlist/items');
                if (res.status === 401) {
                    // Not logged in
                    return;
                }
                const data = await res.json();
                if (data.items && Array.isArray(data.items)) {
                    setFavorites(new Set(data.items));
                }
            } catch (err) {
                console.error('Failed to load wishlist', err);
            }
        };
        load();
    }, []);

    const handleFavorite = (product: Product) => {
        // Optimistically update favorite state and persist to server
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(product.id)) {
                next.delete(product.id);
                toast.info('Đã xóa khỏi yêu thích', `Sản phẩm "${product.name}" đã được xóa khỏi danh sách ưu thích.`);
                // remove from server
                (async () => {
                    try {
                        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                        const res = await fetch(`/user/wishlist/items/${product.id}`, {
                            method: 'DELETE',
                            headers: { 'X-CSRF-TOKEN': csrf }
                        });
                        if (res.status === 401) {
                            const data = await res.json();
                            if (data.redirect) window.location.href = data.redirect;
                        }
                    } catch (err) {
                        console.error('Failed to remove from wishlist', err);
                    }
                })();
            } else {
                next.add(product.id);
                toast.success('Đã thêm vào yêu thích', `Sản phẩm "${product.name}" đã được thêm vào danh sách ưu thích.`);
                // persist to server
                (async () => {
                    try {
                        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                        const res = await fetch(`/user/wishlist/items/${product.id}`, {
                            method: 'POST',
                            headers: { 'X-CSRF-TOKEN': csrf }
                        });
                        if (res.status === 401) {
                            const data = await res.json();
                            if (data.redirect) window.location.href = data.redirect;
                        }
                    } catch (err) {
                        console.error('Failed to add to wishlist', err);
                    }
                })();
            }
            return next;
        });
        
        // TODO: Persist to server via API
        console.log('Toggled favorite:', product.id);
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
                                favorited={favorites.has(product.id)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Popup Add to Cart has been removed from Daily Discover - add-to-cart is handled on the product detail page */}
        </>
    );
}
