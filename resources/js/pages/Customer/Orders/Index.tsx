import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CustomerLayout from '@/layouts/app/CustomerLayout';
import { router, usePage } from '@inertiajs/react';
import OrdersHeader from '@/Components/customer/ui/orders/OrdersHeader';
import OrdersTabs, { OrdersTabEntry } from '@/Components/customer/ui/orders/OrdersTabs';
import OrdersSearchBar from '@/Components/customer/ui/orders/OrdersSearchBar';
import OrdersList from '@/Components/customer/ui/orders/OrdersList';
import { OrderStatusTheme, OrderSummary } from '@/Components/customer/ui/orders/types';

type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

type OrdersPagination = {
  data: OrderSummary[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  links: PaginationLink[];
};

type FiltersPayload = {
  status?: string[] | string | null;
  date_from?: string | null;
  date_to?: string | null;
  search?: string | null;
  sort?: string | null;
};

type PageProps = {
  orders: OrdersPagination;
  filters?: FiltersPayload;
  tabCounts: Record<string, number>;
  totalSpent: number;
};

const ORDERS_ENDPOINT = '/user/orders';

type QueryParameterValue = string | number | boolean | null | string[] | number[];
type QueryParams = Record<string, QueryParameterValue>;

const tabLabelMap: Record<string, string> = {
  all: 'Tất cả',
  pending_confirmation: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  returned_refunded: 'Trả/Hoàn tiền',
};

const orderStatusLabelMap: Record<string, string> = {
  pending_confirmation: 'Chờ xác nhận',
  pending_assignment: 'Chờ phân tài xế',
  processing: 'Đang xử lý',
  assigned_to_shipper: 'Đã giao cho tài xế',
  delivering: 'Đang giao',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  returned: 'Đã trả',
  returned_refunded: 'Đã hoàn tiền',
};

const orderStatusThemeMap: Record<string, OrderStatusTheme> = {
  pending_confirmation: 'pending',
  pending_assignment: 'processing',
  processing: 'processing',
  assigned_to_shipper: 'processing',
  delivering: 'processing',
  shipped: 'processing',
  delivered: 'completed',
  completed: 'completed',
  cancelled: 'cancelled',
  returned: 'cancelled',
  returned_refunded: 'cancelled',
};

const defaultTabOrder = ['all', 'pending_confirmation', 'processing', 'shipped', 'delivered', 'cancelled', 'returned_refunded'];

const normalizeQuery = (input: Record<string, QueryParameterValue | undefined>): QueryParams => {
  const result: Record<string, QueryParameterValue> = {};

  Object.entries(input).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    result[key] = value;
  });

  return result;
};

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDateTime = (timestamp: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));

const resolveStatusLabel = (status: string) =>
  orderStatusLabelMap[status] ?? status.replace(/_/g, ' ');

const resolveStatusTheme = (status: string): OrderStatusTheme =>
  orderStatusThemeMap[status] ?? 'processing';

