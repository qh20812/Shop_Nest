<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a test customer
        $customer = User::firstOrCreate(
            ['email' => 'customer@test.com'],
            [
                'username' => 'testcustomer',
                'first_name' => 'Test',
                'last_name' => 'Customer',
                'password' => bcrypt('password'),
                'phone_number' => '1234567890',
                'is_active' => true,
            ]
        );

        // Create sample orders with different statuses
        $timestamp = time();
        $orders = [
            [
                'order_number' => 'ORD' . $timestamp . '1',
                'status' => Order::STATUS_PENDING,
                'payment_status' => Order::PAYMENT_STATUS_UNPAID,
                'total_amount' => 100000,
            ],
            [
                'order_number' => 'ORD' . $timestamp . '2',
                'status' => Order::STATUS_PROCESSING,
                'payment_status' => Order::PAYMENT_STATUS_PAID,
                'total_amount' => 200000,
            ],
            [
                'order_number' => 'ORD' . $timestamp . '3',
                'status' => Order::STATUS_SHIPPED,
                'payment_status' => Order::PAYMENT_STATUS_PAID,
                'total_amount' => 150000,
            ],
            [
                'order_number' => 'ORD' . $timestamp . '4',
                'status' => Order::STATUS_DELIVERED,
                'payment_status' => Order::PAYMENT_STATUS_PAID,
                'total_amount' => 300000,
            ],
            [
                'order_number' => 'ORD' . $timestamp . '5',
                'status' => Order::STATUS_CANCELLED,
                'payment_status' => Order::PAYMENT_STATUS_REFUNDED,
                'total_amount' => 75000,
            ],
        ];

        foreach ($orders as $orderData) {
            Order::create([
                'customer_id' => $customer->id,
                'order_number' => $orderData['order_number'],
                'status' => $orderData['status'],
                'payment_status' => $orderData['payment_status'],
                'total_amount' => $orderData['total_amount'],
                'sub_total' => $orderData['total_amount'] * 0.9,
                'shipping_fee' => $orderData['total_amount'] * 0.1,
                'discount_amount' => 0,
                'payment_method' => 3, // Online Gateway
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Created 5 test orders with different statuses');
    }
}
