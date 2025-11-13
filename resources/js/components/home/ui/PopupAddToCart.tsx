import React, { useEffect } from 'react';
import '@/../css/PopupAddToCart.css';
import { router } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    image: string;
    quantity: number;
}

interface PopupAddToCartProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
}

export default function PopupAddToCart({ isOpen, product, onClose }: PopupAddToCartProps) {
    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when popup is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        // Close popup when pressing ESC key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleGoToCart = () => {
        router.get('/cart');
        onClose();
    };

    const handleContinueShopping = () => {
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Close popup when clicking on overlay (not on modal content)
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !product) {
        return null;
    }

    return (
        <div className="popup-overlay" onClick={handleOverlayClick}>
            <div className="popup-modal">
                {/* Close Button */}
                <button 
                    className="popup-close-btn"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    <i className="bi bi-x popup-close-icon"></i>
                </button>

                {/* Modal Content */}
                <div className="popup-content">
                    {/* Success Icon */}
                    <div className="popup-success-icon-wrapper">
                        <i className="bi bi-check-circle-fill popup-success-icon"></i>
                    </div>

                    {/* Headline Text */}
                    <h3 className="popup-headline">
                        Đã thêm vào giỏ hàng thành công!
                    </h3>

                    {/* Product Information Card */}
                    <div className="popup-product-card">
                        <div className="popup-product-info">
                            <div 
                                className="popup-product-image"
                                style={{ backgroundImage: `url(${product.image})` }}
                                role="img"
                                aria-label={product.name}
                            />
                            <div className="popup-product-details">
                                <p className="popup-product-name">{product.name}</p>
                                <p className="popup-product-quantity">
                                    Số lượng: {product.quantity}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Button Group */}
                    <div className="popup-button-group">
                        <button 
                            className="popup-btn popup-btn-primary"
                            onClick={handleGoToCart}
                        >
                            <span className="popup-btn-text">Đi đến giỏ hàng</span>
                        </button>
                        <button 
                            className="popup-btn popup-btn-secondary"
                            onClick={handleContinueShopping}
                        >
                            <span className="popup-btn-text">Tiếp tục mua sắm</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
