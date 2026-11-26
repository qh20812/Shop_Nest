<?php

namespace App\Observers;

use App\Enums\NotificationType;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Notifications\OrderStatusNotification;
use App\Services\NotificationService;
use App\Services\PromotionUsageService;
use Illuminate\Support\Traits\Localizable;

/**
 * Gửi email + thông báo trong app cho khách mỗi khi đơn hàng đổi trạng thái.
 *
 * Đặt ở observer thay vì từng controller để mọi luồng đều phủ: khách huỷ đơn,
 * seller cập nhật trạng thái, admin gán shipper, hoàn tiền...
 */
class OrderObserver
{
    use Localizable;

    public function __construct(private PromotionUsageService $promotionUsageService) {}

    /**
     * Trạng thái đáng gửi mail cho khách. Các bước nội bộ
     * (pending_assignment, assigned_to_shipper) không gửi để tránh spam.
     *
     * @var list<string>
     */
    private const NOTIFIABLE_STATUSES = [
        'processing',
        'delivering',
        'delivered',
        'completed',
        'cancelled',
        'returned',
    ];

    public function created(Order $order): void
    {
        $this->notifyCustomer($order, 'placed');
    }

    public function updated(Order $order): void
    {
        $releasesPromotion = ($order->wasChanged('status') && in_array($order->status?->value, ['cancelled', 'returned'], true))
            || ($order->wasChanged('payment_status') && $order->payment_status === PaymentStatus::REFUNDED);

        if ($releasesPromotion) {
            $this->promotionUsageService->releaseForOrder($order);
        }

        if ($order->wasChanged('payment_status') && $order->payment_status === PaymentStatus::REFUNDED) {
            $this->notifyCustomer($order, 'refunded');

            return;
        }

        if (! $order->wasChanged('status')) {
            return;
        }

        $status = $order->status?->value;

        if ($status !== null && in_array($status, self::NOTIFIABLE_STATUSES, true)) {
            $this->notifyCustomer($order, $status);
        }
    }

    private function notifyCustomer(Order $order, string $event): void
    {
        // Seeder / demo data tạo hàng loạt order: không bắn email thật.
        if (app()->runningInConsole() && ! app()->runningUnitTests()) {
            return;
        }

        $customer = $order->customer;

        if (! $customer || ! $customer->email) {
            return;
        }

        $this->withLocale($customer->preferredLocale(), function () use ($customer, $order, $event) {
            $customer->notify(new OrderStatusNotification($order, $event));

            NotificationService::sendToUser(
                $customer,
                __('mail.order.events.'.$event.'.subject', ['number' => $order->order_number]),
                __('mail.order.events.'.$event.'.intro', ['number' => $order->order_number]),
                NotificationType::CUSTOMER_ORDER_STATUS,
                $order,
                route('user.orders.show', $order->order_id)
            );
        });
    }
}
