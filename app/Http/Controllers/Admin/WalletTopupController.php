<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WalletTopup;
use App\Services\WalletTopupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use InvalidArgumentException;

class WalletTopupController extends Controller
{
    public function __construct(private WalletTopupService $topupService) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'status' => ['nullable', 'in:pending,transferred,approved,rejected,expired'],
            'code' => ['nullable', 'string', 'max:6'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $topups = WalletTopup::query()
            ->with(['user:id,username,email', 'wallet', 'approvedBy:id,username'])
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['code'] ?? null, fn ($query, $code) => $query->where('code', strtoupper($code)))
            ->orderByDesc('topup_id')
            ->paginate((int) ($filters['per_page'] ?? 20))
            ->withQueryString();

        return response()->json([
            'success' => true,
            'data' => $topups->getCollection()->map(fn (WalletTopup $topup) => $this->presentAdmin($topup))->values(),
            'pagination' => [
                'current_page' => $topups->currentPage(),
                'last_page' => $topups->lastPage(),
                'per_page' => $topups->perPage(),
                'total' => $topups->total(),
            ],
        ]);
    }

    public function show(WalletTopup $topup): JsonResponse
    {
        $topup->load(['user:id,username,email', 'wallet', 'approvedBy:id,username']);

        return response()->json([
            'success' => true,
            'topup' => $this->presentAdmin($topup),
        ]);
    }

    public function approve(Request $request, WalletTopup $topup): JsonResponse
    {
        $data = $request->validate([
            'amount_received' => ['required', 'numeric', 'min:1'],
        ]);

        try {
            $topup = $this->topupService->approve(Auth::user(), $topup, (float) $data['amount_received']);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }

        $topup->load(['user:id,username,email', 'wallet', 'approvedBy:id,username']);

        return response()->json([
            'success' => true,
            'message' => 'Top-up approved and wallet credited.',
            'topup' => $this->presentAdmin($topup),
        ]);
    }

    public function reject(Request $request, WalletTopup $topup): JsonResponse
    {
        $data = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        try {
            $topup = $this->topupService->reject(Auth::user(), $topup, $data['reason']);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }

        $topup->load(['user:id,username,email', 'wallet', 'approvedBy:id,username']);

        return response()->json([
            'success' => true,
            'message' => 'Top-up rejected.',
            'topup' => $this->presentAdmin($topup),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function presentAdmin(WalletTopup $topup): array
    {
        return array_merge($this->topupService->present($topup), [
            'user' => $topup->user ? [
                'id' => $topup->user->id,
                'username' => $topup->user->username,
                'email' => $topup->user->email,
            ] : null,
            'wallet_balance' => $topup->wallet ? (float) $topup->wallet->balance : null,
            'approved_by' => $topup->approvedBy?->username,
        ]);
    }
}
