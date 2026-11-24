<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Support\Facades\Lang;

/**
 * Email cập nhật trạng thái đơn hàng gửi cho khách.
 *
 * $event nhận các giá trị: placed, processing, delivering, delivered,
 * completed, cancelled, returned, refunded.
 */
class OrderStatusMail extends BaseMail
{
    public function __construct(
        public Order $order,
        public string $event,
        public string $greetingName,
        ?string $locale = null,
    ) {
        parent::__construct($locale);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.order.events.'.$this->event.'.subject', [
                'number' => $this->order->order_number,
            ]),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.order_status',
            with: [
                'heading' => __('mail.order.events.'.$this->event.'.heading'),
                'greeting' => __('mail.order.greeting', ['name' => $this->greetingName]),
                'intro' => __('mail.order.events.'.$this->event.'.intro', [
                    'number' => $this->order->order_number,
                ]),
                'url' => route('user.orders.show', $this->order->order_id),
                'summary' => $this->summaryRows(),
            ],
        );
    }

    /**
     * @return array<string, string>
     */
    private function summaryRows(): array
    {
        $order = $this->order;
        $method = (string) $order->payment_method;

        $paymentMethod = Lang::has('mail.order.payment_methods.'.$method)
            ? __('mail.order.payment_methods.'.$method)
            : strtoupper($method);

        return [
            __('mail.order.table.order_number') => (string) $order->order_number,
            __('mail.order.table.placed_at') => optional($order->created_at)->format('d/m/Y H:i') ?? '—',
            __('mail.order.table.total') => $this->formatMoney(
                (float) $order->total_amount,
                (string) ($order->currency ?: 'VND'),
            ),
            __('mail.order.table.payment') => $paymentMethod.' · '
                .__('mail.order.payment_statuses.'.$order->payment_status?->value),
            __('mail.order.table.status') => __('mail.order.statuses.'.$order->status?->value),
        ];
    }

    /**
     * Định dạng tiền theo locale của người nhận (máy chủ có thể không có intl).
     */
    private function formatMoney(float $amount, string $currency): string
    {
        $locale = $this->locale ?: app()->getLocale();
        $decimals = strtoupper($currency) === 'VND' ? 0 : 2;

        $formatted = $locale === 'vi'
            ? number_format($amount, $decimals, ',', '.')
            : number_format($amount, $decimals, '.', ',');

        return $formatted.' '.strtoupper($currency);
    }
}
