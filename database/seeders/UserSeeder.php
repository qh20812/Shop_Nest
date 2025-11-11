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
        $shipperRole = Role::where('name->en','Shipper')->first();

        // Tạo SUPER ADMIN
        $admin = User::factory()->create([
            'username' => 'superadmin',
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'admin@shopnest.com',
            'password' => Hash::make('password'),
        ]);
        $admin->roles()->attach($adminRole);

        // tạo 1 người bán bằng tài khoản cụ thể
        $seller = User::factory()->create([
            'username'=>'testseller',
            'first_name'=>'Test',
            'last_name'=>'Seller',
            'email'=>'testseller@shopnest.com',
            'password'=>Hash::make('password'),
        ]);
        $seller->roles()->attach($sellerRole);

        $shipper = User::factory()->create([
            
        ]);

        // Tạo 20 người bán
        User::factory(20)->create()->each(function ($user) use ($sellerRole) {
            $user->roles()->attach($sellerRole);
        });


        // Tạo 100 khách hàng
        User::factory(100)->create()->each(function ($user) use ($customerRole) {
            $user->roles()->attach($customerRole);
        });
    }
}