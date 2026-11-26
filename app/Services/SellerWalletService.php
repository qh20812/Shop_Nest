<?php

namespace App\Services;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Backwards-compatible facade over WalletService.
 *
 * @deprecated New code should depend on WalletService directly.
 */
class SellerWalletService
{
    public function __construct(private WalletService $walletService) {}

    public function getWallet(int $sellerId): Wallet
    {
        return $this->walletService->forUser($sellerId);
    }

    public function topUpWallet(int $sellerId, float $amount, string $paymentMethod): WalletTransaction
    {
        $wallet = $this->walletService->forUser($sellerId);

        return $this->walletService->credit(
            $wallet->wallet_id,
            $amount,
            WalletTransaction::TYPE_TOP_UP,
            sprintf('Top-up via %s', $paymentMethod),
            'top_up',
        );
    }

    public function getTransactionHistory(int $walletId, array $filters = []): LengthAwarePaginator
    {
        return $this->walletService->getTransactionHistory($walletId, $filters);
    }
}
