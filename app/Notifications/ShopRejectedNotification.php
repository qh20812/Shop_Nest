<?php

namespace App\Notifications;

class ShopRejectedNotification extends AbstractShopStatusNotification
{
    protected function subjectLine(): string
    {
        return 'Update on Your Shop Application';
    }

    protected function messageLines(): array
    {
        $reason = $this->context['reason'] ?? 'Your application did not meet our requirements at this time.';

        return [
            'We regret to inform you that your shop application has been rejected.',
            'Reason: ' . $reason,
            'Please review your details and resubmit the application if appropriate.'
        ];
    }
}
