<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class VerifyEmailMail extends BaseMail
{
    public function __construct(
        public User $user,
        public string $url,
        ?string $locale = null,
    ) {
        parent::__construct($locale ?? $user->preferredLocale());
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.verify.subject'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.verify',
            with: [
                'name' => $this->user->mailName(),
                'email' => $this->user->email,
                'url' => $this->url,
                'minutes' => (int) config('auth.verification.expire', 60),
            ],
        );
    }
}
