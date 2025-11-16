<?php

namespace App\Notifications;

class ShopApprovedNotification extends AbstractShopStatusNotification
{
    protected function subjectLine(): string
    {
        return 'Your Shop Has Been Approved';
    }

    protected function messageLines(): array
    {
        return [
            'Good news! Your shop has been approved by our moderation team.',
            'You can now start listing products and managing orders on ShopNest.'
        ];
    }
}
