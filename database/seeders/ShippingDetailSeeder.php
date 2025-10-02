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
            ShippingDetail::create([
                'order_id' => $order->order_id,
                'shipping_provider' => $providers[array_rand($providers)],
                'tracking_number' => 'TRACK' . strtoupper(fake()->bothify('??######')),
                'status' => $order->status, // Đồng bộ trạng thái
                'shipping_fee' => $order->shipping_fee,
            ]);
        }
    }
}