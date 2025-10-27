import React from 'react';
import DailyDiscoverContent from './DailyDiscoverContent';
import { useTranslation } from '../../../lib/i18n';

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

interface DailyDiscoverSectionProps {
    products: DailyDiscoverProduct[];
}

export default function DailyDiscoverSection({ products }: DailyDiscoverSectionProps) {
    const { t } = useTranslation();

    return (
        <div className="home-component">
            <div className="daily-discover-title">
                <h2>{t('Daily Discover')}</h2>
            </div>
            <DailyDiscoverContent products={products} />
        </div>
    );
}