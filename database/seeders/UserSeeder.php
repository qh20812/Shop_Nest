<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name->en', 'Admin')->first();
        $sellerRole = Role::where('name->en', 'Seller')->first();
        $customerRole = Role::where('name->en', 'Customer')->first();
        $shipperRole = Role::where('name->en', 'Shipper')->first();

        // Tạo SUPER ADMIN
        $admin = User::firstOrCreate(
            ['email' => 'admin@shopnest.com'],
            [
                'username' => 'superadmin',
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'password' => Hash::make('@12345Password'),
                'email_verified_at' => now(),
            ]
        );
        if ($adminRole) {
            $admin->roles()->syncWithoutDetaching([$adminRole->id]);
        }

        // Tạo 1 người bán bằng tài khoản cụ thể
        $seller = User::firstOrCreate(
            ['email' => 'testseller@shopnest.com'],
            [
                'username' => 'testseller',
                'first_name' => 'Test',
                'last_name' => 'Seller',
                'password' => Hash::make('@12345Password'),
                'email_verified_at' => now(),
                'shop_status' => 'active',
                'approved_at' => now(),
            ]
        );
        if ($sellerRole) {
            $seller->roles()->syncWithoutDetaching([$sellerRole->id]);
        }

        // Tạo 1 người giao hàng bằng tài khoản cụ thể
        $shipper = User::firstOrCreate(
            ['email' => 'testshipper@shopnest.com'],
            [
                'username' => 'testshipper',
                'first_name' => 'Test',
                'last_name' => 'Shipper',
                'password' => Hash::make('@12345Password'),
                'email_verified_at' => now(),
            ]
        );
        if ($shipperRole) {
            $shipper->roles()->syncWithoutDetaching([$shipperRole->id]);
        }

        // Tạo 1 khách hàng cố định để kiểm tra UI
        $customer = User::firstOrCreate(
            ['email' => 'customer@shopnest.com'],
            [
                'username' => 'testcustomer',
                'first_name' => 'Test',
                'last_name' => 'Customer',
                'password' => Hash::make('@12345Password'),
                'email_verified_at' => now(),
            ]
        );
        if ($customerRole) {
            $customer->roles()->syncWithoutDetaching([$customerRole->id]);
        }

        // Tạo thêm 20 người bán (không tính testseller).
        $sellerCount = User::whereHas('roles', fn ($query) => $query->where('name->en', 'Seller'))->count();
        $sellersToCreate = max(0, 21 - $sellerCount);

        for ($i = 0; $i < $sellersToCreate; $i++) {
            $user = User::factory()->create([
                'phone_number' => fake()->unique()->phoneNumber(),
            ]);
            $user->roles()->syncWithoutDetaching([$sellerRole->id]);
        }

        // Tạo đủ 100 khách hàng (không tính customer cố định).
        $customerCount = User::whereHas('roles', fn ($query) => $query->where('name->en', 'Customer'))->count();
        $customersToCreate = max(0, 100 - $customerCount);

        for ($i = 0; $i < $customersToCreate; $i++) {
            $user = User::factory()->create([
                'phone_number' => fake()->unique()->phoneNumber(),
            ]);
            $user->roles()->syncWithoutDetaching([$customerRole->id]);
        }
    }
}
