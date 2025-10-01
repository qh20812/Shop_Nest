<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\OrderController;

Route::middleware(['auth', 'verified'])
    ->prefix('dashboard/orders')
    ->as('user.orders.')
    ->group(function () {
        // Danh sách đơn hàng
        Route::get('/', [OrderController::class, 'index'])->name('index');

        // Chi tiết đơn hàng
        Route::get('{order}', [OrderController::class, 'show'])->name('show');

        // Hủy đơn hàng
        Route::post('{order}/cancel', [OrderController::class, 'cancel'])->name('cancel');

        // Đặt lại đơn hàng (reorder)
        Route::post('{order}/reorder', [OrderController::class, 'reorder'])->name('reorder');

        // Tải hóa đơn PDF
        Route::get('{order}/invoice', [OrderController::class, 'downloadInvoice'])->name('invoice');

        // Yêu cầu trả hàng
        Route::post('{order}/return', [OrderController::class, 'requestReturn'])->name('return');

        // Theo dõi đơn hàng
        Route::get('{order}/track', [OrderController::class, 'trackDelivery'])->name('track');
    });