<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('administrative_divisions', function (Blueprint $table) {
            $table->unique(['code', 'level'], 'administrative_divisions_code_level_unique');
        });
    }

    public function down(): void
    {
        Schema::table('administrative_divisions', function (Blueprint $table) {
            $table->dropUnique('administrative_divisions_code_level_unique');
        });
    }
};
