<?php

namespace App\Notifications;

class ShopReactivatedNotification extends AbstractShopStatusNotification
{
    protected function subjectKey(): string
    {
        return 'mail.shop.reactivated.subject';
    }

    protected function headingKey(): string
    {
        return 'mail.shop.reactivated.heading';
    }

    protected function messageLines(): array
    {
        return [
            __('mail.shop.reactivated.line_1', ['shop' => $this->shopName()]),
            __('mail.shop.reactivated.line_2'),
        ];
    }
}
