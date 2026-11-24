<?php

namespace App\Services\Admin;

use App\Enums\NotificationType;
use App\Models\User;
use App\Notifications\ShopApprovedNotification;
use App\Notifications\ShopReactivatedNotification;
use App\Notifications\ShopRejectedNotification;
use App\Notifications\ShopSuspendedNotification;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class ShopManagementService
{
    private const TRACKED_FIELDS = [
        'shop_status',
        'approved_at',
        'suspended_until',
        'shop_settings',
        'rejection_reason',
        'suspension_reason',
    ];

    public function approve(User $shop, ?string $ip = null, ?string $notes = null): void
    {
        if ($shop->shop_status === 'active') {
            throw ValidationException::withMessages([
                'shop_status' => 'Shop is already active.',
            ]);
        }

        $old = $this->snapshot($shop);

        $shop->update([
            'shop_status' => 'active',
            'approved_at' => now(),
            'rejection_reason' => null,
        ]);

        Cache::forget("shop_statistics_{$shop->id}");

        app(ShopAuditService::class)->logAction($shop, 'shop.approved', $old, $this->snapshot($shop), $notes, $ip);
        NotificationService::sendToUser(
            $shop,
            'Shop Approved',
            'Your shop has been approved and is now active on the platform.',
            NotificationType::SELLER_ACCOUNT_STATUS,
            $shop
        );

        $this->notifyByMail($shop, new ShopApprovedNotification([
            'shop_name' => $this->shopName($shop),
        ]));
    }

    public function reject(User $shop, string $reason, ?string $ip = null, ?string $notes = null): void
    {
        if (! in_array($shop->shop_status, ['pending', 'active'], true)) {
            throw ValidationException::withMessages([
                'shop_status' => 'Only pending or active shops can be rejected.',
            ]);
        }

        $old = $this->snapshot($shop);

        $shop->update([
            'shop_status' => 'rejected',
            'rejection_reason' => $reason,
            'approved_at' => null,
        ]);

        Cache::forget("shop_statistics_{$shop->id}");

        app(ShopAuditService::class)->logAction($shop, 'shop.rejected', $old, $this->snapshot($shop), $notes, $ip);
        NotificationService::sendToUser(
            $shop,
            'Shop Application Rejected',
            "Your shop application was rejected for the following reason: {$reason}.",
            NotificationType::SELLER_ACCOUNT_STATUS,
            $shop
        );

        $this->notifyByMail($shop, new ShopRejectedNotification([
            'shop_name' => $this->shopName($shop),
            'reason' => $reason,
        ]));
    }

    public function suspend(
        User $shop,
        string $reason,
        Carbon $until,
        ?string $ip = null,
        bool $notify = true,
        ?string $notes = null
    ): void {
        if ($shop->shop_status === 'suspended') {
            throw ValidationException::withMessages([
                'shop_status' => 'Shop is already suspended.',
            ]);
        }

        $old = $this->snapshot($shop);

        $shop->update([
            'shop_status' => 'suspended',
            'suspension_reason' => $reason,
            'suspended_until' => $until,
        ]);

        Cache::forget("shop_statistics_{$shop->id}");

        app(ShopAuditService::class)->logAction($shop, 'shop.suspended', $old, $this->snapshot($shop), $notes, $ip);

        if ($notify) {
            $untilText = $until->toDayDateTimeString();
            NotificationService::sendToUser(
                $shop,
                'Shop Suspension Notice',
                "Your shop has been suspended for the following reason: {$reason}. Suspension ends on {$untilText}.",
                NotificationType::SELLER_ACCOUNT_STATUS,
                $shop
            );

            $this->notifyByMail($shop, new ShopSuspendedNotification([
                'shop_name' => $this->shopName($shop),
                'reason' => $reason,
                'until' => $until,
            ]));
        }
    }

    public function reactivate(User $shop, ?string $ip = null, ?string $notes = null): void
    {
        if ($shop->shop_status !== 'suspended') {
            throw ValidationException::withMessages([
                'shop_status' => 'Only suspended shops can be reactivated.',
            ]);
        }

        $old = $this->snapshot($shop);

        $shop->update([
            'shop_status' => 'active',
            'suspension_reason' => null,
            'suspended_until' => null,
        ]);

        Cache::forget("shop_statistics_{$shop->id}");

        app(ShopAuditService::class)->logAction($shop, 'shop.reactivated', $old, $this->snapshot($shop), $notes, $ip);
        NotificationService::sendToUser(
            $shop,
            'Shop Reactivated',
            'Your shop suspension has been lifted and the shop is active again.',
            NotificationType::SELLER_ACCOUNT_STATUS,
            $shop
        );

        $this->notifyByMail($shop, new ShopReactivatedNotification([
            'shop_name' => $this->shopName($shop),
        ]));
    }

    /**
     * Tên shop hiển thị trong email; fallback về username của chủ shop.
     */
    private function shopName(User $shop): string
    {
        $name = $shop->ownedShops()->value('name');

        return $name !== null && $name !== '' ? (string) $name : (string) $shop->username;
    }

    /**
     * Chỉ gửi mail khi tài khoản có email.
     */
    private function notifyByMail(User $shop, Notification $notification): void
    {
        if (! $shop->email) {
            return;
        }

        $shop->notify($notification);
    }

    private function snapshot(User $shop): array
    {
        $snapshot = $shop->only(self::TRACKED_FIELDS);

        foreach ($snapshot as $key => $value) {
            if ($value instanceof Carbon) {
                $snapshot[$key] = $value->toDateTimeString();
            }
        }

        return $snapshot;
    }
}
