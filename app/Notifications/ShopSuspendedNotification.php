<?php

namespace App\Notifications;

use Carbon\CarbonInterface;

class ShopSuspendedNotification extends AbstractShopStatusNotification
{
    protected function subjectKey(): string
    {
        return 'mail.shop.suspended.subject';
    }

    protected function headingKey(): string
    {
        return 'mail.shop.suspended.heading';
    }

    protected function messageLines(): array
    {
        $reason = (string) ($this->context['reason'] ?? '—');
        $until = $this->context['until'] ?? null;

        $lines = [
            __('mail.shop.suspended.line_1', ['shop' => $this->shopName()]),
            __('mail.shop.suspended.reason', ['reason' => $reason]),
        ];

        if ($until instanceof CarbonInterface) {
            $lines[] = __('mail.shop.suspended.until', ['date' => $until->format('d/m/Y')]);
        } elseif (is_string($until) && $until !== '') {
            $lines[] = __('mail.shop.suspended.until', ['date' => $until]);
        }

        $lines[] = __('mail.shop.suspended.line_2');

        return $lines;
    }
}
