<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

/**
 * Base class for every transactional email in ShopNest.
 *
 * - Luôn queue (SMTP không được chặn request của người dùng).
 * - Luôn render qua markdown để Laravel inline CSS + tự sinh bản text/plain.
 * - Nhận locale rõ ràng: khi gửi trong NotificationSender, app locale đã được
 *   set theo người nhận; khi tạo trực tiếp thì truyền $user->preferredLocale().
 */
abstract class BaseMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(?string $locale = null)
    {
        $this->locale($locale ?? app()->getLocale());
    }
}
