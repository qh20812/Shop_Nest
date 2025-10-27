import React from 'react';

export interface ReviewItem {
  id: number;
  rating: number;
  comment: string;
  created_at_human?: string | null;
  user?: {
    id: number;
    username: string;
    avatar?: string | null;
  } | null;
}

export interface RatingBreakdownItem {
  rating: number;
  count: number;
}

export interface RatingSummary {
  average: number;
  count: number;
  breakdown: RatingBreakdownItem[];
}

export interface ReviewPagination {
  current_page: number;
  last_page: number;
}

interface ReviewListProps {
  reviews: ReviewItem[];
  ratingSummary: RatingSummary;
  pagination: ReviewPagination;
  onPageChange: (page: number) => void;
}

export default function ReviewList({ reviews, ratingSummary, pagination, onPageChange }: ReviewListProps) {
  const totalReviews = ratingSummary.count;
  const canGoPrev = pagination.current_page > 1;
  const canGoNext = pagination.current_page < pagination.last_page;

  const handlePrev = () => {
    if (canGoPrev) {
      onPageChange(pagination.current_page - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(pagination.current_page + 1);
    }
  };

  return (
    <div className="review-section">
      <div className="review-summary">
        <div className="review-average">
          <span className="review-average-score">{ratingSummary.average.toFixed(1)}</span>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi ${ratingSummary.average >= star ? 'bi-star-fill' : ratingSummary.average >= star - 0.5 ? 'bi-star-half' : 'bi-star'}`}
              />
            ))}
          </div>
          <span className="review-total">{totalReviews} đánh giá</span>
        </div>
        <div className="review-breakdown">
          {ratingSummary.breakdown.map((item) => {
            const percentage = totalReviews > 0 ? Math.round((item.count / totalReviews) * 100) : 0;
            const normalized = Math.max(0, Math.min(100, Math.round(percentage / 10) * 10));

            return (
              <div key={item.rating} className="review-breakdown-row">
                <span className="breakdown-label">{item.rating} sao</span>
                <div className="breakdown-bar">
                  <div className={`breakdown-fill fill-${normalized}`} />
                </div>
                <span className="breakdown-count">{item.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="review-list">
        {reviews.length === 0 ? (
          <div className="review-empty">Chưa có đánh giá nào cho sản phẩm này.</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-item-header">
                <div className="review-user">
                  {review.user?.avatar ? (
                    <img src={review.user.avatar} alt={review.user.username} className="review-avatar" />
                  ) : (
                    <div className="review-avatar placeholder">
                      <i className="bi bi-person" />
                    </div>
                  )}
                  <div className="review-user-info">
                    <span className="review-username">{review.user?.username || 'Khách hàng'}</span>
                    <span className="review-date">{review.created_at_human}</span>
                  </div>
                </div>
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className={`bi ${review.rating >= star ? 'bi-star-fill' : 'bi-star'}`} />
                  ))}
                </div>
              </div>
              <div className="review-item-body">
                <p>{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.last_page > 1 && (
        <div className="review-pagination">
          <button type="button" className="pagination-btn" onClick={handlePrev} disabled={!canGoPrev}>
            Trang trước
          </button>
          <span className="pagination-status">
            Trang {pagination.current_page} / {pagination.last_page}
          </span>
          <button type="button" className="pagination-btn" onClick={handleNext} disabled={!canGoNext}>
            Trang tiếp
          </button>
        </div>
      )}
    </div>
  );
}
