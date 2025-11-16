
import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';
import '@/../css/payment-result-popup.css';

interface PaymentResultAction {
  label: string;
  href: string;
  primary?: boolean;
}

interface PaymentResultItem {
  id?: string | number;
  name?: string;
  product_name?: string;
  quantity?: number;
  total_price?: number;
  unit_price?: number;
  price?: number;
}

interface PaymentResultOrder {
  id?: string | number;
  reference?: string;
  code?: string;
  total?: number;
  total_amount?: number;
  currency?: string;
  payment_method?: string;
  created_at?: string;
  items?: PaymentResultItem[];
}

interface PaymentResultProps {
  provider: string;
  status: string;
  message?: string;
  order?: PaymentResultOrder | null;
  actions?: PaymentResultAction[];
}

const statusConfig: Record<string, { 
  icon: string; 
  iconClass: string;
  title: string; 
  tone: 'success' | 'warning' | 'danger'; 
  fallbackMessage: string 
}> = {
  succeeded: {
    icon: 'bi-check-circle-fill',
    iconClass: 'success',
    title: 'Thanh toán thành công!',
    tone: 'success',
    fallbackMessage: 'Cảm ơn bạn! Đơn hàng của bạn đã được ghi nhận và sẽ được xử lý trong thời gian sớm nhất.',
  },
  canceled: {
    icon: 'bi-exclamation-triangle-fill',
    iconClass: 'warning',
    title: 'Thanh toán đã hủy!',
    tone: 'warning',
    fallbackMessage: 'Thanh toán đã bị hủy. Bạn có thể thử lại hoặc chọn phương thức khác.',
  },
  failed: {
    icon: 'bi-x-circle-fill',
    iconClass: 'danger',
    title: 'Thanh toán thất bại!',
    tone: 'danger',
    fallbackMessage: 'Thanh toán không thành công. Vui lòng kiểm tra lại thông tin hoặc liên hệ hỗ trợ.',
  },
};

const formatCurrency = (value?: number | null, currency = 'VND') => {
  if (typeof value !== 'number') {
    return null;
  }

  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'VND' ? 0 : 2,
    }).format(value);
  } catch {
    return `${value.toLocaleString()} ${currency}`;
  }
};

const PaymentResult: React.FC<PaymentResultProps> = ({
  provider,
  status,
  message,
  order,
  actions,
}) => {
  const normalizedStatus = status?.toLowerCase?.() ?? 'failed';
  const config = statusConfig[normalizedStatus] ?? {
    icon: 'bi-info-circle-fill',
    iconClass: 'warning',
    title: 'Trạng thái thanh toán',
    tone: 'warning' as const,
    fallbackMessage: 'Thanh toán đang được xử lý. Vui lòng kiểm tra lại sau.',
  };

  const currency = order?.currency ?? 'VND';
  const totalAmount = order?.total ?? order?.total_amount ?? null;

  const fallbackActions: PaymentResultAction[] = (() => {
    if (normalizedStatus === 'succeeded') {
      return [
        { label: 'Xem chi tiết đơn hàng', href: '/user/orders', primary: true },
        { label: 'Tiếp tục mua sắm', href: '/' },
      ];
    }

    if (normalizedStatus === 'canceled') {
      return [
        { label: 'Thử thanh toán lại', href: '/checkout', primary: true },
        { label: 'Tiếp tục mua sắm', href: '/' },
      ];
    }

    return [
      { label: 'Thử lại thanh toán', href: '/checkout', primary: true },
      { label: 'Về trang chủ', href: '/' },
    ];
  })();

  const resolvedActions = actions && actions.length > 0 ? actions : fallbackActions;

  const handleClose = () => {
    router.get('/');
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <Head title="Kết quả thanh toán" />
      <div className="payment-result-container">
        {/* Overlay */}
        <div className="payment-result-overlay" onClick={handleClose} />

        {/* Modal */}
        <div className="payment-result-modal">
          {/* Close Button */}
          <button 
            className="payment-result-close"
            onClick={handleClose}
            aria-label="Đóng"
          >
            <i className="bi bi-x payment-result-close-icon"></i>
          </button>

          {/* Content */}
          <div className="payment-result-content">
            {/* Status Icon */}
            <div className={`payment-result-icon-wrapper payment-result-icon-wrapper--${config.iconClass}`}>
              <i className={`bi ${config.icon} payment-result-icon payment-result-icon--${config.iconClass}`}></i>
            </div>

            {/* Title */}
            <h3 className="payment-result-title">{config.title}</h3>

            {/* Info Card */}
            <div className="payment-result-info-card">
              <div className="payment-result-info-list">
                {order?.payment_method && (
                  <div className="payment-result-info-row">
                    <p className="payment-result-info-label">Phương thức thanh toán</p>
                    <p className="payment-result-info-value">{order.payment_method}</p>
                  </div>
                )}
                {order && (order.id || order.reference || order.code) && (
                  <div className="payment-result-info-row">
                    <p className="payment-result-info-label">Mã đơn hàng</p>
                    <p className="payment-result-info-value">
                      #{order.reference ?? order.code ?? order.id}
                    </p>
                  </div>
                )}
                {totalAmount !== null && (
                  <div className="payment-result-info-row">
                    <p className="payment-result-info-label">Tổng cộng</p>
                    <p className="payment-result-info-value">
                      {formatCurrency(totalAmount, currency) ?? 'Đang cập nhật'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="payment-result-actions">
              {resolvedActions.map((action) => (
                <Link
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  className={`payment-result-btn ${action.primary ? 'payment-result-btn-primary' : 'payment-result-btn-secondary'}`}
                >
                  <span className="payment-result-btn-text">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentResult;