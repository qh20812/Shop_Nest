<?php

use App\Enums\NotificationType;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Auth\SellerRegistrationController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\Debug\InventoryDebugController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SearchProductController;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/test', function(){
//     return Inertia::render('Home/Search');
// });

// Search route
Route::get('/search', [SearchProductController::class, 'index'])->name('search.index');

// Public routes (accessible without login)
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/about', function () {
    return Inertia::render('Home/About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Home/Contact');
})->name('contact');

// Các trang cần đăng nhập mới xem chi tiết / sử dụng tính năng.
Route::middleware(['auth', 'verified.optional'])->group(function () {
    Route::get('/product/{productId}', [DetailController::class, 'show'])
        ->whereNumber('productId')
        ->name('product.detail');
});

if (app()->environment(['local', 'testing']) || config('app.debug')) {
    Route::get('/debug/inventory/{variant}', [InventoryDebugController::class, 'show'])
        ->whereNumber('variant')
        ->name('debug.inventory.show');
}

// Language switching route
Route::post('/language', function () {
    $locale = request('locale');

    if (in_array($locale, User::SUPPORTED_LOCALES, true)) {
        session(['locale' => $locale]);

        // Lưu lựa chọn lên tài khoản để email/thông báo và lần đăng nhập
        // trên thiết bị khác dùng đúng ngôn ngữ này.
        request()->user()?->update(['locale' => $locale]);
    }

    return redirect()->back();
})->name('language.switch');

// Currency switching route
Route::post('/currency', CurrencyController::class)->name('currency.switch');

// Protected routes that require authentication
Route::middleware(['auth', 'verified.optional'])->group(function () {
    // Chatbot API endpoint (moved from api.php to use web session auth)
    Route::post('/chatbot/message', [ChatbotController::class, 'send'])
        ->middleware('throttle:10,1')
        ->name('chatbot.message');

    Route::get('/chatbot/history', [ChatbotController::class, 'history'])
        ->middleware('throttle:60,1')
        ->name('chatbot.history');

    Route::delete('/chatbot/history', [ChatbotController::class, 'destroyHistory'])
        ->middleware('throttle:10,1')
        ->name('chatbot.history.destroy');

    // Notification routes
    // Legacy demo page retained until Phase 6; the canonical page is /user/notifications.
    Route::redirect('/notifications', '/user/notifications')->name('notifications.index');

    // Chat workspace (C08). The JSON endpoints live in routes/chat.php.
    Route::get('/customer/chat', fn () => Inertia::render('Customer/Chat/Index'))->name('customer.chat.index');
    Route::redirect('/chat', '/customer/chat')->name('chat.index');

    require __DIR__.'/seller.php';
});

// Product routes (require auth for detailed actions)
Route::prefix('products')->name('products.')->group(function () {
    // Public product listing
    Route::get('/', [ProductController::class, 'index'])->name('index');

    // Product detail requires authentication
    Route::get('/{product}', [ProductController::class, 'show'])
        ->middleware('auth')
        ->name('show');
});

Route::middleware('guest')->group(function () {
    Route::get('register/seller', [SellerRegistrationController::class, 'create'])
        ->name('seller.register');

    Route::post('register/seller', [SellerRegistrationController::class, 'store'])
        ->name('seller.register.store');
});

// Trang đơn hàng legacy (route chính thức là /user/orders) - yêu cầu đăng nhập.
Route::middleware(['auth', 'verified.optional'])->group(function () {
    Route::get('/customer/orders/index', function () {
        return Inertia::render('Customer/Orders/Index');
    })->name('customer.orders.legacy');
});

// Legal pages
Route::get('/terms', function () {
    return Inertia::render('Legal/Terms');
})->name('terms');

Route::get('/privacy-policy', function () {
    return Inertia::render('Legal/PrivacyPolicy');
})->name('privacy-policy');

Route::get('/selling-policy', function () {
    return Inertia::render('Legal/SellingPolicy');
})->name('selling-policy');

// Notification API routes (using web middleware for Inertia.js compatibility)
Route::prefix('api')->middleware('auth')->group(function () {
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/{notification}/mark-read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/mark-multiple-read', [NotificationController::class, 'markMultipleAsRead']);
    Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy']);
    Route::delete('notifications/delete-multiple', [NotificationController::class, 'destroyMultiple']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
});

// Test route to create sample notifications (remove in production)
if (app()->environment(['local', 'testing'])) {
    Route::get('/test/create-notifications', function () {
        /** @var User $user */
        $user = Auth::user();
        if (! $user) {
            return redirect()->route('login');
        }

        // Get user's role
        $roleName = $user->role_name;

        if ($roleName === 'admin') {
            NotificationService::sendToUser($user, 'System Alert', 'Critical system update required', NotificationType::ADMIN_SYSTEM_ALERT);
            NotificationService::sendToUser($user, 'New User Activity', 'New user registered on the platform', NotificationType::ADMIN_USER_ACTIVITY);
        } elseif ($roleName === 'seller') {
            NotificationService::sendToUser($user, 'New Order', 'You have received a new order #1234', NotificationType::SELLER_ORDER_UPDATE);
            NotificationService::sendToUser($user, 'Product Approved', 'Your product "Sample Product" has been approved', NotificationType::SELLER_PRODUCT_APPROVAL);
        } elseif ($roleName === 'customer') {
            NotificationService::sendToUser($user, 'Order Shipped', 'Your order #5678 has been shipped', NotificationType::CUSTOMER_ORDER_STATUS);
            NotificationService::sendToUser($user, 'Special Promotion', 'Get 20% off on all items this weekend!', NotificationType::CUSTOMER_PROMOTION);
        } elseif ($roleName === 'shipper') {
            NotificationService::sendToUser($user, 'New Delivery', 'New delivery order assigned to you', NotificationType::SHIPPER_ORDER_ASSIGNED);
        }

        return redirect()->route('notifications.index')->with('success', 'Test notifications created!');
    })->middleware('auth')->name('test.notifications');
}

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/user.php';
require __DIR__.'/chat.php';
