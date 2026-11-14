import { Head, router, usePage } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import * as React from 'react';

import { ActiveFilters, type ActiveFilter } from '@/components/commerce/ActiveFilters';
import { CategoryPills } from '@/components/commerce/CategoryPills';
import { FilterGroup } from '@/components/commerce/FilterGroup';
import { FilterRail } from '@/components/commerce/FilterRail';
import { ProductGrid } from '@/components/commerce/ProductGrid';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Input from '@/components/ui/input';
import Pagination from '@/components/ui/Pagination';
import { SearchInput } from '@/components/ui/search-input';
import Select from '@/components/ui/select';
import { Sheet } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/toast';
import { useDisclosure } from '@/hooks/useDisclosure';
import { formatNumber, formatVnd } from '@/lib/format';
import type { ProductCardModel } from '@/types/commerce';

interface ProductCardData {
    id: number;
    image: string | null;
    name: string;
    rating: number | null;
    ratingCount?: number;
    currentPrice: number | null;
    originalPrice?: number | null;
    isSale?: boolean;
    isNew?: boolean;
    favorited?: boolean;
}

interface ActiveFiltersData {
    search?: string;
    category_ids?: number[];
    brand_ids?: number[];
    price_min?: number | null;
    price_max?: number | null;
    rating_min?: number | null;
    states?: string[];
    sort?: string;
    page?: number;
}

interface SearchPageProps extends Record<string, unknown> {
    query: string;
    total: number;
    products: {
        data: ProductCardData[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        categories: { id: number; name: string }[];
        brands: { id: number; name: string }[];
        ratingOptions: number[];
        states: string[];
        sortOptions: { value: string; label: string }[];
    };
    activeFilters: ActiveFiltersData;
}

type FilterValue = string | number | boolean | null | Array<string | number | boolean | null>;

function cleanParams(filters: ActiveFiltersData, query: string, page?: number): Record<string, FilterValue> {
    const search = filters.search !== undefined ? filters.search : query;
    const merged: ActiveFiltersData = { ...filters, search: search || undefined, page };
    const params: Record<string, FilterValue> = {};

    Object.entries(merged).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
            return;
        }

        if (Array.isArray(value) && value.length === 0) {
            return;
        }

        params[key] = value as FilterValue;
    });

    return params;
}

function toCard(product: ProductCardData): ProductCardModel {
    return {
        id: product.id,
        slug: String(product.id),
        name: product.name,
        image: product.image || '/image/default-product.png',
        imageAlt: product.name,
        shopName: product.isNew ? 'Shop mới' : 'Shop Việt',
        shopBadge: 'shop-viet',
        price: product.currentPrice ?? 0,
        compareAt: product.originalPrice ?? undefined,
        rating: product.rating ?? undefined,
        reviewCount: product.ratingCount ?? 0,
        badges: product.isSale ? ['sale'] : product.isNew ? ['new'] : undefined,
        stock: 'in',
    };
}

