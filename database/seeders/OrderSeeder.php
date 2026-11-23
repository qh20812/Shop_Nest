<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\Role;
use App\Models\ShipperProfile;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Role::where('name->en', 'Customer')->first()?->users;
        $variants = ProductVariant::where('stock_quantity', '>', 0)->get();

        if (! $customers || $customers->isEmpty() || $variants->isEmpty()) {
            $this->command?->info('Không đủ customer/variant để seed đơn hàng.');

            return;
        }

        if (Order::query()->exists()) {
            $this->command?->info('Orders already seeded, skipping.');

            return;
        }

        $shipperIds = ShipperProfile::where('status', 'approved')->pluck('user_id');

        if ($shipperIds->isEmpty()) {
            $shipperIds = User::whereHas('roles', fn ($query) => $query->where('name->en', 'Shipper'))->pluck('id');
        }

        // Phân bố trạng thái hợp lý để mọi màn hình (customer/seller/admin/shipper) đều có dữ liệu.
        $statuses = array_merge(
            array_fill(0, 10, OrderStatus::PENDING_CONFIRMATION->value),
            array_fill(0, 12, OrderStatus::PROCESSING->value),
            array_fill(0, 6, OrderStatus::PENDING_ASSIGNMENT->value),
            array_fill(0, 12, OrderStatus::ASSIGNED_TO_SHIPPER->value),
            array_fill(0, 14, OrderStatus::DELIVERING->value),
            array_fill(0, 20, OrderStatus::DELIVERED->value),
            array_fill(0, 14, OrderStatus::COMPLETED->value),
            array_fill(0, 6, OrderStatus::CANCELLED->value),
            array_fill(0, 6, OrderStatus::RETURNED->value),
        );

        foreach ($customers as $customer) {
            // Mỗi khách hàng có một địa chỉ mặc định.
            $address = $customer->addresses()->first()
                ?? UserAddress::factory()->create([
                    'user_id' => $customer->id,
                    'is_default' => true,
                ]);

            $orderCount = rand(1, 5);

            for ($i = 0; $i < $orderCount; $i++) {
                $status = $statuses[array_rand($statuses)];
                $itemCount = rand(1, 4);
                $items = [];
                $subTotal = 0;

                for ($j = 0; $j < $itemCount; $j++) {
                    $variant = $variants->random();
                    $quantity = rand(1, 3);
                    $unitPrice = (float) ($variant->discount_price ?? $variant->price);
                    $lineTotal = $unitPrice * $quantity;
                    $subTotal += $lineTotal;

                    $items[] = [
                        'variant_id' => $variant->variant_id,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'total_price' => $lineTotal,
                        'original_currency' => 'VND',
                        'original_unit_price' => (float) $variant->price,
                        'original_total_price' => (float) $variant->price * $quantity,
                    ];
                }

                $shippingFee = (float) collect([0, 0, 20000, 30000, 40000])->random();
                $totalAmount = $subTotal + $shippingFee;

                $needsShipper = in_array($status, [
                    OrderStatus::ASSIGNED_TO_SHIPPER->value,
                    OrderStatus::DELIVERING->value,
                    OrderStatus::DELIVERED->value,
                    OrderStatus::COMPLETED->value,
                    OrderStatus::RETURNED->value,
                ], true);

                $hasShipped = in_array($status, [
                    OrderStatus::DELIVERING->value,
                    OrderStatus::DELIVERED->value,
                    OrderStatus::COMPLETED->value,
                    OrderStatus::RETURNED->value,
                ], true);

                $hasDelivered = in_array($status, [
                    OrderStatus::DELIVERED->value,
                    OrderStatus::COMPLETED->value,
                    OrderStatus::RETURNED->value,
                ], true);

                $paymentStatus = match ($status) {
                    OrderStatus::CANCELLED->value => collect(['unpaid', 'refunded'])->random(),
                    OrderStatus::RETURNED->value => 'refunded',
                    OrderStatus::DELIVERED->value, OrderStatus::COMPLETED->value => 'paid',
                    OrderStatus::PENDING_CONFIRMATION->value => collect(['unpaid', 'paid'])->random(),
                    default => 'paid',
                };

                $order = Order::factory()->create([
                    'customer_id' => $customer->id,
                    'shipping_address_id' => $address->id,
                    'sub_total' => $subTotal,
                    'shipping_fee' => $shippingFee,
                    'discount_amount' => 0,
                    'total_amount' => $totalAmount,
                    'currency' => 'VND',
                    'exchange_rate' => 1,
                    'total_amount_base' => $totalAmount,
                    'status' => $status,
                    'payment_status' => $paymentStatus,
                    'payment_method' => rand(1, 3),
                    'shipper_id' => $needsShipper && $shipperIds->isNotEmpty() ? $shipperIds->random() : null,
                    'shipped_at' => $hasShipped ? now()->subDays(rand(1, 10)) : null,
                    'delivered_at' => $hasDelivered ? now()->subDays(rand(0, 5)) : null,
                ]);

                $order->items()->createMany($items);
            }
        }
    }
}
