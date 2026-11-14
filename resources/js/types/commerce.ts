export type ProductCategory = 'tech' | 'appliance' | 'home' | 'baby' | 'fashion' | 'beauty';

export type ShopBadge = 'shop-viet' | 'verified' | 'official';

export type ProductBadge = 'sale' | 'new' | 'fast-ship' | 'official' | 'low-stock';

export type StockStatus = 'in' | 'low' | 'out';

export type ProductCardModel = {
    id: number | string;
    slug: string;
    name: string;
    image: string;
    imageAlt?: string;
    shopName: string;
    shopBadge?: ShopBadge;
    price: number;
    compareAt?: number;
    rating?: number;
    reviewCount?: number;
    metadata?: string;
    badges?: ProductBadge[];
    stock?: StockStatus;
    category?: ProductCategory;
};

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled' | 'returned' | 'refunded';

export type StatusTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export type OrderSummaryTotals = {
    subtotal: number;
    discount?: number;
    shipping?: number;
    total: number;
    itemCount?: number;
};
