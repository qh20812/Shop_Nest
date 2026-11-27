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
import Pagination from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import Select from '@/components/ui/select';
import { Sheet } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/toast';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useMoney } from '@/hooks/useMoney';
import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import type { ProductCardModel } from '@/types/commerce';

import styles from './Search.module.css';

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
    auth?: {
        user: { id: number } | null;
    } | null;
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
        shopName: '',
        price: product.currentPrice ?? 0,
        compareAt: product.originalPrice ?? undefined,
        rating: product.rating ?? undefined,
        reviewCount: product.ratingCount ?? 0,
        badges: product.isSale ? ['sale'] : product.isNew ? ['new'] : undefined,
        stock: 'in',
    };
}

export default function SearchPage() {
    const { query, products, filters, activeFilters, auth } = usePage<SearchPageProps>().props;
    const { money } = useMoney();
    const { t } = useTranslation();
    const { success, error: showError, info } = useToast();
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
        if (category) activeFilterItems.push({ key: `category-${id}`, label: t('Categories'), value: category.name });
    });
    selectedBrandIds.forEach((id) => {
        const brand = filters.brands.find((item) => item.id === id);
        if (brand) activeFilterItems.push({ key: `brand-${id}`, label: t('Brand'), value: brand.name });
    });
    if (activeFilters.price_min || activeFilters.price_max) {
        activeFilterItems.push({
            key: 'price',
            label: t('Price'),
            value: `${activeFilters.price_min ? money(activeFilters.price_min) : money(0)} - ${activeFilters.price_max ? money(activeFilters.price_max) : t('No limit')}`,
        });
    }
    if (activeFilters.rating_min) {
        activeFilterItems.push({ key: 'rating', label: t('Rating'), value: `${activeFilters.rating_min} ${t('stars and up')}` });
    }
    selectedStates.forEach((state) => {
        activeFilterItems.push({ key: `state-${state}`, label: t('Condition'), value: state === 'new' ? t('New') : t('On sale') });
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
            {filters.categories.length > 0 && (
                <FilterGroup title={t('Categories')} count={selectedCategoryIds.length}>
                    <div className={styles.filterList}>
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
            )}

            {filters.brands.length > 0 && (
                <FilterGroup title={t('Brand')} count={selectedBrandIds.length}>
                    <div className={styles.filterList}>
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
            )}

            <FilterGroup title={t('Price range')}>
                <div className={styles.priceRow}>
                    <InputPrice value={priceMin} onChange={setPriceMin} placeholder={t('From')} />
                    <span className={styles.priceSeparator}>-</span>
                    <InputPrice value={priceMax} onChange={setPriceMax} placeholder={t('To')} />
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={applyPrice}>
                    {t('Apply price')}
                </Button>
            </FilterGroup>

            {filters.ratingOptions.length > 0 && (
                <FilterGroup title={t('Rating')}>
                    <div className={styles.filterList}>
                        {filters.ratingOptions.map((rating) => (
                            <Checkbox
                                key={rating}
                                checked={activeFilters.rating_min === rating}
                                onCheckedChange={(checked) => updateFilters({ rating_min: checked === true ? rating : null })}
                                label={`${rating} ${t('stars and up')}`}
                            />
                        ))}
                    </div>
                </FilterGroup>
            )}

            {filters.states.length > 0 && (
                <FilterGroup title={t('Condition')}>
                    <div className={styles.filterList}>
                        {filters.states.map((state) => (
                            <Checkbox
                                key={state}
                                checked={selectedStates.includes(state)}
                                onCheckedChange={(checked) => toggleState(state, checked === true)}
                                label={state === 'new' ? t('New') : state === 'sale' ? t('On sale') : state}
                            />
                        ))}
                    </div>
                </FilterGroup>
            )}
        </>
    );

    return (
        <StorefrontLayout compactFooter>
            <Head title={query ? t('Search: :query', { query }) : t('Search products')} />

            <PageContainer className={styles.page}>
                <PageHeader
                    breadcrumbs={[{ label: t('Market'), href: '/' }, { label: t('Search') }]}
                    eyebrow={query ? t('Search results') : t('All products')}
                    title={query ? t('Results for “:query”', { query }) : t('Find something for your home')}
                    description={t(':count items found.', { count: formatNumber(products.total) })}
                    actions={
                        <div className={styles.headerActions}>
                            <SearchInput
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                onSubmit={(value) => updateFilters({ search: value })}
                                placeholder={t('Search for laptops, air fryers, strollers...')}
                                className={styles.searchField}
                            />
                            <Select
                                value={activeFilters.sort ?? 'popular'}
                                onChange={(event) => updateFilters({ sort: event.target.value })}
                                options={filters.sortOptions}
                                className={styles.sortField}
                                aria-label={t('Sort products')}
                            />
                        </div>
                    }
                />

                <div className={styles.toolbar}>
                    <CategoryPills
                        items={[
                            { value: '', label: t('All') },
                            ...filters.categories.map((category) => ({ value: category.id, label: category.name })),
                        ]}
                        value={selectedCategoryIds.length === 1 ? selectedCategoryIds[0] : ''}
                        onChange={(value) => updateFilters({ category_ids: value === '' ? [] : [Number(value)] })}
                    />
                    <ActiveFilters filters={activeFilterItems} onRemove={removeFilter} onClear={clearAll} />
                </div>

                <div className={styles.layout}>
                    <div className={styles.rail}>
                        <FilterRail onClear={clearAll} activeCount={activeFilterItems.length}>
                            {filterContent}
                        </FilterRail>
                    </div>

                    <section className={styles.results} aria-label={t('Search results')}>
                        <div className={styles.mobileBar}>
                            <Button variant="secondary" size="sm" leftIcon={SlidersHorizontal} onClick={mobileFilters.open}>
                                {t('Filters')}
                            </Button>
                            <span className={styles.mobileCount}>{t(':count results', { count: formatNumber(products.total) })}</span>
                        </div>

                        <ProductGrid
                            products={productCards}
                            columns={3}
                            onAddToCart={(product) => {
                                info(t('Choose a product variant'), product.name);
                                router.visit(`/product/${product.id}`);
                            }}
                            onToggleWishlist={(product) => {
                                if (!auth?.user) {
                                    router.visit('/login');

                                    return;
                                }

                                router.post(
                                    `/user/wishlist/items/${product.id}`,
                                    {},
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => success(t('Saved to your wishlist'), product.name),
                                        onError: () => showError(t('Could not save this item'), t('Sign in to use your wishlist.')),
                                    },
                                );
                            }}
                        />

                        <Pagination
                            className={styles.pagination}
                            page={products.current_page}
                            pageCount={products.last_page}
                            total={products.total}
                            pageSize={products.per_page}
                            onPageChange={(page) => updateFilters({}, page)}
                        />
                    </section>
                </div>
            </PageContainer>

            <Sheet
                open={mobileFilters.isOpen}
                onOpenChange={mobileFilters.setOpen}
                side="bottom"
                title={t('Product filters')}
                footer={
                    <Button className={styles.sheetAction} onClick={mobileFilters.close}>
                        {t('View :count results', { count: formatNumber(products.total) })}
                    </Button>
                }
            >
                <FilterRail variant="sheet" onClear={clearAll} activeCount={activeFilterItems.length}>
                    {filterContent}
                </FilterRail>
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
