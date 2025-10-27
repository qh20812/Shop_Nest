import React from 'react';
import { Link } from '@inertiajs/react';

export interface RelatedProductItem {
  id: number;
  name: string;
  image: string;
  price: number;
  max_price: number;
  rating: number;
  sold_count: number;
}

interface RelatedProductsProps {
  products: RelatedProductItem[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="related-products">
      <div className="section-header">
        <h2>Sản phẩm liên quan</h2>
      </div>
      <div className="related-grid">
        {products.map((product) => {
          const hasRange = product.price !== product.max_price && product.max_price > product.price;
          return (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="related-card"
            >
              <div className="related-image-wrapper">
                <img src={product.image} alt={product.name} className="related-image" />
              </div>
              <div className="related-body">
                <h3 className="related-title">{product.name}</h3>
                <div className="related-price">
                  <span className="related-price-current">{formatCurrency(product.price)}</span>
                  {hasRange && <span className="related-price-range"> - {formatCurrency(product.max_price)}</span>}
                </div>
                <div className="related-meta">
                  <span className="related-rating">
                    <i className="bi bi-star-fill" /> {product.rating.toFixed(1)}
                  </span>
                  <span className="related-sold">Đã bán {product.sold_count}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
