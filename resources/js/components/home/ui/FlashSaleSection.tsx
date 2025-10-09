import React from 'react';
import FlashSaleCarousel from './FlashSaleCarousel';

export default function FlashSaleSection() {
    return (
        <div className="home-component">
            <div className="flash-sale-title">
                <h2>f<i className="bi bi-lightning-fill"></i>ash sale</h2>
                <div className="flash-sale-timer">
                    {/* giờ */}
                    <div className="timer">00</div>
                    {/* phút */}
                    <div className="timer">03</div>
                    {/* giây */}
                    <div className="timer">59</div>
                </div>
            </div>
            <div className="flash-sale-content">
                <FlashSaleCarousel />
            </div>
        </div>
    );
}