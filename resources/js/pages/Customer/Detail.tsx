import React, { useState } from 'react';
import HomeLayout from '@/layouts/app/HomeLayout';
import '@/../css/ProductDetail.css';
import { router } from '@inertiajs/react';
import PopupAddToCart from '@/Components/home/ui/PopupAddToCart';
import { useToast } from '@/Contexts/ToastContext';

interface AttributeValue {
  attribute_value_id: number;
  attribute_id: number;
  value: string;
}

interface Variant {
  variant_id: number;
  sku: string;
  price: number;
  sale_price: number | null;
  final_price: number;
  stock_quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  attribute_values: AttributeValue[];
}

interface Attribute {
  attribute_id: number;
  name: string;
  values: Array<{
    attribute_value_id: number;
    value: string;
  }>;
}

interface Image {
  image_id: number;
  url: string;
  alt: string;
}

interface Shop {
  id: number;
  name: string;
  logo: string | null;
  rating: number;
  total_products: number;
  last_active_at: string | null;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category: { id: number; name: string } | null;
  brand: { id: number; name: string } | null;
  images: Image[];
  variants: Variant[];
  attributes: Attribute[];
  default_variant_id: number | null;
  min_price: number;
  max_price: number;
  shop: Shop | null;
}

interface Rating {
  average: number;
  count: number;
  breakdown: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
}

