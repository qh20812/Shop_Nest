<?php

namespace App\Services;

class ShippingService
{
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