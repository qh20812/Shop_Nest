<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id('category_id');
            $table->string('name', 100);
            $table->string('description', 500)->nullable();
            $table->string('image_url', 255)->nullable();
            $table->foreignId('parent_category_id')->nullable()->constrained('categories', 'category_id')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('brands', function (Blueprint $table) {
            $table->id('brand_id');
            $table->string('name', 100);
            $table->string('description', 500)->nullable();
            $table->string('logo_url', 255)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id('product_id');
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->foreignId('category_id')->constrained('categories', 'category_id');
            $table->foreignId('brand_id')->nullable()->constrained('brands', 'brand_id')->onDelete('set null');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->tinyInteger('status')->default(1)->comment('1: Draft, 2: Pending Approval, 3: Published, 4: Hidden');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id('image_id');
            $table->foreignId('product_id')->constrained('products', 'product_id')->onDelete('cascade');
            $table->string('image_url', 500);
            $table->string('alt_text', 200)->nullable();
            $table->boolean('is_primary')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('categories');
    }
};