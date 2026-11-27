<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WalletTopup;
use App\Models\WalletTransaction;
use App\Services\VietQrService;
use App\Services\WalletService;
use App\Services\WalletTopupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function __construct(
        private WalletService $walletService,
        private WalletTopupService $topupService,
        private VietQrService $vietQrService,
    ) {}

    public function state(Request $request): JsonResponse
    {
        return response()->json($this->statePayload($request));
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $workspaceRole = $this->workspaceRole($user);

        return Inertia::render('Wallet/Index', [
            ...$this->statePayload($request),
            'layout' => $workspaceRole ? 'workspace' : 'account',
            'workspace_home' => $workspaceRole ? "/{$workspaceRole}/dashboard" : null,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function statePayload(Request $request): array
    {
        $user = $request->user();
        $wallet = $this->walletService->forUser($user->id);

        // A pending request past its 24h window stops blocking a new one, even
        // before the scheduled expire command runs.
        WalletTopup::query()
            ->where('user_id', $user->id)
            ->where('status', WalletTopup::STATUS_PENDING)
            ->where('expires_at', '<=', now())
            ->update(['status' => WalletTopup::STATUS_EXPIRED]);

        $activeTopup = WalletTopup::query()
            ->where('user_id', $user->id)
            ->where(function ($query) {
                $query->where('status', WalletTopup::STATUS_TRANSFERRED)
                    ->orWhere(function ($query) {
                        $query->where('status', WalletTopup::STATUS_PENDING)
                            ->where('expires_at', '>', now());
                    });
            })
            ->latest('topup_id')
            ->first();

        $recentTopups = WalletTopup::query()
            ->where('user_id', $user->id)
            ->when($activeTopup, fn ($query) => $query->where('topup_id', '!=', $activeTopup->topup_id))
            ->latest('topup_id')
            ->limit(5)
            ->get()
            ->map(fn (WalletTopup $topup) => $this->topupService->present($topup))
            ->values();

        $filters = $request->validate([
            'type' => ['nullable', Rule::in($this->transactionTypes())],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);

        $transactions = $this->walletService
            ->getTransactionHistory($wallet->wallet_id, [
                'type' => $filters['type'] ?? null,
                'date_from' => $filters['from'] ?? null,
                'date_to' => $filters['to'] ?? null,
                'per_page' => 10,
            ])
            ->through(fn (WalletTransaction $transaction) => [
                'transaction_id' => $transaction->transaction_id,
                'type' => $transaction->type,
                'direction' => $transaction->direction,
                'amount' => (float) $transaction->amount,
                'description' => $transaction->description,
                'balance_after' => (float) $transaction->balance_after,
                'created_at' => $transaction->created_at,
            ]);

        return [
            'wallet' => [
                'wallet_id' => $wallet->wallet_id,
                'balance' => (float) $wallet->balance,
                'total_earned' => (float) $wallet->total_earned,
                'total_spent' => (float) $wallet->total_spent,
                'currency' => $wallet->currency,
                'status' => $wallet->status,
            ],
            'activeTopup' => $activeTopup ? $this->topupService->present($activeTopup) : null,
            'recentTopups' => $recentTopups,
            'transactions' => $transactions,
            'filters' => [
                'type' => $filters['type'] ?? '',
                'from' => $filters['from'] ?? '',
                'to' => $filters['to'] ?? '',
            ],
            'typeOptions' => $this->typeOptions(),
            'bank' => $this->vietQrService->bankInfo(),
            'limits' => [
                'min' => (float) config('wallet.topup.min_amount', 10000),
                'max' => (float) config('wallet.topup.max_amount', 50000000),
                'ttl_hours' => (int) config('wallet.topup.ttl_hours', 24),
            ],
            'presets' => [100000, 200000, 500000, 1000000],
            'server_time' => now()->toIso8601String(),
        ];
    }

    private function workspaceRole(User $user): ?string
    {
        foreach (['admin' => 'Admin', 'seller' => 'Seller', 'shipper' => 'Shipper'] as $key => $name) {
            if ($user->role()->where('name->en', $name)->exists()) {
                return $key;
            }
        }

        return null;
    }

    /**
     * @return list<string>
     */
    private function transactionTypes(): array
    {
        return array_keys($this->typeOptions());
    }

    /**
     * @return array<string, string>
     */
    private function typeOptions(): array
    {
        return [
            WalletTransaction::TYPE_TOP_UP => 'Top up',
            WalletTransaction::TYPE_PURCHASE => 'Order payment',
            WalletTransaction::TYPE_REFUND => 'Refund',
            WalletTransaction::TYPE_PROMOTION_BUDGET => 'Promotion budget',
            WalletTransaction::TYPE_PROMOTION_REFUND => 'Promotion budget refund',
            WalletTransaction::TYPE_ADJUSTMENT => 'Adjustment',
            WalletTransaction::TYPE_MIGRATION => 'Wallet migration',
        ];
    }
}
