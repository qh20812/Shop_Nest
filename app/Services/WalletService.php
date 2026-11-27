<?php

namespace App\Services;

use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * Single ledger for the ShopNest prepaid wallet.
 *
 * Every balance mutation must go through this service so the wallet row and
 * the transaction history stay consistent. Callers that already run inside a
 * database transaction should pass $useTransaction = false.
 */
class WalletService
{
    public function forUser(int|User $user): Wallet
    {
        $userId = $user instanceof User ? (int) $user->id : $user;

        return Wallet::firstOrCreate(
            ['user_id' => $userId],
            [
                'balance' => 0,
                'total_earned' => 0,
                'total_spent' => 0,
                'currency' => 'VND',
                'status' => 'active',
            ]
        );
    }

    public function findForUser(int $userId): ?Wallet
    {
        return Wallet::where('user_id', $userId)->first();
    }

    public function byId(int $walletId): Wallet
    {
        return Wallet::findOrFail($walletId);
    }

    public function credit(
        int $walletId,
        float $amount,
        string $type,
        string $description,
        ?string $referenceType = null,
        ?int $referenceId = null,
        bool $useTransaction = true,
        bool $countAsEarning = true,
        bool $reduceTotalSpent = false,
        array $metadata = [],
    ): WalletTransaction {
        $this->assertPositiveAmount($amount);

        $handler = function () use ($walletId, $amount, $type, $description, $referenceType, $referenceId, $countAsEarning, $reduceTotalSpent, $metadata) {
            $wallet = Wallet::query()->lockForUpdate()->findOrFail($walletId);
            $this->ensureWalletIsActive($wallet);

            $balanceBefore = (float) $wallet->balance;
            $balanceAfter = $balanceBefore + $amount;

            $wallet->balance = $balanceAfter;

            if ($countAsEarning) {
                $wallet->total_earned = (float) $wallet->total_earned + $amount;
            }

            if ($reduceTotalSpent) {
                $wallet->total_spent = max(0, (float) $wallet->total_spent - $amount);
            }

            $wallet->save();

            return WalletTransaction::create([
                'wallet_id' => $walletId,
                'type' => $type,
                'direction' => 'credit',
                'amount' => $amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'description' => $description,
                'metadata' => $metadata ?: null,
            ]);
        };

        return $useTransaction ? DB::transaction($handler) : $handler();
    }

    public function debit(
        int $walletId,
        float $amount,
        string $type,
        string $description,
        ?string $referenceType = null,
        ?int $referenceId = null,
        bool $useTransaction = true,
        bool $countAsSpending = true,
        array $metadata = [],
    ): WalletTransaction {
        $this->assertPositiveAmount($amount);

        $handler = function () use ($walletId, $amount, $type, $description, $referenceType, $referenceId, $countAsSpending, $metadata) {
            $wallet = Wallet::query()->lockForUpdate()->findOrFail($walletId);
            $this->ensureWalletIsActive($wallet);

            $balanceBefore = (float) $wallet->balance;

            if ($balanceBefore < $amount) {
                throw new Exception('Insufficient wallet balance.');
            }

            $balanceAfter = $balanceBefore - $amount;

            $wallet->balance = $balanceAfter;

            if ($countAsSpending) {
                $wallet->total_spent = (float) $wallet->total_spent + $amount;
            }

            $wallet->save();

            return WalletTransaction::create([
                'wallet_id' => $walletId,
                'type' => $type,
                'direction' => 'debit',
                'amount' => $amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'description' => $description,
                'metadata' => $metadata ?: null,
            ]);
        };

        return $useTransaction ? DB::transaction($handler) : $handler();
    }

    public function getTransactionHistory(int $walletId, array $filters = []): LengthAwarePaginator
    {
        $query = WalletTransaction::query()
            ->where('wallet_id', $walletId)
            ->orderByDesc('created_at');

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (! empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->paginate($perPage)->withQueryString();
    }

    private function assertPositiveAmount(float $amount): void
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException('Amount must be greater than zero.');
        }
    }

    private function ensureWalletIsActive(Wallet $wallet): void
    {
        if (! $wallet->isActive()) {
            throw new Exception('Wallet is not active.');
        }
    }
}
