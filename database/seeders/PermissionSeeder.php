<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Định nghĩa các quyền
        $permissions = [
            // Quản lý người dùng
            'manage_users', 'view_users', 'create_users', 'edit_users', 'delete_users',
            // Quản lý sản phẩm
            'manage_products', 'view_products', 'create_products', 'edit_products', 'delete_products',
            // Quản lý đơn hàng
            'manage_orders', 'view_orders', 'edit_orders',
            // Quản lý danh mục & thương hiệu
            'manage_categories', 'manage_brands',
            // Quản lý hệ thống
            'view_dashboard', 'manage_settings', 'manage_promotions', 'manage_disputes'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $this->command->info('Permissions created successfully.');

        // Gán quyền cho Roles
        $adminRole = Role::where('name', 'Admin')->first();
        $sellerRole = Role::where('name', 'Seller')->first();

        // Admin có tất cả các quyền
        $adminRole->permissions()->sync(Permission::all());
        $this->command->info('All permissions granted to Admin.');

        // Seller có các quyền liên quan đến sản phẩm và đơn hàng của họ
        $sellerPermissions = [
            'view_dashboard',
            'manage_products', 'view_products', 'create_products', 'edit_products', 'delete_products',
            'manage_orders', 'view_orders', 'edit_orders',
        ];
        $sellerPermsCollection = Permission::whereIn('name', $sellerPermissions)->get();
        $sellerRole->permissions()->sync($sellerPermsCollection);
        $this->command->info('Seller permissions granted.');
    }
}