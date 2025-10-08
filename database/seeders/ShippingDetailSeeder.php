<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\ShippingDetail;
use Illuminate\Database\Seeder;

class ShippingDetailSeeder extends Seeder
{
    public function run(): void
    {
        $orders = Order::all();
        $providers = ['Giao Hàng Nhanh', 'Giao Hàng Tiết Kiệm', 'Viettel Post', 'VNPost'];

        foreach ($orders as $order) {
            // Map order status to shipping status (integers)
            $shippingStatus = match($order->status->value) {
                'pending_confirmation', 'processing' => 1, // Pending
                'pending_assignment', 'assigned_to_shipper' => 2, // In transit  
                'delivering' => 3, // Out for delivery
                'delivered', 'completed' => 4, // Delivered
                'cancelled', 'returned' => 5, // Cancelled/Returned
                default => 1
            };

            ShippingDetail::create([
                'order_id' => $order->order_id,
                'shipping_provider' => $providers[array_rand($providers)],
                'tracking_number' => 'TRACK' . strtoupper(fake()->bothify('??######')),
                'status' => $shippingStatus,
                'shipping_fee' => $order->shipping_fee,
            ]);
        }
    }
}