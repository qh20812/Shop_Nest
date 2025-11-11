<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Enums\ReturnStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1️⃣ Đổi cột status sang ENUM trước
        Schema::table('returns', function (Blueprint $table) {
            $table->enum('status', ReturnStatus::values())
                ->default('pending')
                ->comment('Return status using ENUM values')
                ->change();
        });

        // 2️⃣ Sau đó migrate dữ liệu từ integer → enum string
        $mapping = [
            1 => 'pending',
            2 => 'approved',
            3 => 'rejected',
            4 => 'refunded',
            5 => 'exchanged',
            6 => 'cancelled',
        ];

        foreach ($mapping as $int => $str) {
            DB::table('returns')
                ->where('status', (string)$int) // ép kiểu về chuỗi để an toàn
                ->update(['status' => $str]);
        }

        // 3️⃣ Xử lý các giá trị không hợp lệ hoặc null
        DB::table('returns')
            ->whereNotIn('status', ['pending', 'approved', 'rejected', 'refunded', 'exchanged', 'cancelled'])
            ->orWhereNull('status')
            ->update(['status' => 'pending']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1️⃣ Đổi ENUM → tinyInteger
        Schema::table('returns', function (Blueprint $table) {
            $table->tinyInteger('status')
                ->default(1)
                ->comment('1: Pending, 2: Approved, 3: Rejected, 4: Refunded, 5: Exchanged, 6: Cancelled')
                ->change();
        });

        // 2️⃣ Migrate ngược lại enum string → integer
        $reverse = [
            'pending'   => 1,
            'approved'  => 2,
            'rejected'  => 3,
            'refunded'  => 4,
            'exchanged' => 5,
            'cancelled' => 6,
        ];

        foreach ($reverse as $str => $int) {
            DB::table('returns')
                ->where('status', $str)
                ->update(['status' => $int]);
        }
    }
};
