import React from 'react';
import FlashSaleCarousel from './FlashSaleCarousel';
import { useTranslation } from '../../../lib/i18n';

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

interface FlashSaleSectionProps {
    flashSale: FlashSale | null;
}

export default function FlashSaleSection({ flashSale }: FlashSaleSectionProps) {
    const { t } = useTranslation();

    if (!flashSale) {
        return null; // Don't render section if no flash sale
    }

    return (
        <div className="home-component">
            <div className="flash-sale-title">
                <h2>f<i className="bi bi-lightning-fill"></i>ash {t('Flash Sale').toLowerCase()}</h2>
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
                <FlashSaleCarousel products={flashSale.products} />
            </div>
        </div>
    );
}