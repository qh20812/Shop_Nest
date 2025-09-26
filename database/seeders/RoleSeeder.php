<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => ['en' => 'Admin', 'vi' => 'Quản trị viên'],
                'description' => ['en' => 'Administrator with full access', 'vi' => 'Quản trị viên có toàn quyền truy cập'],
            ],
            [
                'name' => ['en' => 'Seller', 'vi' => 'Người bán hàng'],
                'description' => ['en' => 'User who can sell products', 'vi' => 'Người dùng có thể bán sản phẩm'],
            ],
            [
                'name' => ['en' => 'Customer', 'vi' => 'Khách hàng'],
                'description' => ['en' => 'User who can buy products', 'vi' => 'Người dùng có thể mua sản phẩm'],
            ],
        ];

        foreach ($roles as $roleData) {
            // Sử dụng firstOrNew để lấy hoặc tạo một instance mới mà không lưu
            $role = Role::firstOrNew(['name->en' => $roleData['name']['en']]);
            
            // Fill dữ liệu vào instance, lúc này trait HasTranslations sẽ hoạt động
            $role->fill($roleData);
            
            // Lưu instance vào database
            $role->save();
        }
    }
}