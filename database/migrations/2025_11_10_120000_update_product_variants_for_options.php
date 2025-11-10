<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            if (!Schema::hasColumn('product_variants', 'variant_name')) {
                $table->string('variant_name')->nullable()->after('product_id');
            }

            if (!Schema::hasColumn('product_variants', 'option_values')) {
                $table->json('option_values')->nullable()->after('variant_name');
            }

            if (!Schema::hasColumn('product_variants', 'option_signature')) {
                $table->string('option_signature')->nullable()->after('option_values');
            }

            if (!Schema::hasColumn('product_variants', 'is_primary')) {
                $table->boolean('is_primary')->default(false)->after('image_id');
            }

            $table->unique(['product_id', 'option_signature'], 'product_variants_product_signature_unique');
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            if (Schema::hasColumn('product_variants', 'option_signature')) {
                $table->dropUnique('product_variants_product_signature_unique');
            }

            if (Schema::hasColumn('product_variants', 'variant_name')) {
                $table->dropColumn('variant_name');
            }

            if (Schema::hasColumn('product_variants', 'option_values')) {
                $table->dropColumn('option_values');
            }

            if (Schema::hasColumn('product_variants', 'option_signature')) {
                $table->dropColumn('option_signature');
            }

            if (Schema::hasColumn('product_variants', 'is_primary')) {
                $table->dropColumn('is_primary');
            }
        });
    }
};
