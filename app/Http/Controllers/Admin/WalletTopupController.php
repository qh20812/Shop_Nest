<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WalletTopup;
use App\Services\WalletTopupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class WalletTopupController extends Controller
{
    public function __construct(private WalletTopupService $topupService) {}

    public function index(Request $request): JsonResponse|Response
    {
        $filters = $request->validate([
            'status' => ['nullable', 'in:pending,transferred,approved,rejected,expired,all'],
            'code' => ['nullable', 'string', 'max:6'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $statusFilter = $filters['status'] ?? WalletTopup::STATUS_TRANSFERRED;
        $statusFilter = $statusFilter === 'all' ? null : $statusFilter;

        $query = WalletTopup::query()
            ->with(['user:id,username,email', 'wallet', 'approvedBy:id,username'])
            ->when($statusFilter, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['code'] ?? null, fn ($query, $code) => $query->where('code', strtoupper($code)));

        // The review queue is worked oldest first; every other view is newest first.
        if ($statusFilter === WalletTopup::STATUS_TRANSFERRED) {
            $query->orderByRaw('transferred_at is null')->orderBy('transferred_at');
        } else {
            $query->orderByDesc('topup_id');
        }

        $topups = $query
            ->paginate((int) ($filters['per_page'] ?? 20))
            ->withQueryString()
            ->through(fn (WalletTopup $topup) => $this->presentAdmin($topup));

        if ($request->header('X-Inertia') || ! $request->wantsJson()) {
            return Inertia::render('Admin/WalletTopups/Index', [
                'topups' => $topups,
                'filters' => [
                    'status' => $filters['status'] ?? WalletTopup::STATUS_TRANSFERRED,
                    'code' => $filters['code'] ?? '',
                ],
                'statusOptions' => $this->statusOptions(),
                'statusCounts' => $this->statusCounts(),
                'server_time' => now()->toIso8601String(),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $topups->getCollection(),
            'pagination' => [
                'current_page' => $topups->currentPage(),
                'last_page' => $topups->lastPage(),
                'per_page' => $topups->perPage(),
                'total' => $topups->total(),
                'from' => $topups->firstItem(),
                'to' => $topups->lastItem(),
            ],
            'statusCounts' => $this->statusCounts(),
            'filters' => [
                'status' => $filters['status'] ?? WalletTopup::STATUS_TRANSFERRED,
                'code' => $filters['code'] ?? '',
            ],
            'server_time' => now()->toIso8601String(),
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
            'statusCounts' => $this->statusCounts(),
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
            'statusCounts' => $this->statusCounts(),
        ]);
    }

    /**
     * @return array<string, string>
     */
    private function statusOptions(): array
    {
        return [
            'transferred' => 'Reported as transferred',
            'pending' => 'Waiting for transfer',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            'expired' => 'Expired',
            'all' => 'All statuses',
        ];
    }

    /**
     * @return array{transferred: int, pending: int, approved: int, rejected: int, expired: int, all: int}
     */
    private function statusCounts(): array
    {
        $counts = WalletTopup::query()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $total = (int) $counts->sum();

        return [
            'transferred' => (int) ($counts[WalletTopup::STATUS_TRANSFERRED] ?? 0),
            'pending' => (int) ($counts[WalletTopup::STATUS_PENDING] ?? 0),
            'approved' => (int) ($counts[WalletTopup::STATUS_APPROVED] ?? 0),
            'rejected' => (int) ($counts[WalletTopup::STATUS_REJECTED] ?? 0),
            'expired' => (int) ($counts[WalletTopup::STATUS_EXPIRED] ?? 0),
            'all' => $total,
        ];
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
