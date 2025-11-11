<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Enums\DisputeStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1️⃣ Đổi kiểu cột sang ENUM trước
        Schema::table('disputes', function (Blueprint $table) {
            $table->enum('status', DisputeStatus::values())
                ->default('open')
                ->comment('Dispute status using ENUM values')
                ->change();
        });

        // 2️⃣ Sau đó map dữ liệu số -> chuỗi
        $map = [
            1 => 'open',
            2 => 'under_review',
            3 => 'resolved',
            4 => 'closed',
        ];

        foreach ($map as $int => $str) {
            DB::table('disputes')
                ->where('status', (string)$int)
                ->update(['status' => $str]);
        }

        // 3️⃣ Xử lý giá trị NULL hoặc ngoài phạm vi
        DB::table('disputes')
            ->whereNotIn('status', ['open', 'under_review', 'resolved', 'closed'])
            ->orWhereNull('status')
            ->update(['status' => 'open']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1️⃣ Đổi ENUM -> tinyInteger trước
        Schema::table('disputes', function (Blueprint $table) {
            $table->tinyInteger('status')
                ->default(1)
                ->comment('1: Open, 2: Under Review, 3: Resolved, 4: Closed')
                ->change();
        });

        // 2️⃣ Rồi mới đổi chuỗi -> số
        $reverse = [
            'open' => 1,
            'under_review' => 2,
            'resolved' => 3,
            'closed' => 4,
        ];

        foreach ($reverse as $str => $int) {
            DB::table('disputes')
                ->where('status', $str)
                ->update(['status' => $int]);
        }
    }
};
