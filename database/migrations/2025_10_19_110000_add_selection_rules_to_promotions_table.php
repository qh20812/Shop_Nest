<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promotions', function (Blueprint $table) {
            if (!Schema::hasColumn('promotions', 'selection_rules')) {
                $table->json('selection_rules')->nullable()->after('time_restrictions');
            }

            if (!Schema::hasColumn('promotions', 'auto_apply_new_products')) {
                $table->boolean('auto_apply_new_products')->default(false)->after('selection_rules');
            }
        });
    }

    public function down(): void
    {
        Schema::table('promotions', function (Blueprint $table) {
            if (Schema::hasColumn('promotions', 'auto_apply_new_products')) {
                $table->dropColumn('auto_apply_new_products');
            }

            if (Schema::hasColumn('promotions', 'selection_rules')) {
                $table->dropColumn('selection_rules');
            }
        });
    }
};
