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
        Schema::create('flash_sale_events', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->comment('Tên sự kiện Flash Sale');
            $table->timestamp('start_time')->nullable()->comment('Thời gian bắt đầu sự kiện');
            $table->timestamp('end_time')->nullable()->comment('Thời gian kết thúc sự kiện');
            $table->enum('status', ['scheduled', 'active', 'ended', 'cancelled'])
                  ->default('scheduled')
                  ->comment('Trạng thái sự kiện: scheduled, active, ended, cancelled');
            $table->text('description')->nullable()->comment('Mô tả sự kiện');
            $table->string('banner_image', 500)->nullable()->comment('Ảnh banner sự kiện');
            $table->json('metadata')->nullable()->comment('Dữ liệu bổ sung (JSON)');
            $table->timestamps();

            // Indexes for performance
            $table->index(['status', 'start_time', 'end_time'], 'flash_sale_events_status_time_index');
            $table->index(['start_time', 'end_time'], 'flash_sale_events_time_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flash_sale_events');
    }
};