export default function SearchPage() {
    const { query, products, filters, activeFilters } = usePage<SearchPageProps>().props;
    const { success, error: showError } = useToast();
    const mobileFilters = useDisclosure();
    const [searchValue, setSearchValue] = React.useState(query ?? '');
    const [priceMin, setPriceMin] = React.useState(activeFilters.price_min ? String(activeFilters.price_min) : '');
    const [priceMax, setPriceMax] = React.useState(activeFilters.price_max ? String(activeFilters.price_max) : '');
    const selectedCategoryIds = (activeFilters.category_ids ?? []).map(Number);
    const selectedBrandIds = (activeFilters.brand_ids ?? []).map(Number);
    const selectedStates = activeFilters.states ?? [];

    React.useEffect(() => {
        setSearchValue(query ?? '');
        setPriceMin(activeFilters.price_min ? String(activeFilters.price_min) : '');
        setPriceMax(activeFilters.price_max ? String(activeFilters.price_max) : '');
    }, [query, activeFilters.price_min, activeFilters.price_max]);

    const updateFilters = (partial: Partial<ActiveFiltersData>, page?: number) => {
        router.get('/search', cleanParams({ ...activeFilters, ...partial }, query, page), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const clearAll = () => {
        router.get('/search', query ? { search: query } : {}, { preserveScroll: true });
    };

    const activeFilterItems: ActiveFilter[] = [];
    selectedCategoryIds.forEach((id) => {
        const category = filters.categories.find((item) => item.id === id);
        if (category) activeFilterItems.push({ key: `category-${id}`, label: 'Danh mục', value: category.name });
    });
    selectedBrandIds.forEach((id) => {
        const brand = filters.brands.find((item) => item.id === id);
        if (brand) activeFilterItems.push({ key: `brand-${id}`, label: 'Thương hiệu', value: brand.name });
    });
    if (activeFilters.price_min || activeFilters.price_max) {
        activeFilterItems.push({
            key: 'price',
            label: 'Giá',
            value: `${activeFilters.price_min ? formatVnd(activeFilters.price_min) : '0 ₫'} – ${activeFilters.price_max ? formatVnd(activeFilters.price_max) : 'Không giới hạn'}`,
        });
    }
    if (activeFilters.rating_min) {
        activeFilterItems.push({ key: 'rating', label: 'Đánh giá', value: `${activeFilters.rating_min} sao trở lên` });
    }
    selectedStates.forEach((state) => {
        activeFilterItems.push({ key: `state-${state}`, label: 'Tình trạng', value: state === 'new' ? 'Mới' : 'Giảm giá' });
    });

    const removeFilter = (key: string) => {
        if (key.startsWith('category-')) {
            const id = Number(key.replace('category-', ''));
            updateFilters({ category_ids: selectedCategoryIds.filter((value) => value !== id) });
            return;
        }
        if (key.startsWith('brand-')) {
            const id = Number(key.replace('brand-', ''));
            updateFilters({ brand_ids: selectedBrandIds.filter((value) => value !== id) });
            return;
        }
        if (key === 'price') {
            updateFilters({ price_min: null, price_max: null });
            return;
        }
        if (key === 'rating') {
            updateFilters({ rating_min: null });
            return;
        }
        if (key.startsWith('state-')) {
            const state = key.replace('state-', '');
            updateFilters({ states: selectedStates.filter((value) => value !== state) });
        }
    };

    const toggleNumberFilter = (key: 'category_ids' | 'brand_ids', id: number, checked: boolean) => {
        const current = new Set(key === 'category_ids' ? selectedCategoryIds : selectedBrandIds);
        if (checked) current.add(id);
        else current.delete(id);
        updateFilters({ [key]: Array.from(current) });
    };

    const toggleState = (state: string, checked: boolean) => {
        const current = new Set(selectedStates);
        if (checked) current.add(state);
        else current.delete(state);
        updateFilters({ states: Array.from(current) });
    };

    const applyPrice = () => {
        updateFilters({
            price_min: priceMin ? Number(priceMin) : null,
            price_max: priceMax ? Number(priceMax) : null,
        });
    };

    const productCards = products.data.map(toCard);

    const filterContent = (
        <>
            <FilterGroup title="Danh mục" count={selectedCategoryIds.length}>
                <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
                    {filters.categories.map((category) => (
                        <Checkbox
                            key={category.id}
                            checked={selectedCategoryIds.includes(category.id)}
                            onCheckedChange={(checked) => toggleNumberFilter('category_ids', category.id, checked === true)}
                            label={category.name}
                        />
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup title="Thương hiệu" count={selectedBrandIds.length}>
                <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
                    {filters.brands.map((brand) => (
                        <Checkbox
                            key={brand.id}
                            checked={selectedBrandIds.includes(brand.id)}
                            onCheckedChange={(checked) => toggleNumberFilter('brand_ids', brand.id, checked === true)}
                            label={brand.name}
                        />
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup title="Khoảng giá">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <InputPrice value={priceMin} onChange={setPriceMin} placeholder="Từ" />
                        <span className="text-ink-faint">–</span>
                        <InputPrice value={priceMax} onChange={setPriceMax} placeholder="Đến" />
                    </div>
                    <Button type="button" variant="secondary" size="sm" onClick={applyPrice}>
                        Áp dụng giá
                    </Button>
                </div>
            </FilterGroup>

            <FilterGroup title="Đánh giá">
                <div className="flex flex-col gap-2">
                    {filters.ratingOptions.map((rating) => (
                        <Checkbox
                            key={rating}
                            checked={activeFilters.rating_min === rating}
                            onCheckedChange={(checked) => updateFilters({ rating_min: checked === true ? rating : null })}
                            label={`${rating} sao trở lên`}
                        />
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup title="Tình trạng">
                <div className="flex flex-col gap-2">
                    {filters.states.map((state) => (
                        <Checkbox
                            key={state}
                            checked={selectedStates.includes(state)}
                            onCheckedChange={(checked) => toggleState(state, checked === true)}
                            label={state === 'new' ? 'Mới' : state === 'sale' ? 'Đang giảm giá' : state}
                        />
                    ))}
                </div>
            </FilterGroup>
        </>
    );

    return (
        <StorefrontLayout compactFooter>
            <Head title={query ? `Tìm kiếm: ${query}` : 'Tìm sản phẩm'} />

            <PageContainer className="py-8 md:py-10">
                <PageHeader
                    breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tìm kiếm' }]}
                    eyebrow={query ? 'Kết quả tìm kiếm' : 'Toàn bộ sản phẩm'}
                    title={query ? `Kết quả cho “${query}”` : 'Tìm món đồ cho tổ ấm'}
                    description={`Tìm thấy ${formatNumber(products.total)} món phù hợp.`}
                    actions={
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                            <SearchInput
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                onSubmit={(value) => updateFilters({ search: value })}
                                placeholder="Tìm laptop, nồi chiên, xe đẩy..."
                                className="sm:w-72"
                            />
                            <Select
                                value={activeFilters.sort ?? 'popular'}
                                onChange={(event) => updateFilters({ sort: event.target.value })}
                                options={filters.sortOptions}
                                className="sm:w-52"
                                aria-label="Sắp xếp sản phẩm"
                            />
                        </div>
                    }
                />

                <div className="mt-5 flex flex-col gap-4">
                    <CategoryPills
                        items={[
                            { value: '', label: 'Tất cả' },
                            ...filters.categories.map((category) => ({ value: category.id, label: category.name })),
                        ]}
                        value={selectedCategoryIds.length === 1 ? selectedCategoryIds[0] : ''}
                        onChange={(value) => updateFilters({ category_ids: value === '' ? [] : [Number(value)] })}
                    />
                    <ActiveFilters filters={activeFilterItems} onRemove={removeFilter} onClear={clearAll} />
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                    <div className="hidden lg:col-span-3 lg:block">
                        <FilterRail onClear={clearAll} activeCount={activeFilterItems.length}>
                            {filterContent}
                        </FilterRail>
                    </div>

                    <section className="lg:col-span-9" aria-label="Kết quả tìm kiếm">
                        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
                            <Button variant="secondary" size="sm" leftIcon={SlidersHorizontal} onClick={mobileFilters.open}>
                                Bộ lọc
                            </Button>
                            <span className="font-mono text-label-code text-ink-muted">{formatNumber(products.total)} món</span>
                        </div>

                        <ProductGrid
                            products={productCards}
                            columns={3}
                            onAddToCart={(product) => router.visit(`/product/${product.id}`)}
                            onToggleWishlist={(product) => {
                                router.post(
                                    `/user/wishlist/items/${product.id}`,
                                    {},
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => success('Đã lưu sản phẩm', product.name),
                                        onError: () => showError('Chưa thể lưu sản phẩm', 'Vui lòng đăng nhập để dùng danh sách yêu thích.'),
                                    },
                                );
                            }}
                        />

                        <Pagination
                            className="mt-8"
                            page={products.current_page}
                            pageCount={products.last_page}
                            total={products.total}
                            pageSize={products.per_page}
                            onPageChange={(page) => updateFilters({}, page)}
                        />
                    </section>
                </div>
            </PageContainer>

            <Sheet open={mobileFilters.isOpen} onOpenChange={mobileFilters.setOpen} side="bottom" title="Bộ lọc sản phẩm">
                <FilterRail onClear={clearAll} activeCount={activeFilterItems.length} className="border-0 bg-transparent p-0">
                    {filterContent}
                </FilterRail>
                <Button className="mt-4 w-full" onClick={mobileFilters.close}>
                    Xem {formatNumber(products.total)} kết quả
                </Button>
            </Sheet>
        </StorefrontLayout>
    );
}

function InputPrice({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
    return (
        <Input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            size="sm"
        />
    );
}
