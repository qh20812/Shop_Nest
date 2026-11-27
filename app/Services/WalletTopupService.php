<?php

namespace App\Services;

use App\Enums\NotificationType;
use App\Models\User;
use App\Models\WalletTopup;
use App\Models\WalletTransaction;
use App\Notifications\WalletTopupNotification;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class WalletTopupService
{
    public function __construct(
        private WalletService $walletService,
        private VietQrService $vietQrService,
    ) {}

    public function create(User $user, float $amount): WalletTopup
    {
        $this->assertAmountWithinLimits($amount);

        return Cache::lock('wallet-topup:create:'.$user->id, 10)->block(5, function () use ($user, $amount) {
            return DB::transaction(function () use ($user, $amount) {
                $wallet = $this->walletService->forUser($user->id);

                WalletTopup::query()
                    ->where('user_id', $user->id)
                    ->where('status', WalletTopup::STATUS_PENDING)
                    ->where('expires_at', '<=', now())
                    ->update(['status' => WalletTopup::STATUS_EXPIRED]);

                $hasActiveTopup = WalletTopup::query()
                    ->where('user_id', $user->id)
                    ->whereIn('status', WalletTopup::ACTIVE_STATUSES)
                    ->lockForUpdate()
                    ->exists();

                if ($hasActiveTopup) {
                    throw new InvalidArgumentException('You already have a wallet top-up waiting for review.');
                }

                $topup = WalletTopup::create([
                    'user_id' => $user->id,
                    'wallet_id' => $wallet->wallet_id,
                    'code' => $this->generateCode(),
                    'amount_declared' => $amount,
                    'status' => WalletTopup::STATUS_PENDING,
                    'expires_at' => now()->addHours((int) config('wallet.topup.ttl_hours', 24)),
                ]);

                return $topup->fresh(['user', 'wallet']);
            });
        });
    }

    public function markTransferred(User $user, WalletTopup $topup): WalletTopup
    {
        $this->assertOwner($user, $topup);

        $topup = DB::transaction(function () use ($topup) {
            $locked = WalletTopup::query()->lockForUpdate()->findOrFail($topup->topup_id);

            if ($locked->status === WalletTopup::STATUS_EXPIRED || $locked->expires_at->isPast()) {
                $locked->update(['status' => WalletTopup::STATUS_EXPIRED]);

                return $locked->fresh(['user', 'wallet']);
            }

            if (! $locked->isPending()) {
                throw new InvalidArgumentException('This top-up request is not waiting for a transfer.');
            }

            $locked->update([
                'status' => WalletTopup::STATUS_TRANSFERRED,
                'transferred_at' => now(),
            ]);

            return $locked->fresh(['user', 'wallet']);
        });

        if ($topup->status === WalletTopup::STATUS_EXPIRED) {
            throw new InvalidArgumentException('This top-up request has expired. Please create a new one.');
        }

        $this->notifyAdmins($topup);

        return $topup;
    }

    public function cancel(User $user, WalletTopup $topup): WalletTopup
    {
        $this->assertOwner($user, $topup);

        return DB::transaction(function () use ($topup) {
            $locked = WalletTopup::query()->lockForUpdate()->findOrFail($topup->topup_id);

            if (! $locked->isPending()) {
                throw new InvalidArgumentException('Only a pending top-up can be cancelled.');
            }

            $locked->update(['status' => WalletTopup::STATUS_EXPIRED]);

            return $locked->fresh(['user', 'wallet']);
        });
    }

    public function approve(User $admin, WalletTopup $topup, float $amountReceived): WalletTopup
    {
        if ($amountReceived <= 0) {
            throw new InvalidArgumentException('The received amount must be greater than zero.');
        }

        $topup = DB::transaction(function () use ($admin, $topup, $amountReceived) {
            $locked = WalletTopup::query()->lockForUpdate()->findOrFail($topup->topup_id);

            if (! in_array($locked->status, WalletTopup::ACTIVE_STATUSES, true)) {
                throw new InvalidArgumentException('This top-up request has already been processed.');
            }

            $declared = (float) $locked->amount_declared;
            $metadata = $locked->metadata ?? [];
            $metadata['declared_amount'] = $declared;
            $metadata['difference'] = round($amountReceived - $declared, 2);

            $this->walletService->credit(
                $locked->wallet_id,
                $amountReceived,
                WalletTransaction::TYPE_TOP_UP,
                'Wallet top-up '.$locked->code,
                'wallet_topup',
                $locked->topup_id,
                false,
                true,
                false,
                $metadata,
            );

            $locked->update([
                'status' => WalletTopup::STATUS_APPROVED,
                'amount_received' => $amountReceived,
                'approved_by' => $admin->id,
                'approved_at' => now(),
                'metadata' => $metadata,
            ]);

            return $locked->fresh(['user', 'wallet']);
        });

        $this->notifyUser($topup, 'approved');

        return $topup;
    }

    public function reject(User $admin, WalletTopup $topup, string $reason): WalletTopup
    {
        $topup = DB::transaction(function () use ($admin, $topup, $reason) {
            $locked = WalletTopup::query()->lockForUpdate()->findOrFail($topup->topup_id);

            if (! in_array($locked->status, WalletTopup::ACTIVE_STATUSES, true)) {
                throw new InvalidArgumentException('This top-up request has already been processed.');
            }

            $locked->update([
                'status' => WalletTopup::STATUS_REJECTED,
                'reject_reason' => $reason,
                'approved_by' => $admin->id,
                'approved_at' => now(),
            ]);

            return $locked->fresh(['user', 'wallet']);
        });

        $this->notifyUser($topup, 'rejected');

        return $topup;
    }

    public function expirePending(): int
    {
        return WalletTopup::query()
            ->where('status', WalletTopup::STATUS_PENDING)
            ->where('expires_at', '<=', now())
            ->update(['status' => WalletTopup::STATUS_EXPIRED]);
    }

    /**
     * @return array<string, mixed>
     */
    public function present(WalletTopup $topup): array
    {
        return [
            'topup_id' => $topup->topup_id,
            'code' => $topup->code,
            'status' => $topup->status,
            'amount_declared' => (float) $topup->amount_declared,
            'amount_received' => $topup->amount_received !== null ? (float) $topup->amount_received : null,
            'transferred_at' => $topup->transferred_at,
            'approved_at' => $topup->approved_at,
            'reject_reason' => $topup->reject_reason,
            'expires_at' => $topup->expires_at,
            'metadata' => $topup->metadata,
            'qr_url' => $this->vietQrService->buildUrl((float) $topup->amount_declared, $topup->code),
            'bank' => $this->vietQrService->bankInfo(),
        ];
    }

    private function assertAmountWithinLimits(float $amount): void
    {
        $min = (float) config('wallet.topup.min_amount', 10000);
        $max = (float) config('wallet.topup.max_amount', 50000000);

        if ($amount < $min) {
            throw new InvalidArgumentException('The minimum top-up amount is '.number_format($min, 0, ',', '.').' VND.');
        }

        if ($amount > $max) {
            throw new InvalidArgumentException('The maximum top-up amount is '.number_format($max, 0, ',', '.').' VND.');
        }
    }

    private function assertOwner(User $user, WalletTopup $topup): void
    {
        if ((int) $topup->user_id !== (int) $user->id) {
            throw new InvalidArgumentException('You are not allowed to modify this top-up request.');
        }
    }

    private function generateCode(): string
    {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for ($attempt = 0; $attempt < 20; $attempt++) {
            $code = '';

            for ($i = 0; $i < 6; $i++) {
                $code .= $alphabet[random_int(0, 25)];
            }

            if (! WalletTopup::where('code', $code)->exists()) {
                return $code;
            }
        }

        throw new InvalidArgumentException('Unable to generate a unique top-up code. Please try again.');
    }

    private function notifyAdmins(WalletTopup $topup): void
    {
        $admins = User::query()
            ->whereHas('roles', fn ($query) => $query->where('name->en', 'Admin'))
            ->get();

        foreach ($admins as $admin) {
            NotificationService::sendToUser(
                $admin,
                'Wallet top-up awaiting review',
                'Top-up '.$topup->code.' of '.number_format((float) $topup->amount_declared, 0, ',', '.').' VND was reported as transferred.',
                NotificationType::ADMIN_WALLET_TOPUP,
                $topup,
            );

            if ($admin->email) {
                $admin->notify(new WalletTopupNotification($topup, 'transferred'));
            }
        }
    }

    private function notifyUser(WalletTopup $topup, string $event): void
    {
        $user = $topup->user;

        if (! $user) {
            return;
        }

        $type = $event === 'approved'
            ? NotificationType::WALLET_TOPUP_APPROVED
            : NotificationType::WALLET_TOPUP_REJECTED;

        $content = $event === 'approved'
            ? 'Top-up '.$topup->code.' was approved for '.number_format((float) ($topup->amount_received ?? $topup->amount_declared), 0, ',', '.').' VND.'
            : 'Top-up '.$topup->code.' was rejected. '.($topup->reject_reason ?? '');

        NotificationService::sendToUser(
            $user,
            $event === 'approved' ? 'Wallet top-up approved' : 'Wallet top-up rejected',
            trim($content),
            $type,
            $topup,
        );

        if ($user->email) {
            $user->notify(new WalletTopupNotification($topup, $event, $topup->reject_reason));
        }
    }
}
