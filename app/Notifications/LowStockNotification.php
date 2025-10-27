<?php

namespace App\Notifications;

use App\Models\ProductVariant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly ProductVariant $variant)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $productName = $this->variant->product?->getTranslation('name', app()->getLocale()) ?? __('Unknown product');

        return (new MailMessage())
            ->subject(__('Low stock alert: :product', ['product' => $productName]))
            ->line(__('The variant :sku is running low on stock.', ['sku' => $this->variant->sku]))
            ->line(__('Current quantity: :qty', ['qty' => $this->variant->stock_quantity]))
            ->action(__('View inventory'), route('admin.inventory.show', $this->variant->product_id ?? 0));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'variant_id' => $this->variant->variant_id,
            'product_id' => $this->variant->product_id,
            'sku' => $this->variant->sku,
            'stock_quantity' => $this->variant->stock_quantity,
        ];
    }
}
