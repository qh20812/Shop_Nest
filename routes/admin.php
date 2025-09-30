<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\PromotionController;
use App\Http\Controllers\Admin\ReturnController;
use App\Http\Controllers\Admin\ShipperController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::patch('/categories/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore');
    Route::delete('/categories/{id}/force-delete', [CategoryController::class, 'forceDelete'])->name('categories.forceDelete');
    Route::resource('brands', BrandController::class)->except(['show']);
    Route::patch('/brands/{brand}/restore', [BrandController::class, 'restore'])->name('brands.restore');
    Route::resource('products', ProductController::class)->except(['create', 'store', 'edit', 'update']);
    Route::patch('/products/{product}/status', [ProductController::class, 'updateStatus'])->name('products.updateStatus');
    Route::resource('users',UserController::class)->except(['create','store','show']);
    Route::resource('returns',ReturnController::class)->only(['index','show','update']);
    
    // Order management routes
    Route::resource('orders', OrderController::class)->only(['index', 'show']);
    Route::post('/orders/{order}/assign-shipper', [OrderController::class, 'assignShipper'])->name('orders.assignShipper');
    Route::post('/orders/{order}/refund', [OrderController::class, 'createRefund'])->name('orders.createRefund');
    
    // Promotion management routes
    Route::resource('promotions', PromotionController::class);
    
    // Shipper management routes
    Route::get('/shippers', [ShipperController::class, 'index'])->name('shippers.index');
    Route::get('/shippers/{shipper}', [ShipperController::class, 'show'])->name('shippers.show');
    Route::patch('/shippers/{shipper}/status', [ShipperController::class, 'updateStatus'])->name('shippers.updateStatus');
});
