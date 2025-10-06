<?php

use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\User\ReviewController;

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

        // Tạo đơn hàng mới
        Route::post('/', [OrderController::class, 'store'])->name('store');

        // Xác nhận đã nhận hàng
        Route::post('{order}/confirm-delivery', [OrderController::class, 'confirmDelivery'])->name('confirm-delivery');

        // Tạo review cho sản phẩm trong đơn hàng
        Route::get('{order}/review/{product}', [OrderController::class, 'createReview'])->name('create-review');

        // Yêu cầu trả hàng
        Route::post('{order}/return', [OrderController::class, 'requestReturn'])->name('return');

        // Hủy yêu cầu trả hàng
        Route::post('{order}/return/{returnRequest}/cancel', [OrderController::class, 'cancelReturnRequest'])->name('cancel-return');

        // Theo dõi đơn hàng
        Route::get('{order}/track', [OrderController::class, 'trackDelivery'])->name('track');
    });

Route::middleware(['auth', 'verified'])
    ->prefix('dashboard/reviews')
    ->as('user.reviews.')
    ->group(function () {
        // Danh sách review
        Route::get('/', [ReviewController::class, 'index'])->name('index');

        // Form viết review (theo order + product)
        Route::get('create/{order}/{product}', [ReviewController::class, 'create'])->name('create');

        // Lưu review
        Route::post('{order}/{product}', [ReviewController::class, 'store'])->name('store');

        // Xem chi tiết review
        Route::get('{review}', [ReviewController::class, 'show'])->name('show');
    });

    Route::middleware(['auth', 'verified'])->group(function(){
        Route::get('/cart',[CartController::class,'index'])->name('cart.index');
        Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
        Route::post('/cart/update/{itemId}', [CartController::class, 'update'])->name('cart.update');
        Route::post('/cart/remove/{itemId}', [CartController::class, 'remove'])->name('cart.remove');
        Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
        Route::post('/cart/apply-promotion', [CartController::class, 'applyPromotion'])->name('cart.applyPromotion');
        Route::post('/cart/remove-promotion', [CartController::class, 'removePromotion'])->name('cart.removePromotion');
        Route::get('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');
    });