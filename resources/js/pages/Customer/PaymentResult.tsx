
import { Head, Link } from '@inertiajs/react';

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

const statusConfig: Record<string, { icon: string; title: string; badge: string; tone: 'success' | 'warning' | 'danger'; fallbackMessage: string }> = {
  succeeded: {
    icon: 'fa-check-circle',
    title: 'Thanh toán thành công',
    badge: 'Thành công',
    tone: 'success',
    fallbackMessage: 'Cảm ơn bạn! Đơn hàng của bạn đã được ghi nhận và sẽ được xử lý trong thời gian sớm nhất.',
  },
  canceled: {
    icon: 'fa-exclamation-triangle',
    title: 'Thanh toán đã hủy',
    badge: 'Đã hủy',
    tone: 'warning',
    fallbackMessage: 'Thanh toán đã bị hủy. Bạn có thể thử lại hoặc chọn phương thức khác.',
  },
  failed: {
    icon: 'fa-times-circle',
    title: 'Thanh toán thất bại',
    badge: 'Thất bại',
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
    icon: 'fa-info-circle',
    title: 'Trạng thái thanh toán',
    badge: 'Đang xử lý',
    tone: 'warning' as const,
    fallbackMessage: 'Thanh toán đang được xử lý. Vui lòng kiểm tra lại sau.',
  };

  const statusTone = config.tone;
  const badgeClass = `payment-result__badge payment-result__badge--${statusTone}`;
  const statusClass = `payment-result__status payment-result__status--${statusTone}`;

  const currency = order?.currency ?? 'VND';
  const totalAmount = order?.total ?? order?.total_amount ?? null;
  const orderItems = order?.items ?? [];

  const fallbackActions: PaymentResultAction[] = (() => {
    if (normalizedStatus === 'succeeded') {
      return [
        { label: 'Xem lịch sử đơn hàng', href: '/dashboard/orders', primary: true },
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

  return (
    <>
      <Head title="Kết quả thanh toán" />
      <div className="payment-result">
        <div className="payment-result__wrapper">
          <div className="payment-result__card">
            <div className={statusClass}>
              <i className={`fas ${config.icon}`} aria-hidden="true"></i>
            </div>

            <div>
              <h1 className="payment-result__title">{config.title}</h1>
              <span className={badgeClass}>{config.badge}</span>
            </div>

            <p className="payment-result__provider">
              Cổng thanh toán: <span>{provider.toUpperCase()}</span>
            </p>
            <p className="payment-result__message">{message || config.fallbackMessage}</p>

            {order && (
              <div className="payment-result__sections">
                <div>
                  <h2 className="payment-result__section-title">Tổng quan đơn hàng</h2>
                  <div className="payment-result__meta">
                    {order.id && (
                      <span>Mã đơn hàng: <strong>{order.reference ?? order.code ?? order.id}</strong></span>
                    )}
                    {order.payment_method && (
                      <span>Thanh toán qua: <strong>{order.payment_method}</strong></span>
                    )}
                    {order.created_at && (
                      <span>Thời gian: <strong>{order.created_at}</strong></span>
                    )}
                  </div>
                </div>

                {orderItems.length > 0 && (
                  <div>
                    <h3 className="payment-result__section-title">Sản phẩm</h3>
                    <div className="payment-result__order-list">
                      {orderItems.map((item, index) => {
                        const name = item.name ?? item.product_name ?? `Sản phẩm #${item.id ?? ''}`;
                        const quantity = item.quantity ?? 1;
                        const lineTotal = item.total_price ?? item.unit_price ?? item.price ?? null;
                        const formattedTotal = formatCurrency(lineTotal, currency);

                        return (
                          <div key={`${item.id ?? name}-${index}`} className="payment-result__order-item">
                            <span>{name}</span>
                            <span>
                              x{quantity}
                              {formattedTotal ? ` · ${formattedTotal}` : ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="payment-result__total">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(totalAmount, currency) ?? 'Đang cập nhật'}</span>
                </div>
              </div>
            )}

            <div className="payment-result__actions">
              {resolvedActions.map((action) => (
                <Link
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  className={`checkout-button ${action.primary ? 'checkout-button--primary' : 'checkout-button--secondary'}`}
                >
                  {action.label}
                </Link>
              ))}
            </div>

            <p className="payment-result__support">
              Cần trợ giúp? Liên hệ đội ngũ hỗ trợ của chúng tôi nếu bạn gặp vấn đề trong quá trình thanh toán.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentResult;