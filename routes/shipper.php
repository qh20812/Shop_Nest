<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Shipper\DashboardController;

// Shipper Routes
Route::middleware(['auth', 'verified'])->prefix('shipper')->name('shipper.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Journey Management
    Route::post('/journeys/{journey}/status', [DashboardController::class, 'updateJourneyStatus'])
        ->name('journeys.updateStatus');

    // Shipper Status
    Route::post('/toggle-status', [DashboardController::class, 'toggleStatus'])
        ->name('toggleStatus');

    // Statistics
    Route::get('/statistics', [DashboardController::class, 'getStatistics'])
        ->name('statistics');
});