interface Review {
  id: number;
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsData {
  data: Review[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    next: string | null;
    prev: string | null;
  };
}

interface DetailProps {
  product: Product;
  reviews: ReviewsData;
  rating: Rating;
  sold_count: number;
}

export default function Detail({ product, reviews, rating, sold_count }: DetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.find(v => v.variant_id === product.default_variant_id) || product.variants[0] || null
  );
  const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    if (selectedVariant) {
      selectedVariant.attribute_values.forEach(av => {
        initial[av.attribute_id] = av.attribute_value_id;
      });
    }
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const toast = useToast();
  const [favorited, setFavorited] = useState<boolean>(false);
  // load initial favorited state from server
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/user/wishlist/items');
        if (res.status === 401) return; // not logged in
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setFavorited(data.items.includes(product.id));
        }
      } catch (err) {
        console.error('Failed to load wishlist status', err);
      }
    })();
  }, [product.id]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupProduct, setPopupProduct] = useState<{ id: number; name: string; image: string; quantity: number } | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const formatSoldCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const resolveColor = (raw?: string): string | undefined => {
    if (!raw) return undefined;
    const value = String(raw).trim();
    if (!value) return undefined;
    const lower = value.toLowerCase();

    // Hex short/long with or without #
    const hexMatch = lower.match(/^#?[0-9a-f]{3}([0-9a-f]{3})?$/);
    if (hexMatch) return lower.startsWith('#') ? lower : `#${lower}`;

    // rgb/rgba/hsl/hsla
    if (/^(rgba?|hsla?)\(/.test(lower)) return lower;

    // Common localized color map
    const basicMap: Record<string, string> = {
      'đỏ': '#ff3b30', 'do': '#ff3b30', 'red': 'red',
      'hồng': '#ff8ba7', 'hong': '#ff8ba7', 'pink': 'pink',
      'xanh lá': '#28a745', 'xanh-la': '#28a745', 'xanh lá cây': '#28a745',
      'xanh': '#007bff', 'xanh biển': '#007bff', 'blue': 'blue',
      'đen': '#000000', 'black': 'black',
      'trắng': '#ffffff', 'trang': '#ffffff', 'white': 'white',
      'vàng': '#ffc107', 'vang': '#ffc107', 'yellow': 'yellow',
      'cam': '#ff6a00', 'orange': 'orange',
      'tím': '#8a2be2', 'tim': '#8a2be2', 'purple': 'purple',
      'nâu': '#8b4513', 'brown': 'brown',
      'xám': '#6b7280', 'gray': 'gray', 'grey': 'gray',
      'be': '#f5f5dc'
    };

    // Split on common separators in case of multi-name values
    const parts = lower.split(/\s*(?:,|\/|-|\|)\s*/).map(p => p.trim()).filter(Boolean);
    for (const p of parts) {
      if (basicMap[p]) return basicMap[p];
      // if looks like a CSS color name, allow it
      if (/^[a-z\s]+$/.test(p) && p.length <= 20) return p;
      // hex without #
      const phex = p.replace(/^#/, '');
      if (/^[0-9a-f]{3}([0-9a-f]{3})?$/.test(phex)) return `#${phex}`;
    }

    // Look for hex inside the string
    const hexInside = lower.match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);
    if (hexInside) return `#${hexInside[1]}`;

    // As a last attempt, return the value and let the browser try to interpret it
    return lower;
  };

  const renderStars = (ratingValue: number) => {
    const safe = ratingValue ?? 0;
    const full = Math.floor(safe);
    const half = safe % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    const items: React.ReactNode[] = [];
    for (let i = 0; i < full; i++) items.push(<i key={`f-${i}`} className="material-symbols-outlined star filled">star</i>);
    if (half) items.push(<i key="h" className="material-symbols-outlined star half">star_half</i>);
    for (let i = 0; i < empty; i++) items.push(<i key={`e-${i}`} className="material-symbols-outlined star empty">star</i>);
    return <>{items}</>;
  };

  const handleAttributeSelect = (attributeId: number, valueId: number) => {
    const newSelected = { ...selectedAttributes, [attributeId]: valueId };
    setSelectedAttributes(newSelected);

    // Find matching variant
    const matchingVariant = product.variants.find(variant => {
      return variant.attribute_values.every(av => newSelected[av.attribute_id] === av.attribute_value_id);
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  const handleQuantityChange = (delta: number) => {
    if (!selectedVariant) return;

    const maxQty = Math.min(selectedVariant.available_quantity, 99);
    const newQty = Math.max(1, Math.min(maxQty, quantity + delta));
    setQuantity(newQty);
  };

  const handleQuantityInput = (value: string) => {
    if (!selectedVariant) return;

    // Allow empty string for user to clear and type
    if (value === '') {
      setQuantity(1);
      return;
    }

    // Only allow numeric input
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    // Clamp between 1 and available quantity
    const maxQty = Math.min(selectedVariant.available_quantity, 99);
    const clampedValue = Math.max(1, Math.min(maxQty, numValue));
    setQuantity(clampedValue);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert('Vui lòng chọn phiên bản sản phẩm');
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await fetch(`/product/${product.id}/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          variant_id: selectedVariant.variant_id,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Đã thêm vào giỏ hàng');
        // Open popup with product details
        setPopupProduct({ id: product.id, name: product.name, image: currentImage?.url || '', quantity });
        setIsPopupOpen(true);
        // Refresh cart items in header (re-fetch only cartItems prop)
        try {
          router.reload({ only: ['cartItems'] });
        } catch (err) {
          // Fallback to no reload
          console.warn('Failed to reload cart items', err);
        }
      } else {
        if (data.action === 'login_required' && data.redirect) {
          window.location.href = data.redirect;
        } else {
          alert(data.message || 'Không thể thêm vào giỏ hàng');
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Đã xảy ra lỗi khi thêm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      alert('Vui lòng chọn phiên bản sản phẩm');
      return;
    }

    setIsBuyingNow(true);
    try {
      const response = await fetch(`/product/${product.id}/buy-now`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          variant_id: selectedVariant.variant_id,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success && (data.redirect_url || data.redirect)) {
        window.location.href = data.redirect_url || data.redirect;
        return;
      }
      if (data.action === 'login_required' && data.redirect) {
        window.location.href = data.redirect;
        return;
      }
      alert(data.message || 'Không thể mua ngay');
    } catch (error) {
      console.error('Buy now error:', error);
      alert('Đã xảy ra lỗi khi mua ngay');
    } finally {
      setIsBuyingNow(false);
    }
  };

  const currentImage = product.images[selectedImageIndex] || product.images[0];
  const currentPrice = selectedVariant?.final_price || product.min_price;
  const originalPrice = selectedVariant?.price || product.max_price;

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
              style={{ backgroundImage: `url(${currentImage?.url || ''})` }}
            >
              <button
                className={`pd-fav-btn ${favorited ? 'favorited' : ''}`}
                aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={favorited}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const next = !favorited;
                  setFavorited(next);
                  if (next) {
                    toast.success('Đã thêm vào yêu thích', `Sản phẩm "${product.name}" đã được thêm vào danh sách yêu thích.`);
                    (async () => {
                      try {
                        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                        const res = await fetch(`/user/wishlist/items/${product.id}`, { method: 'POST', headers: { 'X-CSRF-TOKEN': csrf } });
                        if (res.status === 401) {
                          const data = await res.json(); if (data.redirect) window.location.href = data.redirect;
                        }
                      } catch (err) { console.error('Failed to add to wishlist', err); }
                    })();
                  } else {
                    toast.info('Đã xóa khỏi yêu thích', `Sản phẩm "${product.name}" đã được xóa khỏi danh sách yêu thích.`);
                    (async () => {
                      try {
                        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                        const res = await fetch(`/user/wishlist/items/${product.id}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': csrf } });
                        if (res.status === 401) {
                          const data = await res.json(); if (data.redirect) window.location.href = data.redirect;
                        }
                      } catch (err) { console.error('Failed to remove from wishlist', err); }
                    })();
                  }
                }}
              >
                {favorited ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" role="img" aria-hidden="true">
                    <path fill="currentColor" d="M12 21s-7-4.35-8.5-7A4.5 4.5 0 0 1 8 4.5 4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 4-2.5A4.5 4.5 0 0 1 20.5 14C19 16.65 12 21 12 21z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" role="img" aria-hidden="true">
                    <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M12 21s-7-4.35-8.5-7A4.5 4.5 0 0 1 8 4.5a4.5 4.5 0 0 1 4 2.4 4.5 4.5 0 0 1 4-2.4A4.5 4.5 0 0 1 20.5 14C19 16.65 12 21 12 21z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="pd-thumbs">
              {product.images.slice(0, 5).map((img, idx) => (
                <button
                  key={img.image_id}
                  className={`pd-thumb ${idx === selectedImageIndex ? 'active' : ''}`}
                  aria-label={`Thumbnail ${idx + 1}`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <span className="pd-thumb-img" style={{ backgroundImage: `url(${img.url})` }} />
                </button>
              ))}
            </div>
          </section>

          {/* Right: Info */}
          <section className="pd-info">
            <header className="pd-header">
              <h1 className="pd-title">{product.name}</h1>
              {product.brand && (
                <p className="pd-brand">
                  Brand: <a href={`/brands/${product.brand.id}`} className="pd-brand-link">{product.brand.name}</a>
                </p>
              )}
            </header>

            <div className="pd-meta-row">
              <div className="pd-rating">
                <strong className="pd-rating-value">{rating.average.toFixed(1)}</strong>
                <div className="pd-stars" aria-hidden>
                  {renderStars(rating.average)}
                </div>
              </div>
              <span className="pd-divider" />
              <a href="#reviews" className="pd-reviews-link" onClick={() => setActiveTab('reviews')}>
                {rating.count.toLocaleString('en-US')} Ratings
              </a>
              <span className="pd-divider" />
              <p className="pd-sold">{formatSoldCount(sold_count)} sold</p>
            </div>

            <div className="pd-price-box">
              {originalPrice > currentPrice && (
                <p className="pd-price-original">{formatPrice(originalPrice)}</p>
              )}
              <p className="pd-price-current">{formatPrice(currentPrice)}</p>
            </div>

            <div className="pd-variants">
              {product.attributes.map(attribute => {
                const isColorAttribute = attribute.name.toLowerCase().includes('color') || attribute.name.toLowerCase().includes('màu');

                return (
                  <div key={attribute.attribute_id} className="pd-variant-group">
                    <p className="pd-variant-label">
                      {attribute.name}
                      {selectedAttributes[attribute.attribute_id] && (
                        <span className="pd-variant-value">
                          : {attribute.values.find(v => v.attribute_value_id === selectedAttributes[attribute.attribute_id])?.value}
                        </span>
                      )}
                    </p>

                    {isColorAttribute ? (
                      <div className="pd-color-options">
                        {attribute.values.map(value => (
                          <button
                            key={value.attribute_value_id}
                            className={`pd-color ${selectedAttributes[attribute.attribute_id] === value.attribute_value_id ? 'active' : ''}`}
                            title={value.value}
                            style={{ backgroundColor: resolveColor(value.value) || undefined }}
                            aria-label={`Color ${value.value}`}
                            onClick={() => handleAttributeSelect(attribute.attribute_id, value.attribute_value_id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="pd-size-options">
                        {attribute.values.map(value => (
                          <button
                            key={value.attribute_value_id}
                            className={`pd-size ${selectedAttributes[attribute.attribute_id] === value.attribute_value_id ? 'active' : ''}`}
                            onClick={() => handleAttributeSelect(attribute.attribute_id, value.attribute_value_id)}
                          >
                            {value.value}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pd-variant-group">
                <p className="pd-variant-label">Quantity</p>
                <div className="pd-qty">
                  <button
                    className="pd-qty-btn"
                    aria-label="Decrease"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    className="pd-qty-input"
                    type="text"
                    value={quantity}
                    onChange={(e) => handleQuantityInput(e.target.value)}
                    onBlur={(e) => {
                      // If empty on blur, set to 1
                      if (e.target.value === '') {
                        setQuantity(1);
                      }
                    }}
                  />
                  <button
                    className="pd-qty-btn"
                    aria-label="Increase"
                    onClick={() => handleQuantityChange(1)}
                    disabled={!selectedVariant || quantity >= selectedVariant.available_quantity || quantity >= 99}
                  >
                    +
                  </button>
                </div>
                {selectedVariant && (
                  <p className="pd-stock-info">{selectedVariant.available_quantity} còn lại</p>
                )}
              </div>
            </div>

            <div className="pd-actions">
              <button
                className="pd-btn pd-btn-outline"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !selectedVariant}
              >
                <span className="material-symbols-outlined">add_shopping_cart</span>
                <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
              </button>
              <button
                className="pd-btn pd-btn-primary"
                onClick={handleBuyNow}
                disabled={isBuyingNow || !selectedVariant}
              >
                <span>{isBuyingNow ? 'Processing...' : 'Buy Now'}</span>
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
                  <a
                    href="#description"
                    className={`pd-tab-link ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab('description'); }}
                  >
                    Product Description
                  </a>
                  <a
                    href="#reviews"
                    className={`pd-tab-link ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab('reviews'); }}
                  >
                    Customer Reviews ({rating.count.toLocaleString('en-US')})
                  </a>
                </nav>
              </div>

              <div className="pd-tab-content">
                {activeTab === 'description' ? (
                  <div className="pd-prose">
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />

                    {product.attributes && product.attributes.length > 0 && (
                      <>
                        <h3>Specifications:</h3>
                        <ul className="pd-spec-list">
                          {product.attributes.map(attr => (
                            <li key={attr.attribute_id}>
                              <strong>{attr.name}:</strong> {attr.values.map(v => v.value).join(', ')}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="pd-reviews" id="reviews">
                    <h3 className="pd-reviews-title">Customer Reviews</h3>
                    {reviews.data.length === 0 ? (
                      <div className="pd-no-reviews">
                        <div className="pd-no-reviews-icon">
                          <span className="material-symbols-outlined">rate_review</span>
                        </div>
                        <h4 className="pd-no-reviews-title">Chưa có đánh giá nào</h4>
                        <p className="pd-no-reviews-text">
                          Sản phẩm này chưa có đánh giá từ khách hàng. Hãy là người đầu tiên đánh giá sau khi mua hàng!
                        </p>
                      </div>
                    ) : (
                      <div className="pd-review-list">
                        {reviews.data.map(review => (
                          <div key={review.id} className="pd-review-item">
                            <div
                              className="pd-review-avatar"
                              style={{
                                backgroundImage: review.user.avatar
                                  ? `url(${review.user.avatar})`
                                  : 'url(https://ui-avatars.com/api/?name=' + encodeURIComponent(review.user.username) + ')',
                              }}
                            />
                            <div className="pd-review-body">
                              <div className="pd-review-row">
                                <p className="pd-review-name">{review.user.username}</p>
                                <p className="pd-review-date">{review.created_at}</p>
                              </div>
                              <div className="pd-review-stars">
                                {renderStars(review.rating)}
                              </div>
                              <p className="pd-review-text">{review.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {reviews.meta.last_page > 1 && (
                      <div className="pd-pagination">
                        {reviews.links.prev && (
                          <a href={reviews.links.prev} className="pd-page-link">Previous</a>
                        )}
                        <span>Page {reviews.meta.current_page} of {reviews.meta.last_page}</span>
                        {reviews.links.next && (
                          <a href={reviews.links.next} className="pd-page-link">Next</a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            {product.shop && (
              <aside className="pd-shop">
                <div className="pd-shop-card">
                  <h3 className="pd-shop-title">Shop Information</h3>
                  <div className="pd-shop-header">
                    <div
                      className="pd-shop-avatar"
                      style={{
                        backgroundImage: product.shop.logo
                          ? `url(${product.shop.logo})`
                          : 'url(https://ui-avatars.com/api/?name=' + encodeURIComponent(product.shop.name) + ')',
                      }}
                    />
                    <div>
                      <p className="pd-shop-name">{product.shop.name}</p>
                      <p className="pd-shop-active">
                        {product.shop.last_active_at || 'Recently active'}
                      </p>
                    </div>
                  </div>

                  <div className="pd-shop-stats">
                    <div className="pd-shop-stat">
                      <i className="material-symbols-outlined pd-shop-icon">star</i>
                      <div>
                        <p className="pd-shop-stat-value">{product.shop.rating.toFixed(1)}/5.0</p>
                        <p className="pd-shop-stat-label">Rating</p>
                      </div>
                    </div>
                    <div className="pd-shop-stat">
                      <i className="material-symbols-outlined pd-shop-icon">storefront</i>
                      <div>
                        <p className="pd-shop-stat-value">
                          {product.shop.total_products >= 1000
                            ? `${(product.shop.total_products / 1000).toFixed(1)}k`
                            : product.shop.total_products}
                        </p>
                        <p className="pd-shop-stat-label">Products</p>
                      </div>
                    </div>
                  </div>

                  <div className="pd-shop-actions">
                    <button className="pd-btn pd-btn-outline">
                      <span className="material-symbols-outlined">chat_bubble</span> Chat
                    </button>
                    <button className="pd-btn pd-btn-ghost" onClick={() => router.visit(`/shops/${product.shop!.id}`)}>
                      <span className="material-symbols-outlined">storefront</span> View Shop
                    </button>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
      {/* Popup Add to Cart */}
      <PopupAddToCart
        isOpen={isPopupOpen}
        product={popupProduct}
        onClose={() => { setIsPopupOpen(false); setPopupProduct(null); }}
      />
    </HomeLayout>
  );
}
