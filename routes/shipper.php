<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Shipper\DashboardController;

Route::middleware(['auth', 'verified', 'shipper'])->prefix('shipper')->name('shipper.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Add more shipper routes here
    // Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    // Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
    // Route::get('/earnings', [EarningsController::class, 'index'])->name('earnings.index');
});