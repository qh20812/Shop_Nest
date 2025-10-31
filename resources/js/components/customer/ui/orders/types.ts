export type OrderStatusTheme = 'pending' | 'processing' | 'completed' | 'cancelled';

export type OrderItem = {
  order_item_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_snapshot: {
    product_id?: number | null;
    name: string | null;
    slug?: string | null;
    image_url?: string | null;
  };
};

export type OrderGroup = {
  seller: {
    id: number | null;
    shop_id?: number | null;
    user_id?: number | null;
    slug?: string | null;
    name: string;
    avatar?: string | null;
  };
  items: OrderItem[];
};

export type OrderSummary = {
  order_id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  grouped_items: OrderGroup[];
};
