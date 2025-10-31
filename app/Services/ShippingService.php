<?php

namespace App\Services;

use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Collection;

class ShippingService
{
    public function calculateFee(UserAddress $address, Collection $cartItems): int
    {
        // Simple calculation: base fee + weight-based fee
        $baseFee = 30000; // VND
        $weightFee = $cartItems->sum(function ($item) {
            // Assume each item has weight, default 0.5kg
            $weight = $item->variant->weight ?? 0.5;
            return $weight * $item->quantity * 5000; // 5000 VND per kg
        });

        return $baseFee + $weightFee;
    }

    public function getTrackingData(string $trackingNumber, string $provider): array
    {
        // Mock dữ liệu trả về (giả lập)
        return [
            'provider' => $provider,
            'tracking_number' => $trackingNumber,
            'status' => 'In Transit',
            'estimated_delivery' => now()->addDays(3)->toDateString(),
            'history' => [
                ['status' => 'Picked up', 'location' => 'Warehouse', 'timestamp' => now()->subDays(2)->toDateTimeString()],
                ['status' => 'In Transit', 'location' => 'Sorting Center', 'timestamp' => now()->subDay()->toDateTimeString()],
            ],
        ];
    }
}