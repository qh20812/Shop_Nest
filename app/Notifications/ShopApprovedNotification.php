<?php

namespace App\Notifications;

class ShopApprovedNotification extends AbstractShopStatusNotification
{
    protected function subjectKey(): string
    {
        return 'mail.shop.approved.subject';
    }

    protected function headingKey(): string
    {
        return 'mail.shop.approved.heading';
    }

    protected function messageLines(): array
    {
        return [
            __('mail.shop.approved.line_1', ['shop' => $this->shopName()]),
            __('mail.shop.approved.line_2'),
        ];
    }
}
