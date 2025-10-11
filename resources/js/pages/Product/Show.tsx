import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import '../../../css/Page.css';
import { decodeHtmlEntities } from '../../utils/htmlUtils';

interface ProductImage {
    image_id: number;
    image_url: string;
    alt_text: string;
    is_primary: boolean;
}

interface ProductVariant {
    variant_id: number;
    price: number;
    discount_price?: number | null;
    stock_quantity: number;
}

interface Review {
    id: number;
    comment: string;
    rating: number;
    user: { name: string };
    created_at: string;
}

interface Product {
    product_id: number;
    name: string; // ✅ name là string
    description: string; // ✅ description là string
    images: ProductImage[];
    variants: ProductVariant[];
    brand?: { name: string | { vi: string; en: string } }; // có thể là string hoặc object
    category?: { name: string | { vi: string; en: string } };
    reviews: Review[];
}

export default function Show() {
    const { product, averageRating, auth }: any = usePage().props;
    const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
        product.images.find((img: ProductImage) => img.is_primary) || product.images[0] || null,
    );
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
    const [quantity, setQuantity] = useState(1);

    const variant = product.variants[0];

    const handleAddToCart = () => {
        if (!auth?.user) {
            router.visit('/login');
        } else {
            router.post('/cart/add', {
                product_id: product.product_id,
                quantity,
            });
        }
    };



    // 🔹 Fallback an toàn nếu name/brand/category vẫn là object
    const getTranslated = (field: any) => {
        if (!field) return '';
        let text = '';
        if (typeof field === 'string') {
            text = field;
        } else {
            text = field.vi || field.en || '';
        }
        // Decode HTML entities for proper Vietnamese display
        return decodeHtmlEntities(text);
    };

    return (
        <div className="product-detail">
            <Head title={getTranslated(product.name)} />

            {/* MAIN SECTION */}
            <div className="product-detail__main">
                {/* Gallery */}
                <div className="product-detail__gallery-container">
                    <div className="product-gallery">
                        <div className="product-gallery__main-image">
                            {selectedImage ? (
                                <img
                                    src={selectedImage.image_url}
                                    alt={selectedImage.alt_text}
                                    className="product-gallery__main-img"
                                />
                            ) : (
                                <div className="product-gallery__no-image">
                                    <i className="bx bx-image"></i>
                                    <span>Không có hình ảnh</span>
                                </div>
                            )}
                        </div>

                        <div className="product-gallery__thumbnails">
                            {product.images.map((img: ProductImage) => (
                                <button
                                    key={img.image_id}
                                    onClick={() => setSelectedImage(img)}
                                    className={`product-gallery__thumbnail ${
                                        selectedImage?.image_id === img.image_id
                                            ? 'product-gallery__thumbnail--active'
                                            : ''
                                    }`}
                                >
                                    <img
                                        src={img.image_url}
                                        alt={img.alt_text}
                                        className="product-gallery__thumbnail-img"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="product-detail__info-container">
                    <div className="product-info">
                        <h1 className="product-info__title">{getTranslated(product.name)}</h1>

                        <div className="product-info__meta">
                            {product.brand && (
                                <p className="product-info__brand">
                                    <strong>Thương hiệu:</strong> {getTranslated(product.brand.name)}
                                </p>
                            )}
                            {product.category && (
                                <p className="product-info__category">
                                    <strong>Danh mục:</strong> {getTranslated(product.category.name)}
                                </p>
                            )}
                            <p>⭐ {averageRating > 0 ? averageRating.toFixed(1) : 'Chưa có đánh giá'}</p>
                        </div>

                        <div className="product-info__price">
                            {variant?.discount_price ? (
                                <>
                                    {variant.discount_price.toLocaleString()}₫{' '}
                                    <span
                                        style={{
                                            textDecoration: 'line-through',
                                            color: 'var(--dark-grey)',
                                        }}
                                    >
                                        {variant.price.toLocaleString()}₫
                                    </span>
                                </>
                            ) : (
                                `${variant?.price.toLocaleString()}₫`
                            )}
                        </div>

                        <div className="product-info__stock">
                            {variant?.stock_quantity > 0 ? (
                                <span className="product-info__stock-status product-info__stock-status--in-stock">
                                    Còn hàng ({variant.stock_quantity})
                                </span>
                            ) : (
                                <span className="product-info__stock-status product-info__stock-status--out-of-stock">
                                    Hết hàng
                                </span>
                            )}
                        </div>

                        {/* Quantity + Add to Cart */}
                        <div className="product-info__actions">
                            <div className="product-info__quantity">
                                <span className="product-info__quantity-label">Số lượng:</span>
                                <div className="product-info__quantity-controls">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="product-info__quantity-btn"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                        }
                                        className="product-info__quantity-input"
                                    />
                                    <button
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="product-info__quantity-btn"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                className="product-info__add-to-cart"
                                onClick={handleAddToCart}
                                disabled={variant?.stock_quantity <= 0}
                            >
                                <i className="bx bx-cart-add"></i>
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS SECTION */}
            <div className="product-detail__tabs-container">
                <div className="product-tabs">
                    <div className="product-tabs__nav">
                        <button
                            className={`product-tabs__button ${
                                activeTab === 'description' ? 'product-tabs__button--active' : ''
                            }`}
                            onClick={() => setActiveTab('description')}
                        >
                            Mô tả
                        </button>
                        <button
                            className={`product-tabs__button ${
                                activeTab === 'reviews' ? 'product-tabs__button--active' : ''
                            }`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Đánh giá ({product.reviews.length})
                        </button>
                    </div>

                    <div className="product-tabs__content">
                        {activeTab === 'description' && (
                            <div className="product-tabs__description">
                                <div className="product-tabs__description-content">
                                    {getTranslated(product.description) ||
                                        'Chưa có mô tả cho sản phẩm này.'}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="product-tabs__reviews">
                                {product.reviews.length === 0 ? (
                                    <div className="product-tabs__no-reviews">
                                        <i className="bx bx-comment-x"></i>
                                        <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                                    </div>
                                ) : (
                                    <div className="product-tabs__reviews-list">
                                        {product.reviews.map((review: Review) => (
                                            <div key={review.id} className="product-tabs__review">
                                                <div className="product-tabs__review-header">
                                                    <span className="product-tabs__review-user">
                                                        {review.user.name}
                                                    </span>
                                                    <div className="product-tabs__review-rating">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <i
                                                                key={star}
                                                                className={`bx bxs-star product-tabs__star ${
                                                                    star <= review.rating
                                                                        ? 'product-tabs__star--filled'
                                                                        : ''
                                                                }`}
                                                            ></i>
                                                        ))}
                                                    </div>
                                                    <span className="product-tabs__review-date">
                                                        {new Date(
                                                            review.created_at,
                                                        ).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <p className="product-tabs__review-comment">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
