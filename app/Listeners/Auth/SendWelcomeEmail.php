<?php

namespace App\Listeners\Auth;

use App\Mail\WelcomeEmail;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Gửi "mail chào mừng" sau khi email được xác thực.
 *
 * Trước đây mail chào mừng được gửi ngay lúc đăng ký, trùng thời điểm với
 * mail xác thực và mâu thuẫn ("tài khoản đã xong" nhưng chưa dùng được).
 * Giờ chỉ còn 1 mail xác thực ở bước đăng ký, chào mừng đến sau khi xác thực.
 */
class SendWelcomeEmail
{
    public function handle(Verified $event): void
    {
        $user = $event->user;

        if (! $user->email) {
            return;
        }

        try {
            Mail::to($user->email)->send(new WelcomeEmail($user));
        } catch (\Throwable $e) {
            // Không để lỗi SMTP biến việc xác thực thành 500.
            Log::error('welcome_email.failed', [
                'user_id' => $user->getKey(),
                'error' => $e->getMessage(),
            ]);
        }
    }
}
