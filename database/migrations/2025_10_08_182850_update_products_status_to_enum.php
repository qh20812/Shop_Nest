<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Enums\ProductStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1️⃣ Đổi kiểu cột sang ENUM trước để có thể gán chuỗi mà không lỗi
        Schema::table('products', function (Blueprint $table) {
            $table->enum('status', ProductStatus::values())
                ->default('draft')
                ->comment('Product status using ENUM values')
                ->change();
        });

        // 2️⃣ Sau đó migrate dữ liệu từ integer sang string
        $mapping = [
            1 => 'draft',
            2 => 'pending_approval',
            3 => 'published',
            4 => 'hidden',
        ];

        foreach ($mapping as $int => $str) {
            DB::table('products')
                ->where('status', (string)$int) // ép kiểu để tránh lỗi strict mode
                ->update(['status' => $str]);
        }

        // 3️⃣ Xử lý các giá trị không hợp lệ hoặc null
        DB::table('products')
            ->whereNotIn('status', ['draft', 'pending_approval', 'published', 'hidden'])
            ->orWhereNull('status')
            ->update(['status' => 'draft']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1️⃣ Đổi ENUM -> tinyInteger
        Schema::table('products', function (Blueprint $table) {
            $table->tinyInteger('status')
                ->default(1)
                ->comment('1: Draft, 2: Pending Approval, 3: Published, 4: Hidden')
                ->change();
        });

        // 2️⃣ Chuyển ngược string -> integer
        $reverse = [
            'draft'            => 1,
            'pending_approval' => 2,
            'published'        => 3,
            'hidden'           => 4,
        ];

        foreach ($reverse as $str => $int) {
            DB::table('products')
                ->where('status', $str)
                ->update(['status' => $int]);
        }
    }
};
