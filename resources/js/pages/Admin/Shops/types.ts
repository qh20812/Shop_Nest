export type ShopStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export interface Shop {
  id: number;
  name?: string | null;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  shop_status: ShopStatus;
  shop_logo?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  created_at: string;
  approved_at?: string | null;
  last_activity?: string | null;
  products_count: number;
  orders_count: number;
  total_revenue: number;
  open_violations_count?: number;
  items_sold?: number;
}

export interface ShopCollection {
  data: Shop[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
  links?: Array<{ url: string | null; label: string; active: boolean }>;
}

export interface ShopFilters {
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  sort?: string;
  direction?: string;
  per_page?: number;
}

export interface ShopMetrics {
  total?: number;
  active?: number;
  pending?: number;
  suspended?: number;
  rejected?: number;
}
