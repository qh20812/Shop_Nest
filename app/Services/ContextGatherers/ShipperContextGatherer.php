<?php

namespace App\Services\ContextGatherers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Carbon;

class ShipperContextGatherer implements ContextGathererInterface
{
    public function gather(?User $user = null): array
    {
        if (!$user) {
            return [];
        }

        $now = Carbon::now();
        $assignedOrders = Order::query()
            ->where('shipper_id', $user->getKey());

        $pendingStatuses = [
            OrderStatus::ASSIGNED_TO_SHIPPER,
            OrderStatus::DELIVERING,
        ];

        $recentDelivered = (clone $assignedOrders)
            ->where('status', OrderStatus::DELIVERED)
            ->latest('updated_at')
            ->take(5)
            ->get(['order_id', 'order_number', 'updated_at']);

        return [
            'summary' => [
                'active_deliveries' => (clone $assignedOrders)->whereIn('status', array_map(fn ($status) => $status->value, $pendingStatuses))->count(),
                'completed_last_7_days' => (clone $assignedOrders)->where('status', OrderStatus::DELIVERED)->where('updated_at', '>=', $now->copy()->subDays(7))->count(),
                'total_assigned' => $assignedOrders->count(),
            ],
            'recent_deliveries' => $recentDelivered->map(fn (Order $order) => [
                'order_number' => $order->order_number,
                'delivered_at' => optional($order->updated_at)->toDateTimeString(),
            ])->values()->all(),
        ];
    }
}