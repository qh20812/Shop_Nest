<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // Thay đổi cột name từ varchar thành JSON
            $table->json('name')->change();
            
            // Thay đổi cột description từ varchar thành JSON
            $table->json('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // Khôi phục lại kiểu dữ liệu cũ
            $table->string('name', 100)->change();
            $table->string('description', 500)->nullable()->change();
        });
    }
};
