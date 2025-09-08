<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'Admin'],['description'=>'Quản trị viên']);
        Role::firstOrCreate(['name' => 'Seller'],['description'=>'Người bán hàng']);
        Role::firstOrCreate(['name' => 'Customer'],['description'=>'Khách hàng']);
    }
}
