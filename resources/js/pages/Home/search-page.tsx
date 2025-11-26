import React, { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import HomeLayout from '@/layouts/app/HomeLayout';
import ProductCard from '@/Components/home/ui/ProductCard';
import '@/../css/home-style/search-page.css';

interface ProductCardData {
  id: number;
  image: string | null;
  name: string;
  rating: number | null;
  currentPrice: number | null;
  originalPrice?: number | null;
  isSale?: boolean;
  isNew?: boolean;
  favorited?: boolean;
}

interface ActiveFilters {
  search?: string;
  category_ids?: number[];
  brand_ids?: number[];
  price_min?: number | null;
  price_max?: number | null;
  rating_min?: number | null;
  states?: string[];
  sort?: string;
}

interface SearchPageProps {
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
  activeFilters: ActiveFilters;
}

export default function SearchPage() {
  const { props } = usePage();
  const { query, total, products, filters, activeFilters } = props as unknown as SearchPageProps;
  type FilterValue = string | number | boolean | null | (string | number | boolean | null)[];
  const updateFilters = (partial: Partial<ActiveFilters>) => {
    const merged = { ...activeFilters, ...partial, search: query };
    const next: Record<string, FilterValue> = {};
    Object.entries(merged).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        next[k] = v as (string | number | boolean | null)[];
      } else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null) {
        next[k] = v as FilterValue;
      }
    });
    router.get('/search', next, { preserveScroll: true });
  };
  const productList = products?.data || [];

  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [columns, setColumns] = useState<number>(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    if (w >= 1024) return 4;
    if (w >= 768) return 3;
    if (w >= 640) return 2;
    return 1;
  });
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    // update columns when width changes according to CSS breakpoints
    if (width >= 1024) setColumns(4);
    else if (width >= 768) setColumns(3);
    else if (width >= 640) setColumns(2);
    else setColumns(1);
  }, [width]);

  // items per page = 5 rows * columns per row
  const itemsPerPage = 5 * columns;
  const totalPages = Math.max(1, Math.ceil(productList.length / itemsPerPage));

  useEffect(() => {
    // reset page to 1 if columns change and current page would be out of range
    if (page > totalPages) setPage(1);
  }, [columns, totalPages, page]);

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleProducts = productList.slice(start, end);

  const showPagination = totalPages > 1;

  return (
    <HomeLayout>
      <div className="search-page">
        <header className="search-header" aria-labelledby="search-title">
          <div className="search-header-left">
            <h1 id="search-title" className="search-title">
              Kết quả tìm kiếm cho "{query}"
            </h1>
            <p className="search-count">
              Tìm thấy <span className="search-count-number">{total}</span> sản phẩm
            </p>
          </div>
          <div className="search-sort">
            <label htmlFor="sort" className="search-sort-label">Sắp xếp theo:</label>
            <select
              id="sort"
              className="search-sort-select"
              defaultValue={activeFilters?.sort || 'popular'}
              onChange={(e) => updateFilters({ sort: e.target.value })}
            >
              {filters?.sortOptions?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </header>

        <div className="search-layout">
          <aside className="filter-sidebar" aria-label="Bộ lọc sản phẩm">
            <div className="filter-group">
              <div className="filter-card">
                <h2 className="filter-title">Khoảng giá</h2>
                <div className="price-range">
                  <div className="price-range-track">
                    <div className="price-range-active" style={{ left: '10%', right: '40%' }} />
                    <button className="price-range-thumb" style={{ left: '10%' }} aria-label="Giá thấp" />
                    <button className="price-range-thumb" style={{ left: '60%' }} aria-label="Giá cao" />
                  </div>
                  <div className="price-inputs">
                    <input type="number" className="price-input" defaultValue={500000} aria-label="Giá tối thiểu" />
                    <span className="price-separator">-</span>
                    <input type="number" className="price-input" defaultValue={2000000} aria-label="Giá tối đa" />
                  </div>
                </div>
              </div>

              <div className="filter-card">
                <h2 className="filter-title">Danh mục</h2>
                <div className="filter-options scrollable">
                  {filters?.categories?.map(cat => (
                    <label key={cat.id} className="filter-option">
                      <input
                        type="checkbox"
                        defaultChecked={activeFilters?.category_ids?.includes(cat.id)}
                        onChange={(e) => {
                          const current = new Set(activeFilters?.category_ids || []);
                          if (e.target.checked) current.add(cat.id); else current.delete(cat.id);
                          updateFilters({ category_ids: Array.from(current) as number[] });
                        }}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-card">
                <h2 className="filter-title">Thương hiệu</h2>
                <div className="filter-options scrollable">
                  {filters?.brands?.map(brand => (
                    <label key={brand.id} className="filter-option">
                      <input
                        type="checkbox"
                        defaultChecked={activeFilters?.brand_ids?.includes(brand.id)}
                        onChange={(e) => {
                          const current = new Set(activeFilters?.brand_ids || []);
                          if (e.target.checked) current.add(brand.id); else current.delete(brand.id);
                          updateFilters({ brand_ids: Array.from(current) as number[] });
                        }}
                      />
                      <span>{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-card">
                <h2 className="filter-title">Đánh giá</h2>
                <div className="filter-options">
                  {filters?.ratingOptions?.map(r => (
                    <label key={r} className="filter-option rating-option">
                      <input
                        type="checkbox"
                        defaultChecked={activeFilters?.rating_min === r}
                        onChange={(e) => updateFilters({ rating_min: e.target.checked ? r : null })}
                      />
                      <span>{r} sao trở lên</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-card">
                <h2 className="filter-title">Tình trạng</h2>
                <div className="filter-options">
                  {filters?.states?.map(state => (
                    <label key={state} className="filter-option">
                      <input
                        type="checkbox"
                        defaultChecked={activeFilters?.states?.includes(state)}
                        onChange={(e) => {
                          const current = new Set(activeFilters?.states || []);
                          if (e.target.checked) current.add(state); else current.delete(state);
                          updateFilters({ states: Array.from(current) as string[] });
                        }}
                      />
                      <span>{state === 'new' ? 'Mới' : state === 'sale' ? 'Giảm giá' : state}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                className="filter-reset-btn"
                type="button"
                onClick={() => router.get('/search', { search: query })}
              >Xóa tất cả</button>
            </div>
          </aside>

          <section className="results-section" aria-label="Kết quả tìm kiếm">
            <div className="products-grid">
              {visibleProducts.map(p => (
                <ProductCard
                  key={p.id}
                  image={p.image || ''}
                  name={p.name}
                  rating={p.rating ?? 0}
                  currentPrice={p.currentPrice || 0}
                  originalPrice={p.originalPrice || undefined}
                  isSale={p.isSale}
                  isNew={p.isNew}
                  favorited={p.favorited}
                  href={`/product/${p.id}`}
                />
              ))}
            </div>

            {showPagination && (
              <nav className="pagination" aria-label="Pagination">
                <button className="page-btn" aria-label="Trang trước" onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    className={`page-btn ${page === idx + 1 ? 'active' : ''}`}
                    aria-current={page === idx + 1 ? 'page' : undefined}
                    onClick={() => setPage(idx + 1)}
                  >{idx + 1}</button>
                ))}
                <button className="page-btn" aria-label="Trang sau" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>›</button>
              </nav>
            )}
          </section>
        </div>
      </div>
    </HomeLayout>
  );
}
