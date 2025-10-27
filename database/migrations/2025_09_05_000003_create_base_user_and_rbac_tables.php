<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Sửa đổi bảng users hiện có để thêm các trường cần thiết
        Schema::table('users', function (Blueprint $table) {
            // Đổi tên cột 'name' thành 'username' cho rõ nghĩa và thêm unique
            $table->renameColumn('name', 'username');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone_number', 20)->nullable()->unique();
            $table->boolean('is_active')->default(true);
            $table->softDeletes(); // Thêm soft deletes
        });
        
        // Cập nhật lại username cho unique
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->change();
        });


        // Bảng địa chỉ người dùng
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('full_name');
            $table->string('phone_number', 20);
            $table->string('street');
            $table->string('ward'); // Phường/Xã
            $table->string('district'); // Quận/Huyện
            $table->string('city'); // Tỉnh/Thành phố
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        // Thêm khóa ngoại cho địa chỉ mặc định trong bảng users
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('default_address_id')->nullable()->constrained('user_addresses')->onDelete('set null');
        });

        // Bảng Roles
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->json('name'); // Sử dụng JSON để hỗ trợ đa ngôn ngữ
            $table->json('description')->nullable(); // Sử dụng JSON để hỗ trợ đa ngôn ngữ
            $table->timestamps();
        });

        // Bảng Permissions
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // create-product, edit-order
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Bảng trung gian Role-User
        Schema::create('role_user', function (Blueprint $table) {
            $table->primary(['user_id', 'role_id']);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
        });

        // Bảng trung gian Permission-Role
        Schema::create('permission_role', function (Blueprint $table) {
            $table->primary(['permission_id', 'role_id']);
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
        
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['default_address_id']);
            $table->dropColumn(['first_name', 'last_name', 'phone_number', 'is_active', 'default_address_id']);
            $table->dropSoftDeletes();
            $table->renameColumn('username', 'name');
        });

        Schema::dropIfExists('user_addresses');
    }
};