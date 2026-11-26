<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\TopUpWalletRequest;
use App\Models\WalletTransaction;
use App\Services\SellerWalletService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function __construct(private SellerWalletService $walletService) {}

    public function show(): Response
    {
        $wallet = $this->walletService->getWallet(Auth::id());

        return Inertia::render('Seller/Wallet/Dashboard', [
            'wallet' => $wallet,
        ]);
    }

    public function transactions(Request $request): Response
    {
        $wallet = $this->walletService->getWallet(Auth::id());
        $filters = $request->only(['type', 'date_from', 'date_to', 'per_page']);

        $transactions = $this->walletService->getTransactionHistory($wallet->wallet_id, $filters);
        $transformed = $transactions->through(function (WalletTransaction $transaction) {
            return [
                'transaction_id' => $transaction->transaction_id,
                'amount' => $transaction->amount,
                'type' => $transaction->type,
                'direction' => $transaction->direction,
                'description' => $transaction->description,
                'reference_type' => $transaction->reference_type,
                'reference_id' => $transaction->reference_id,
                'balance_before' => $transaction->balance_before,
                'balance_after' => $transaction->balance_after,
                'created_at' => $transaction->created_at,
            ];
        });

        return Inertia::render('Seller/Wallet/Transactions', [
            'wallet' => $wallet,
            'transactions' => $transformed,
            'filters' => $filters,
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    public function topUp(TopUpWalletRequest $request): RedirectResponse
    {
        try {
            $transaction = $this->walletService->topUpWallet(
                Auth::id(),
                (float) $request->validated()['amount'],
                $request->validated()['payment_method']
            );

            return redirect()
                ->route('seller.wallet.top-up.status', $transaction)
                ->with('success', 'Top-up initiated successfully.');
        } catch (Exception $exception) {
            return back()->withErrors(['error' => $exception->getMessage()]);
        }
    }

    public function topUpStatus(WalletTransaction $transaction): Response
    {
        if ((int) $transaction->wallet->user_id !== (int) Auth::id()) {
            abort(403);
        }

        return Inertia::render('Seller/Wallet/TopUpStatus', [
            'transaction' => $transaction,
        ]);
    }
}
