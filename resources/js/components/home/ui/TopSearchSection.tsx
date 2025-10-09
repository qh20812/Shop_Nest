import React from 'react';
import FlashSaleCarousel from './FlashSaleCarousel';

export default function TopSearchSection() {
    return (
        <div className="home-component">
            <div className="top-search-title">
                <h2>tìm kiếm hàng đầu</h2>
            </div>
            <div className="top-search-content">
                <FlashSaleCarousel />
            </div>
        </div>
    );
}