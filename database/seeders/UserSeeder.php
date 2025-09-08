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
        $adminRole = Role::where('name', 'Admin')->first();
        $sellerRole = Role::where('name', 'Seller')->first();
        $customerRole = Role::where('name', 'Customer')->first();

        // Tạo SUPER ADMIN
        $admin = User::factory()->create([
            'username' => 'superadmin',
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'admin@shopnest.com',
            'password' => Hash::make('password'),
        ]);
        $admin->roles()->attach($adminRole);

        // Tạo 5 người bán
        User::factory(5)->create()->each(function ($user) use ($sellerRole) {
            $user->roles()->attach($sellerRole);
        });

        // Tạo 20 khách hàng
        User::factory(20)->create()->each(function ($user) use ($customerRole) {
            $user->roles()->attach($customerRole);
        });
    }
}