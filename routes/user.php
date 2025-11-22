<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\PaymentReturnController;
use App\Http\Controllers\PaymentWebhookController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\User\ReviewController;
use App\Http\Controllers\User\AddressController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\ChangePasswordController;
use App\Http\Controllers\User\NotificationController;
use Inertia\Inertia;

Route::middleware(['auth', 'verified.optional'])
    ->prefix('/user/orders')
    ->as('user.orders.')
    ->group(function () {
        // Danh sách đơn hàng
        Route::get('/', [OrderController::class, 'index'])->name('index');

        // Chi tiết đơn hàng
        Route::get('{order}', [OrderController::class, 'show'])->name('show');

        // Đánh giá đơn hàng
        Route::post('{order}/review', [OrderController::class, 'review'])->name('review');

        // Hủy đơn hàng
        Route::post('{order}/cancel', [OrderController::class, 'cancel'])->name('cancel')->middleware('throttle:5,1');

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
        Route::post('{order}/return', [OrderController::class, 'requestReturn'])->name('return')->middleware('throttle:5,1');

        // Hủy yêu cầu trả hàng
        Route::post('{order}/return/{returnRequest}/cancel', [OrderController::class, 'cancelReturnRequest'])->name('cancel-return');

        // Theo dõi đơn hàng
        Route::get('{order}/track', [OrderController::class, 'trackDelivery'])->name('track');
    });

Route::middleware(['auth', 'verified.optional'])
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

Route::middleware(['auth', 'verified.optional'])
    ->prefix('user/addresses')
    ->as('user.addresses.')
    ->group(function () {
        // Danh sách địa chỉ
        Route::get('/', [AddressController::class, 'index'])->name('index');

        // Form tạo địa chỉ mới
        Route::get('/create', [AddressController::class, 'create'])->name('create');

        // Lưu địa chỉ mới
        Route::post('/', [AddressController::class, 'store'])->name('store');

        // API divisions (updated: bỏ cấp quận/huyện)
        Route::get('/countries', [AddressController::class, 'countries'])->name('countries');
        Route::get('/provinces/{countryId}', [AddressController::class, 'provinces'])->name('provinces');
        Route::get('/wards/{provinceId}', [AddressController::class, 'wards'])->name('wards');

        // Xem chi tiết địa chỉ
        Route::get('/{address}', [AddressController::class, 'show'])
            ->whereNumber('address')
            ->name('show');

        // Form chỉnh sửa địa chỉ
        Route::get('/{address}/edit', [AddressController::class, 'edit'])
            ->whereNumber('address')
            ->name('edit');

        // Cập nhật địa chỉ
        Route::put('/{address}', [AddressController::class, 'update'])
            ->whereNumber('address')
            ->name('update');

        // Xóa địa chỉ
        Route::delete('/{address}', [AddressController::class, 'destroy'])
            ->whereNumber('address')
            ->name('destroy');

        // Đặt địa chỉ mặc định
        Route::patch('/{address}/default', [AddressController::class, 'setDefault'])
            ->whereNumber('address')
            ->name('set-default');
    });

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/update/{itemId}', [CartController::class, 'update'])->name('cart.update');
Route::post('/cart/remove/{itemId}', [CartController::class, 'remove'])->name('cart.remove');
Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
Route::post('/cart/apply-promotion', [CartController::class, 'applyPromotion'])->name('cart.applyPromotion');
Route::post('/cart/remove-promotion', [CartController::class, 'removePromotion'])->name('cart.removePromotion');

Route::middleware(['auth', 'verified.optional'])->group(function () {
    // Change password routes for customer
    Route::get('/user/change-password', [ChangePasswordController::class, 'index'])->name('user.change-password.index');
    Route::post('/user/change-password', [ChangePasswordController::class, 'update'])->name('user.change-password.update');

    // Checkout routes
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    
    // Checkout API routes
    Route::get('/checkout/available-promotions', [CheckoutController::class, 'getAvailablePromotions'])->name('checkout.available-promotions');
});

// Customer notifications
Route::middleware(['auth', 'verified.optional'])
    ->prefix('/user/notifications')
    ->as('user.notifications.')
    ->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::post('/mark-all-read', [NotificationController::class, 'markAllRead'])->name('mark-all-read');
        Route::post('/{notification}/read', [NotificationController::class, 'markRead'])->name('mark-read');
    });

    // Buy Now and Add to Cart routes - exclude CSRF for AJAX requests, allow unauthenticated users
    Route::middleware(['web'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])->group(function () {
        Route::post('/product/{productId}/buy-now', [DetailController::class, 'buyNow'])->name('product.buy.now');
        Route::post('/product/{productId}/add-to-cart', [DetailController::class, 'addToCart'])->name('product.addToCart');
        Route::get('/buy-now/checkout/{orderId}', [DetailController::class, 'showBuyNowCheckout'])->name('buy.now.checkout.show');
        Route::post('/buy-now/checkout/{orderId}', [DetailController::class, 'processBuyNowCheckout'])->name('buy.now.checkout');
    });

Route::post('/webhooks/stripe', [PaymentWebhookController::class, 'stripe'])
    ->middleware('throttle:60,1')
    ->name('webhooks.stripe');
Route::post('/webhooks/paypal', [PaymentWebhookController::class, 'paypal'])
    ->middleware('throttle:60,1')
    ->name('webhooks.paypal');
Route::post('/webhooks/vnpay', [PaymentWebhookController::class, 'vnpay'])
    ->middleware('throttle:60,1')
    ->name('webhooks.vnpay');
Route::post('/webhooks/momo', [PaymentWebhookController::class, 'momo'])
    ->middleware('throttle:60,1')
    ->name('webhooks.momo');

Route::get('/payments/{provider}/return', [PaymentReturnController::class, 'handle'])
    ->middleware('throttle:30,1');
Route::get('/payments/stripe/cancel', function () {
    return Inertia::render('PaymentResult', [
        'provider' => 'stripe',
        'status' => 'canceled',
    ]);
});
Route::middleware(['auth', 'verified.optional'])
    ->prefix('/user/profile')
    ->as('user.profile.')
    ->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('index');
        Route::put('/', [ProfileController::class, 'update'])->name('update');
    });