const Index: React.FC = () => {
  const { orders, filters: filtersFromServer, tabCounts, totalSpent } = usePage<PageProps>().props;

  const normalizedStatus = useMemo(() => {
    if (!filtersFromServer?.status) {
      return [] as string[];
    }

    if (Array.isArray(filtersFromServer.status)) {
      return filtersFromServer.status.filter((value): value is string => typeof value === 'string' && value.length > 0);
    }

    if (typeof filtersFromServer.status === 'string' && filtersFromServer.status.length > 0) {
      return [filtersFromServer.status];
    }

    return [] as string[];
  }, [filtersFromServer?.status]);

  const mergedFilters = useMemo(() => ({
    date_from: filtersFromServer?.date_from ?? null,
    date_to: filtersFromServer?.date_to ?? null,
    sort: filtersFromServer?.sort ?? null,
    search: filtersFromServer?.search ?? null,
    status: normalizedStatus,
  }), [filtersFromServer?.date_from, filtersFromServer?.date_to, filtersFromServer?.search, filtersFromServer?.sort, normalizedStatus]);

  const activeTab = normalizedStatus[0] ?? 'all';
  const [searchValue, setSearchValue] = useState<string>(filtersFromServer?.search ?? '');
  const [orderCollection, setOrderCollection] = useState<OrderSummary[]>(orders?.data ?? []);
  const [hasMore, setHasMore] = useState<boolean>((orders?.current_page ?? 1) < (orders?.last_page ?? 1));
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const appendModeRef = useRef(false);

  useEffect(() => {
    setSearchValue(filtersFromServer?.search ?? '');
  }, [filtersFromServer?.search]);

  useEffect(() => {
    if (!orders) {
      setOrderCollection([]);
      setHasMore(false);
      appendModeRef.current = false;
      setIsLoadingMore(false);
      return;
    }

    if (appendModeRef.current) {
      setOrderCollection((prev) => [...prev, ...orders.data]);
    } else {
      setOrderCollection(orders.data);
    }

    setHasMore(orders.current_page < orders.last_page);
    appendModeRef.current = false;
    setIsLoadingMore(false);
  }, [orders]);

  const sanitizedSearch = useMemo(() => searchValue.trim(), [searchValue]);

  const createQueryParams = useCallback((overrides: Record<string, QueryParameterValue | undefined> = {}): QueryParams => {
    const baseQuery: Record<string, QueryParameterValue | undefined> = {
      date_from: mergedFilters.date_from,
      date_to: mergedFilters.date_to,
      sort: mergedFilters.sort,
      status: mergedFilters.status,
      search: sanitizedSearch,
    };

    Object.entries(overrides).forEach(([key, value]) => {
      baseQuery[key] = value;
    });

    return normalizeQuery(baseQuery);
  }, [mergedFilters.date_from, mergedFilters.date_to, mergedFilters.sort, mergedFilters.status, sanitizedSearch]);

  const handleTabClick = useCallback(
    (tabKey: string) => {
      if (tabKey === activeTab) {
        return;
      }

      appendModeRef.current = false;

      const query = createQueryParams({
        status: tabKey === 'all' ? [] : [tabKey],
        page: 1,
      });

      router.visit(ORDERS_ENDPOINT, {
        method: 'get',
        data: query,
        preserveScroll: true,
        preserveState: true,
        replace: true,
      });
    },
    [activeTab, createQueryParams],
  );

  const handleSearchSubmit = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      appendModeRef.current = false;

      const query = createQueryParams({ page: 1 });

      router.visit(ORDERS_ENDPOINT, {
        method: 'get',
        data: query,
        preserveScroll: true,
        preserveState: true,
        replace: true,
      });
    },
    [createQueryParams],
  );

  const handleLoadMore = useCallback(() => {
    if (!orders || isLoadingMore || !hasMore) {
      return;
    }

    const nextPage = orders.current_page + 1;
    if (nextPage > orders.last_page) {
      setHasMore(false);
      return;
    }

    appendModeRef.current = true;
    setIsLoadingMore(true);

    const query = createQueryParams({ page: nextPage });

    router.visit(ORDERS_ENDPOINT, {
      method: 'get',
      data: query,
      preserveScroll: true,
      preserveState: true,
      only: ['orders'],
      onError: () => {
        appendModeRef.current = false;
        setIsLoadingMore(false);
      },
    });
  }, [createQueryParams, hasMore, isLoadingMore, orders]);

  const handleCancelOrder = useCallback((orderId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    router.post(`${ORDERS_ENDPOINT}/${orderId}/cancel`, {}, {
      preserveScroll: true,
    });
  }, []);

  const handleReorder = useCallback((orderId: number) => {
    router.post(`${ORDERS_ENDPOINT}/${orderId}/reorder`, {}, {
      preserveScroll: true,
    });
  }, []);

  const handleInvoiceDownload = useCallback((orderId: number) => {
    window.open(`${ORDERS_ENDPOINT}/${orderId}/invoice`, '_blank', 'noopener');
  }, []);

  const tabEntries = useMemo<OrdersTabEntry[]>(() => {
    const existingKeys = Object.keys(tabCounts);
    const primaryOrder = defaultTabOrder.filter((key) => existingKeys.includes(key));
    const remainingKeys = existingKeys.filter((key) => !primaryOrder.includes(key));

    return [...primaryOrder, ...remainingKeys].map((key) => ({
      key,
      label: tabLabelMap[key] ?? key.replace(/_/g, ' '),
      count: tabCounts[key] ?? 0,
    }));
  }, [tabCounts]);

  return (
    <CustomerLayout>
      <div className="orders-page" aria-labelledby="orders-page-title">
        <OrdersHeader totalSpentLabel={formatPrice(totalSpent ?? 0)} />

        <OrdersTabs tabs={tabEntries} activeTab={activeTab} onTabClick={handleTabClick} />

        <OrdersSearchBar value={searchValue} onValueChange={setSearchValue} onSubmit={handleSearchSubmit} />

        <section className="orders-list" aria-label="Danh sách đơn hàng">
          {orderCollection.length === 0 ? (
            <p className="orders-empty" role="status">
              Hiện chưa có đơn hàng phù hợp với điều kiện tìm kiếm.
            </p>
          ) : (
            <OrdersList
              orders={orderCollection}
              ordersEndpoint={ORDERS_ENDPOINT}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              formatPrice={formatPrice}
              formatDateTime={formatDateTime}
              resolveStatusLabel={resolveStatusLabel}
              resolveStatusTheme={resolveStatusTheme}
              onCancel={handleCancelOrder}
              onReorder={handleReorder}
              onDownloadInvoice={handleInvoiceDownload}
            />
          )}
        </section>
      </div>
    </CustomerLayout>
  );
};

export default Index;
