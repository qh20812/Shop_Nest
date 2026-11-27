<?php

use App\Http\Controllers\Seller\DashboardController;
use App\Http\Controllers\Seller\OrderController;
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\Seller\PromotionController;
use App\Http\Controllers\Seller\ShopController;
use Illuminate\Support\Facades\Route;

Route::prefix('seller')->name('seller.')->middleware(['auth', 'isSeller'])->group(function () {
    // Seller Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Seller Products
    Route::resource('products', ProductController::class)->only(['index', 'create', 'show', 'edit', 'destroy']);
    Route::post('products', [ProductController::class, 'store'])->middleware('throttle:5,1')->name('products.store');
    Route::put('products/{product}', [ProductController::class, 'update'])->middleware('throttle:5,1')->name('products.update');

    // Seller Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');

    // Seller Promotions
    Route::resource('promotions', PromotionController::class);
    Route::post('promotions/{promotion}/pause', [PromotionController::class, 'pause'])->name('promotions.pause');
    Route::post('promotions/{promotion}/resume', [PromotionController::class, 'resume'])->name('promotions.resume');

    // Seller Wallet: the shared prepaid wallet replaced the old escrow pages.
    Route::redirect('wallet', '/wallet')->name('wallet.show');
    Route::redirect('wallet/transactions', '/wallet#lich-su')->name('wallet.transactions');

    // Shop profile
    Route::get('/shop', [ShopController::class, 'edit'])->name('shop.edit');
    Route::post('/shop', [ShopController::class, 'update'])->name('shop.update');
});
