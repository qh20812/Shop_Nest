<?php

namespace App\Mail;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class LowStockMail extends BaseMail
{
    public function __construct(
        public string $sellerName,
        public string $productName,
        public string $variantName,
        public string $sku,
        public int $quantity,
        public int $threshold,
        public string $url,
        ?string $locale = null,
    ) {
        parent::__construct($locale);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.low_stock.subject', ['product' => $this->productName]),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.low_stock',
            with: [
                'greeting' => __('mail.low_stock.greeting', ['name' => $this->sellerName]),
                'productName' => $this->productName,
                'variantName' => $this->variantName,
                'sku' => $this->sku,
                'quantity' => $this->quantity,
                'threshold' => $this->threshold,
                'url' => $this->url,
            ],
        );
    }
}
