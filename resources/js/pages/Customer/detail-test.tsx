import React from 'react';
import HomeLayout from '@/layouts/app/HomeLayout';
import '@/../css/ProductDetail.css';

export default function DetailTest() {
  // Sample data for UI-only rendering
  const product = {
    id: 1,
    name: 'Premium Cotton Crewneck T-Shirt',
    brand: 'Nest Apparel',
    rating: 4.9,
    ratingCount: 1288,
    sold: '5.4k',
    originalPrice: 399900, // VND cents-like
    currentPrice: 199900,
    colors: [
      { key: 'white', label: 'White', swatch: '#ffffff' },
      { key: 'black', label: 'Black', swatch: '#000000' },
      { key: 'gray', label: 'Gray', swatch: '#888888' },
      { key: 'blue', label: 'Blue', swatch: '#1976D2' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDSr0x3PxLjATXuTfPtzDb4I1IQWSUzeX7RNowfkAcY4gEmj58McNpTVkts55YhJUx6CURFq1rSOlab6kCwreJeNtRhYNnhcGunb6WFlvRTRbigmp4SVbiQI74i6KUOoFX_tfsVgGR7AikUmXub3BNg2J9IRijV_hCyrOEGWcCC6RbSrS53gJLpYPtvVLdzlv1w3Q-SsFhiWJBSm8UG0XpISwXAFdXuHva8ST_kAcv9EVvD4rRebgrrnrZEstp-7DsfcgH_W-A6Yfz',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548883354-5a80f3f45407?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564463836557-4b9239b4ec79?q=80&w=1200&auto=format&fit=crop',
    ],
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const renderStars = (rating: number) => {
    const safe = rating ?? 0;
    const full = Math.floor(safe);
    const half = safe % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    const items: React.ReactNode[] = [];
    for (let i = 0; i < full; i++) items.push(<i key={`f-${i}`} className="material-symbols-outlined star filled">star</i>);
    if (half) items.push(<i key="h" className="material-symbols-outlined star half">star_half</i>);
    for (let i = 0; i < empty; i++) items.push(<i key={`e-${i}`} className="material-symbols-outlined star empty">star</i>);
    return items;
  };

  return (
    <HomeLayout>
      <div className="pd-wrapper">
        <div className="pd-container">
          {/* Left: Gallery */}
          <section className="pd-gallery">
            <div
              className="pd-main-image"
              role="img"
              aria-label={product.name}
              style={{ backgroundImage: `url(${product.images[0]})` }}
            >
              <button className="pd-fav-btn" aria-label="Add to wishlist">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>

            <div className="pd-thumbs">
              {product.images.slice(0, 5).map((src, idx) => (
                <button key={idx} className={`pd-thumb ${idx === 0 ? 'active' : ''}`} aria-label={`Thumbnail ${idx + 1}`}>
                  <span className="pd-thumb-img" style={{ backgroundImage: `url(${src})` }} />
                </button>
              ))}
            </div>
          </section>

          {/* Right: Info */}
          <section className="pd-info">
            <header className="pd-header">
              <h1 className="pd-title">{product.name}</h1>
              <p className="pd-brand">
                Brand: <a href="#" className="pd-brand-link">{product.brand}</a>
              </p>
            </header>

            <div className="pd-meta-row">
              <div className="pd-rating">
                <strong className="pd-rating-value">{product.rating.toFixed(1)}</strong>
                <div className="pd-stars" aria-hidden>
                  {renderStars(product.rating)}
                </div>
              </div>
              <span className="pd-divider" />
              <a href="#reviews" className="pd-reviews-link">{product.ratingCount.toLocaleString('en-US')} Ratings</a>
              <span className="pd-divider" />
              <p className="pd-sold">{product.sold} sold</p>
            </div>

            <div className="pd-price-box">
              <p className="pd-price-original">{formatPrice(product.originalPrice)}</p>
              <p className="pd-price-current">{formatPrice(product.currentPrice)}</p>
            </div>

            <div className="pd-variants">
              <div className="pd-variant-group">
                <p className="pd-variant-label">Color: <span className="pd-variant-value">White</span></p>
                <div className="pd-color-options">
                  {product.colors.map((c, i) => (
                    <button key={c.key} className={`pd-color ${i === 0 ? 'active' : ''}`} title={c.label} style={{ backgroundColor: c.swatch }} />
                  ))}
                </div>
              </div>

              <div className="pd-variant-group">
                <p className="pd-variant-label">Size</p>
                <div className="pd-size-options">
                  {product.sizes.map((s, i) => (
                    <button key={s} className={`pd-size ${i === 1 ? 'active' : ''}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="pd-variant-group">
                <p className="pd-variant-label">Quantity</p>
                <div className="pd-qty">
                  <button className="pd-qty-btn" aria-label="Decrease">-</button>
                  <input className="pd-qty-input" type="text" value="1" readOnly />
                  <button className="pd-qty-btn" aria-label="Increase">+</button>
                </div>
              </div>
            </div>

            <div className="pd-actions">
              <button className="pd-btn pd-btn-outline">
                <span className="material-symbols-outlined">add_shopping_cart</span>
                <span>Add to Cart</span>
              </button>
              <button className="pd-btn pd-btn-primary">
                <span>Buy Now</span>
              </button>
            </div>
          </section>
        </div>

        {/* Lower: Tabs + Description/Reviews and Sidebar Shop Info */}
        <div className="pd-lower">
          <div className="pd-lower-grid">
            {/* Left content */}
            <div className="pd-left">
              <div className="pd-tabs">
                <nav aria-label="Tabs" className="pd-tab-nav">
                  <a href="#" className="pd-tab-link active">Product Description</a>
                  <a href="#reviews" className="pd-tab-link">Customer Reviews ({product.ratingCount.toLocaleString('en-US')})</a>
                </nav>
              </div>

              <div className="pd-tab-content">
                <div className="pd-prose">
                  <p>
                    Experience unparalleled comfort and timeless style with the Premium Cotton Crewneck T-Shirt from {product.brand}.
                    Crafted from 100% long-staple pima cotton, this t-shirt is exceptionally soft, durable, and breathable,
                    making it an essential piece for any wardrobe.
                  </p>
                  <p>
                    Its classic fit is designed to be not too tight and not too loose, providing a flattering silhouette for all body types.
                    The ribbed collar retains its shape wash after wash, and the reinforced shoulder seams ensure long-lasting wear.
                    Whether you're dressing it up with a blazer or keeping it casual with jeans, this versatile tee is the perfect foundation for any outfit.
                  </p>
                  <h3>Specifications:</h3>
                  <ul className="pd-spec-list">
                    <li><strong>Material:</strong> 100% Pima Cotton</li>
                    <li><strong>Fit:</strong> Classic/Regular</li>
                    <li><strong>Neckline:</strong> Crewneck with ribbed collar</li>
                    <li><strong>Care:</strong> Machine wash cold, tumble dry low</li>
                    <li><strong>Origin:</strong> Made in Portugal</li>
                  </ul>
                </div>

                <div className="pd-reviews" id="reviews">
                  <h3 className="pd-reviews-title">Customer Reviews</h3>
                  <div className="pd-review-list">
                    <div className="pd-review-item">
                      <div className="pd-review-avatar" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBLuQoEnyx8SCmVthiGN00kn1kFRqDidoyOcd2HV4kkv7fkeWJTzkxF1zj298bSmwwcwp2w3ibdmlW7jAH-J_L7rh1OBLth8DE5lGabQtoC8eZmoEGqTFyfa9g5hYSc2pTD9KEbGfFPq1PAqGFGYZsVt2pJyj8LMaATwNLjBBR9lm5VMcsVkyBIelq0Us576Nb4C4s-3IjGkV4VLvdtyB_P3fGqqwCuwzouc_TSm64HnApv1agu4w5PQl31BLjtWJnlCIyRsui_MvYv')` }} />
                      <div className="pd-review-body">
                        <div className="pd-review-row">
                          <p className="pd-review-name">Alex Johnson</p>
                          <p className="pd-review-date">2 weeks ago</p>
                        </div>
                        <div className="pd-review-stars">
                          <i className="material-symbols-outlined">star</i>
                          <i className="material-symbols-outlined">star</i>
                          <i className="material-symbols-outlined">star</i>
                          <i className="material-symbols-outlined">star</i>
                          <i className="material-symbols-outlined">star</i>
                        </div>
                        <p className="pd-review-text">Incredibly soft and fits perfectly. It's become my go-to t-shirt for everyday wear. Highly recommend!</p>
                      </div>
                    </div>

                    <div className="pd-review-item">
                      <div className="pd-review-avatar" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmw6DLg-zpj5wsPWmuiA0CcxIrQg-2ZTTMzOORQSARP1f5Xz-fUXDIGmXx_acXHG3_PlO7oL4IMIum2pATwkrV6ykdfk076M93T0aOogd7ceeoJQqu8mmdQSDNqhqmeJKsEs0LF7N_W9k48AEpxPsmInOE3dAQgCbXXyfQNUHnLwlURIqzbHq8THm-3nF9J4MGcGqU55R70DGNZyYfXJ4G2XhHYWlOxLPhI4YViYCYj0A6hs7bY5IzVIbP7Mg9cCthQRsFoQgaGzwo')` }} />
                      <div className="pd-review-body">
                        <div className="pd-review-row">
                          <p className="pd-review-name">Samantha Bee</p>
                          <p className="pd-review-date">1 month ago</p>
                        </div>
                        <div className="pd-review-stars">
                          <i className="material-symbols-outlined">star</i>
                          <i className="material-symbols-outlined">star</i>
                          <i className="material-symbols-outlined">star</i>
                          <i className="material-symbols-outlined">star</i>
                          <i className="material-symbols-outlined">star_half</i>
                        </div>
                        <p className="pd-review-text">Great quality cotton and the color is exactly as pictured. It did shrink a tiny bit after the first wash, but still fits well.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="pd-shop">
              <div className="pd-shop-card">
                <h3 className="pd-shop-title">Shop Information</h3>
                <div className="pd-shop-header">
                  <div className="pd-shop-avatar" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCO5KwwFf99i0DYegWPQ32N0K14XqqiWO1NtGg1lNEVlf4S95VwovktwsvUuMZ3NadDoL0sTLcpBQ1S4VjFs8J6M5_gGKmeA-vcSE5IuN4ezQYgo9RbExNprRGoAc4i6RJ9gdDJRgz672JWlPfzCsvh5R5uzALOvZsDWLB9IahHXuaQ6DjMsY0iQGq8SyzSrNw54rGeU08QpSuqJyl5TK5NwCNOaVZkXwF3oPXarz0ZeD-8i3NqYO-YxHgJqUCFN49i5BoXUVoLf6ce')` }} />
                  <div>
                    <p className="pd-shop-name">Modern Apparel</p>
                    <p className="pd-shop-active">Active 2 hours ago</p>
                  </div>
                </div>

                <div className="pd-shop-stats">
                  <div className="pd-shop-stat">
                    <i className="material-symbols-outlined pd-shop-icon">star</i>
                    <div>
                      <p className="pd-shop-stat-value">4.9/5.0</p>
                      <p className="pd-shop-stat-label">Rating</p>
                    </div>
                  </div>
                  <div className="pd-shop-stat">
                    <i className="material-symbols-outlined pd-shop-icon">storefront</i>
                    <div>
                      <p className="pd-shop-stat-value">1.2k</p>
                      <p className="pd-shop-stat-label">Products</p>
                    </div>
                  </div>
                </div>

                <div className="pd-shop-actions">
                  <button className="pd-btn pd-btn-outline">
                    <span className="material-symbols-outlined">chat_bubble</span> Chat
                  </button>
                  <button className="pd-btn pd-btn-ghost">
                    <span className="material-symbols-outlined">storefront</span> View Shop
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
