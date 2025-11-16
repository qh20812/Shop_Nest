<?php

namespace App\Notifications;

class ShopReactivatedNotification extends AbstractShopStatusNotification
{
    protected function subjectLine(): string
    {
        return 'Your Shop Has Been Reactivated';
    }

    protected function messageLines(): array
    {
        return [
            'Your shop has been reactivated and is now visible to customers again.',
            'Thank you for working with our team to resolve the previous issues.'
        ];
    }
}
