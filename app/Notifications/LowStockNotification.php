<?php

namespace App\Notifications;

use App\Mail\LowStockMail;
use App\Models\ProductVariant;
use App\Services\InventoryService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly ProductVariant $variant) {}

    /**
     * In-app notification do NotificationService ghi; ở đây chỉ gửi mail.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): LowStockMail
    {
        $product = $this->variant->product;
        $locale = app()->getLocale();

        return (new LowStockMail(
            sellerName: method_exists($notifiable, 'mailName') ? $notifiable->mailName() : (string) $notifiable->username,
            productName: $product?->getTranslation('name', $locale) ?: __('mail.low_stock.unknown_product'),
            variantName: (string) ($this->variant->variant_name ?: '—'),
            sku: (string) ($this->variant->sku ?: '—'),
            quantity: (int) $this->variant->stock_quantity,
            threshold: (int) InventoryService::LOW_STOCK_THRESHOLD,
            // Seller không mở được route admin (middleware is_admin) → trỏ về
            // trang sửa sản phẩm của chính seller.
            url: route('seller.products.edit', $this->variant->product_id),
        ))->to($notifiable->email);
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
