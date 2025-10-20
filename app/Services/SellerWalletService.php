<?php

namespace App\Services;

use App\Models\SellerPromotionWallet;
use App\Models\SellerWalletTransaction;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class SellerWalletService
{
    public function getWallet(int $sellerId): SellerPromotionWallet
    {
        return SellerPromotionWallet::firstOrCreate(
            ['seller_id' => $sellerId],
            [
                'balance' => 0,
                'total_earned' => 0,
                'total_spent' => 0,
                'currency' => 'VND',
                'status' => 'active',
            ]
        );
    }

    public function createWallet(int $sellerId): SellerPromotionWallet
    {
        return $this->getWallet($sellerId);
    }

    public function getWalletBalance(int $sellerId): float
    {
        return (float) $this->getWallet($sellerId)->balance;
    }

    public function topUpWallet(int $sellerId, float $amount, string $paymentMethod): SellerWalletTransaction
    {
        $wallet = $this->getWallet($sellerId);

        return $this->creditWallet(
            $wallet->wallet_id,
            $amount,
            sprintf('Top-up via %s', $paymentMethod),
            'top_up',
            null
        );
    }

    public function creditWallet(
        int $walletId,
        float $amount,
        string $description,
        ?string $referenceType = null,
        ?int $referenceId = null,
        bool $useTransaction = true
    ): SellerWalletTransaction {
        $this->assertPositiveAmount($amount);

        $handler = function () use ($walletId, $amount, $description, $referenceType, $referenceId) {
            $wallet = SellerPromotionWallet::query()
                ->lockForUpdate()
                ->findOrFail($walletId);

            $this->ensureWalletIsActive($wallet);

            $balanceBefore = $wallet->balance;
            $balanceAfter = $balanceBefore + $amount;

            $wallet->update([
                'balance' => $balanceAfter,
                'total_earned' => $wallet->total_earned + $amount,
            ]);

            return SellerWalletTransaction::create([
                'wallet_id' => $walletId,
                'amount' => $amount,
                'type' => 'credit',
                'description' => $description,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
            ]);
        };

        return $useTransaction ? DB::transaction($handler) : $handler();
    }

    public function deductFromWallet(
        int $walletId,
        float $amount,
        string $description,
        ?string $referenceType = null,
        ?int $referenceId = null,
        bool $useTransaction = true
    ): SellerWalletTransaction {
        $this->assertPositiveAmount($amount);

        $handler = function () use ($walletId, $amount, $description, $referenceType, $referenceId) {
            $wallet = SellerPromotionWallet::query()
                ->lockForUpdate()
                ->findOrFail($walletId);

            $this->ensureWalletIsActive($wallet);

            if ($wallet->balance < $amount) {
                throw new Exception('Insufficient wallet balance.');
            }

            $balanceBefore = $wallet->balance;
            $balanceAfter = $balanceBefore - $amount;

            $wallet->update([
                'balance' => $balanceAfter,
                'total_spent' => $wallet->total_spent + $amount,
            ]);

            return SellerWalletTransaction::create([
                'wallet_id' => $walletId,
                'amount' => $amount,
                'type' => 'debit',
                'description' => $description,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
            ]);
        };

        return $useTransaction ? DB::transaction($handler) : $handler();
    }

    public function getTransactionHistory(int $walletId, array $filters = []): LengthAwarePaginator
    {
        $query = SellerWalletTransaction::query()
            ->where('wallet_id', $walletId)
            ->orderByDesc('created_at');

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->paginate($perPage)->withQueryString();
    }

    public function checkSufficientBalance(int $walletId, float $amount): bool
    {
        $wallet = SellerPromotionWallet::findOrFail($walletId);

        return $wallet->status === 'active' && $wallet->balance >= $amount;
    }

    public function transferFunds(
        int $fromWalletId,
        int $toWalletId,
        float $amount,
        string $description
    ): array {
        if ($fromWalletId === $toWalletId) {
            throw new InvalidArgumentException('Cannot transfer within the same wallet.');
        }

        $this->assertPositiveAmount($amount);

        return DB::transaction(function () use ($fromWalletId, $toWalletId, $amount, $description) {
            $fromWallet = SellerPromotionWallet::query()
                ->lockForUpdate()
                ->findOrFail($fromWalletId);

            $toWallet = SellerPromotionWallet::query()
                ->lockForUpdate()
                ->findOrFail($toWalletId);

            $this->ensureWalletIsActive($fromWallet);
            $this->ensureWalletIsActive($toWallet);

            if ($fromWallet->seller_id !== $toWallet->seller_id) {
                throw new InvalidArgumentException('Wallets must belong to the same seller.');
            }

            if ($fromWallet->balance < $amount) {
                throw new Exception('Insufficient wallet balance.');
            }

            $debit = $this->deductFromWallet(
                $fromWalletId,
                $amount,
                sprintf('Transfer to wallet #%d: %s', $toWalletId, $description),
                'transfer',
                $toWalletId,
                false
            );

            $credit = $this->creditWallet(
                $toWalletId,
                $amount,
                sprintf('Transfer from wallet #%d: %s', $fromWalletId, $description),
                'transfer',
                $fromWalletId,
                false
            );

            return [$debit, $credit];
        });
    }

    private function assertPositiveAmount(float $amount): void
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException('Amount must be greater than zero.');
        }
    }

    private function ensureWalletIsActive(SellerPromotionWallet $wallet): void
    {
        if ($wallet->status !== 'active') {
            throw new Exception('Wallet is not active.');
        }
    }
}
