<?php

namespace App\Http\Controllers;

use App\Http\Requests\Wallet\StoreWalletTopupRequest;
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
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $topups = WalletTopup::query()
            ->where('user_id', Auth::id())
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->orderByDesc('topup_id')
            ->paginate((int) ($filters['per_page'] ?? 15))
            ->withQueryString();

        return response()->json([
            'success' => true,
            'data' => $topups->getCollection()->map(fn (WalletTopup $topup) => $this->topupService->present($topup))->values(),
            'pagination' => [
                'current_page' => $topups->currentPage(),
                'last_page' => $topups->lastPage(),
                'per_page' => $topups->perPage(),
                'total' => $topups->total(),
            ],
        ]);
    }

    public function store(StoreWalletTopupRequest $request): JsonResponse
    {
        try {
            $topup = $this->topupService->create($request->user(), (float) $request->validated()['amount']);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Top-up created. Please transfer the exact amount with the code in the memo.',
            'topup' => $this->topupService->present($topup),
        ], 201);
    }

    public function show(WalletTopup $topup): JsonResponse
    {
        $this->authorizeOwner($topup);

        return response()->json([
            'success' => true,
            'topup' => $this->topupService->present($topup),
        ]);
    }

    public function transferred(WalletTopup $topup): JsonResponse
    {
        $this->authorizeOwner($topup);

        try {
            $topup = $this->topupService->markTransferred(Auth::user(), $topup);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Thanks! The admin has been notified and will verify the transfer.',
            'topup' => $this->topupService->present($topup),
        ]);
    }

    public function cancel(WalletTopup $topup): JsonResponse
    {
        $this->authorizeOwner($topup);

        try {
            $topup = $this->topupService->cancel(Auth::user(), $topup);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Top-up request cancelled.',
            'topup' => $this->topupService->present($topup),
        ]);
    }

    private function authorizeOwner(WalletTopup $topup): void
    {
        if ((int) $topup->user_id !== (int) Auth::id()) {
            abort(403);
        }
    }
}
