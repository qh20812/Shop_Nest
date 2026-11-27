<?php

namespace App\Notifications;

use App\Mail\ShopStatusMail;
use Carbon\CarbonInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

abstract class AbstractShopStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @param  array{shop_name?: string, reason?: string, until?: CarbonInterface|string|null}  $context
     */
    public function __construct(protected array $context = []) {}

    /**
     * In-app notification (bảng notifications của app) do NotificationService
     * ghi riêng — Laravel "database" channel không dùng được với bảng đó.
     */
    public function via(mixed $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(mixed $notifiable): ShopStatusMail
    {
        $mail = new ShopStatusMail(
            subjectLine: __($this->subjectKey()),
            heading: __($this->headingKey()),
            greetingName: method_exists($notifiable, 'mailName') ? $notifiable->mailName() : (string) $notifiable->username,
            lines: $this->messageLines(),
            actionUrl: route('seller.shop.edit'),
            actionText: __('mail.shop.cta'),
        );

        // MailChannel gửi Mailable trực tiếp nên phải tự set người nhận.
        return $mail->to($notifiable->email);
    }

    public function toArray(mixed $notifiable): array
    {
        return [
            'type' => static::class,
            'subject' => __($this->subjectKey()),
            'context' => $this->context,
        ];
    }

    abstract protected function subjectKey(): string;

    abstract protected function headingKey(): string;

    /**
     * @return array<int, string>
     */
    abstract protected function messageLines(): array;

    protected function shopName(): string
    {
        return (string) ($this->context['shop_name'] ?? '');
    }
}
