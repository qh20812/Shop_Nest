import React, { useEffect, useState } from 'react';
import HomeLayout from '@/layouts/app/HomeLayout';
import ProductCard from '@/Components/home/ui/ProductCard';
import '@/../css/home-style/search-page.css';

interface MockProduct {
  id: number;
  image: string;
  name: string;
  rating: number;
  currentPrice: number;
  originalPrice?: number;
  isSale?: boolean;
  isNew?: boolean;
  favorited?: boolean;
}

const mockProducts: MockProduct[] = [
  {
    id: 1,
    image: 'https://via.placeholder.com/480x360?text=Sneaker+1',
    name: 'Modern Athletic Sneaker',
    rating: 4.5,
    currentPrice: 890000,
    originalPrice: 1290000,
    isSale: true,
    isNew: false,
    favorited: false,
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/480x360?text=High+Top',
    name: 'Retro High-Tops',
    rating: 4.2,
    currentPrice: 990000,
    originalPrice: 1190000,
    isSale: true,
    isNew: true,
    favorited: true,
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/480x360?text=Canvas',
    name: 'Minimalist Canvas Shoe',
    rating: 4.0,
    currentPrice: 550000,
    originalPrice: 0,
    isSale: false,
    isNew: true,
    favorited: false,
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/480x360?text=Trail',
    name: 'Trail Runner Pro',
    rating: 4.7,
    currentPrice: 1590000,
    originalPrice: 1890000,
    isSale: true,
    isNew: false,
    favorited: false,
  },
  {
    id: 5,
    image: 'https://via.placeholder.com/480x360?text=Leather',
    name: 'Classic Leather Loafers',
    rating: 4.3,
    currentPrice: 1250000,
    originalPrice: 0,
    isSale: false,
    isNew: false,
    favorited: false,
  },
  {
    id: 6,
    image: 'https://via.placeholder.com/480x360?text=Boots',
    name: 'Urban Explorer Boots',
    rating: 4.6,
    currentPrice: 1850000,
    originalPrice: 2150000,
    isSale: true,
    isNew: false,
    favorited: true,
  },
  {
    id: 7,
    image: 'https://via.placeholder.com/480x360?text=Runner',
    name: 'Lightweight Runner',
    rating: 4.1,
    currentPrice: 790000,
    originalPrice: 990000,
    isSale: true,
    isNew: true,
    favorited: false,
  },
  {
    id: 8,
    image: 'https://via.placeholder.com/480x360?text=Comfort',
    name: 'Comfort Everyday Shoe',
    rating: 4.8,
    currentPrice: 1390000,
    originalPrice: 0,
    isSale: false,
    isNew: true,
    favorited: false,
  }
];

export default function SearchPage() {
  // Static query & count placeholders (simulate search result)
  const query = 'Giày thể thao';
  const total = mockProducts.length;

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
  const totalPages = Math.max(1, Math.ceil(mockProducts.length / itemsPerPage));

  useEffect(() => {
    // reset page to 1 if columns change and current page would be out of range
    if (page > totalPages) setPage(1);
  }, [columns, totalPages, page]);

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleProducts = mockProducts.slice(start, end);

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
            <select id="sort" className="search-sort-select" defaultValue="popular">
              <option value="popular">Phổ biến nhất</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="newest">Mới nhất</option>
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
                  {['Sneaker', 'Boot', 'Sandal', 'Loafer', 'Canvas', 'Trail'].map(cat => (
                    <label key={cat} className="filter-option">
                      <input type="checkbox" />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-card">
                <h2 className="filter-title">Thương hiệu</h2>
                <div className="filter-options scrollable">
                  {['Nike', 'Adidas', 'Puma', 'New Balance', 'Asics', 'Reebok'].map(brand => (
                    <label key={brand} className="filter-option">
                      <input type="checkbox" />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-card">
                <h2 className="filter-title">Đánh giá</h2>
                <div className="filter-options">
                  {[5,4,3].map(r => (
                    <label key={r} className="filter-option rating-option">
                      <input type="checkbox" />
                      <span>{r} sao trở lên</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-card">
                <h2 className="filter-title">Tình trạng</h2>
                <div className="filter-options">
                  {['Mới', 'Giảm giá'].map(state => (
                    <label key={state} className="filter-option">
                      <input type="checkbox" />
                      <span>{state}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="filter-apply-btn" type="button">Áp dụng</button>
              <button className="filter-reset-btn" type="button">Xóa tất cả</button>
            </div>
          </aside>

          <section className="results-section" aria-label="Kết quả tìm kiếm">
            <div className="products-grid">
              {visibleProducts.map(p => (
                <ProductCard
                  key={p.id}
                  image={p.image}
                  name={p.name}
                  rating={p.rating}
                  currentPrice={p.currentPrice}
                  originalPrice={p.originalPrice}
                  isSale={p.isSale}
                  isNew={p.isNew}
                  favorited={p.favorited}
                  href={`#product-${p.id}`}
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
