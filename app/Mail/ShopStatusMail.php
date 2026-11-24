<?php

namespace App\Mail;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/**
 * Email trạng thái shop (duyệt / từ chối / tạm ngưng / kích hoạt lại).
 * Nội dung được soạn sẵn ở Notification tương ứng để giữ 1 nguồn chữ.
 */
class ShopStatusMail extends BaseMail
{
    /**
     * @param  array<int, string>  $lines
     */
    public function __construct(
        public string $subjectLine,
        public string $heading,
        public string $greetingName,
        public array $lines = [],
        public ?string $actionUrl = null,
        public ?string $actionText = null,
        ?string $locale = null,
    ) {
        parent::__construct($locale);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectLine,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.shop_status',
            with: [
                'heading' => $this->heading,
                'greeting' => __('mail.shop.greeting', ['name' => $this->greetingName]),
                'lines' => $this->lines,
                'actionUrl' => $this->actionUrl,
                'actionText' => $this->actionText,
            ],
        );
    }
}
