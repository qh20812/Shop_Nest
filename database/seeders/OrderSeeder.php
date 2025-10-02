<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\Role;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Role::where('name->en', 'Customer')->first()?->users;
        $variants = ProductVariant::all();

        foreach ($customers as $customer) {
            // Mỗi khách hàng tạo 1 địa chỉ
            $address = UserAddress::factory()->create(['user_id' => $customer->id]);

            // Mỗi khách hàng tạo 1-5 đơn hàng
            Order::factory(rand(1, 5))->create([
                'customer_id' => $customer->id,
                'shipping_address_id' => $address->id,
            ])->each(function ($order) use ($variants) {
                // Mỗi đơn hàng có 1-4 sản phẩm
                $orderItems = [];
                for ($i = 0; $i < rand(1, 4); $i++) {
                    $variant = $variants->random();
                    $quantity = rand(1, 3);
                    $orderItems[] = [
                        'variant_id' => $variant->variant_id,
                        'quantity' => $quantity,
                        'unit_price' => $variant->price,
                        'total_price' => $variant->price * $quantity,
                    ];
                }
                $order->items()->createMany($orderItems);
            });
        }
    }
}