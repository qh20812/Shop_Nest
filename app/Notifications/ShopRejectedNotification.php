<?php

namespace App\Notifications;

class ShopRejectedNotification extends AbstractShopStatusNotification
{
    protected function subjectKey(): string
    {
        return 'mail.shop.rejected.subject';
    }

    protected function headingKey(): string
    {
        return 'mail.shop.rejected.heading';
    }

    protected function messageLines(): array
    {
        $reason = (string) ($this->context['reason'] ?? __('mail.shop.rejected.line_2'));

        return [
            __('mail.shop.rejected.line_1', ['shop' => $this->shopName()]),
            __('mail.shop.rejected.reason', ['reason' => $reason]),
            __('mail.shop.rejected.line_2'),
        ];
    }
}
