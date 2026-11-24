<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/**
 * Gửi khi một tài khoản email/mật khẩu có sẵn được liên kết với Google.
 *
 * Trước đây việc liên kết diễn ra âm thầm: nếu kẻ khác đã đăng ký email này
 * (chưa xác thực) thì họ vẫn giữ mật khẩu cũ. Mail này thông báo cho chủ tài
 * khoản và nói rõ mật khẩu cũ đã bị vô hiệu hoá khi cần.
 */
class GoogleAccountLinkedMail extends BaseMail
{
    public function __construct(
        public User $user,
        public bool $passwordWasReset = false,
        ?string $locale = null,
    ) {
        parent::__construct($locale ?? $user->preferredLocale());
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.google_linked.subject'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.google_account_linked',
            with: [
                'name' => $this->user->mailName(),
                'email' => $this->user->email,
                'passwordWasReset' => $this->passwordWasReset,
                'url' => route('login'),
            ],
        );
    }
}
