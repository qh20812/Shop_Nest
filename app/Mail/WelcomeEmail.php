<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class WelcomeEmail extends BaseMail
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
            subject: __('mail.welcome.subject'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.welcome',
            with: [
                'name' => $this->user->mailName(),
                'email' => $this->user->email,
                'username' => $this->user->username,
                'url' => route('home'),
            ],
        );
    }
}
