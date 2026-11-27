<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/**
 * Email chào mừng cho tài khoản tạo bằng Google.
 *
 * Không gửi mật khẩu: tài khoản Google đăng nhập bằng Google. Nếu người dùng
 * muốn mật khẩu riêng, email hướng dẫn dùng "Quên mật khẩu" — luồng này không
 * yêu cầu mật khẩu hiện tại (khác với trang Cài đặt → Mật khẩu).
 */
class WelcomeGoogleUserMail extends BaseMail
{
    public function __construct(
        public User $user,
        ?string $locale = null,
    ) {
        parent::__construct($locale ?? $user->preferredLocale());
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.google_welcome.subject'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.welcome_google_user',
            with: [
                'name' => $this->user->mailName(),
                'email' => $this->user->email,
                'url' => route('login'),
            ],
        );
    }
}
