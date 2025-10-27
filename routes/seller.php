<?php

use App\Http\Controllers\Seller\DashboardController;
use App\Http\Controllers\Seller\OrderController;
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\Seller\PromotionController;
use App\Http\Controllers\Seller\WalletController;
use Illuminate\Support\Facades\Route;


Route::prefix('seller')->name('seller.')->middleware(['auth', 'isSeller'])->group(function () {
    // Seller Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Seller Products
    Route::resource('products', ProductController::class);

    // Seller Orders
    Route::get('/orders',[OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');

    // Seller Promotions
    Route::resource('promotions', PromotionController::class);
    Route::post('promotions/{promotion}/pause', [PromotionController::class, 'pause'])->name('promotions.pause');
    Route::post('promotions/{promotion}/resume', [PromotionController::class, 'resume'])->name('promotions.resume');

    // Seller Wallet
    Route::get('wallet', [WalletController::class, 'show'])->name('wallet.show');
    Route::get('wallet/transactions', [WalletController::class, 'transactions'])->name('wallet.transactions');
    Route::post('wallet/top-up', [WalletController::class, 'topUp'])->name('wallet.top-up');
    Route::get('wallet/top-up/{transaction}/status', [WalletController::class, 'topUpStatus'])->name('wallet.top-up.status');
    Route::post('wallet/transfer', [WalletController::class, 'transfer'])->name('wallet.transfer');
});
