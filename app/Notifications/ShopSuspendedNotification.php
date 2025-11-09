<?php

namespace App\Notifications;

use Carbon\CarbonInterface;

class ShopSuspendedNotification extends AbstractShopStatusNotification
{
    protected function subjectLine(): string
    {
        return 'Your Shop Has Been Suspended';
    }

    protected function messageLines(): array
    {
        $reason = $this->context['reason'] ?? 'Policy violation';
        $until = $this->context['suspended_until'] ?? null;

        $lines = [
            'Your shop has been suspended due to the following reason:',
            $reason,
        ];

        if ($until instanceof CarbonInterface) {
            $lines[] = 'Suspension end date: ' . $until->toDayDateTimeString();
        } elseif (is_string($until) && !empty($until)) {
            $lines[] = 'Suspension end date: ' . $until;
        }

        $lines[] = 'Please address the issue and contact support if you have questions.';

        return $lines;
    }
}
