<?php

use App\Http\Controllers\Auth\SellerRegistrationController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\Debug\InventoryDebugController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/test', function(){
    return Inertia::render('Customer/detail-test');
});

// Public routes (accessible without login)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/cart-test', function () {
    return Inertia::render('Customer/Cart');
});

Route::get('/about', function () {
    return Inertia::render('Home/About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Home/Contact');
})->name('contact');

Route::get('/product/{productId}', [DetailController::class, 'show'])
    ->whereNumber('productId')
    ->name('product.detail');

if (app()->environment(['local', 'testing']) || config('app.debug')) {
    Route::get('/debug/inventory/{variant}', [InventoryDebugController::class, 'show'])
        ->whereNumber('variant')
        ->name('debug.inventory.show');
}

// Language switching route
Route::post('/language', function () {
    $locale = request('locale');

    if (in_array($locale, ['vi', 'en'])) {
        session(['locale' => $locale]);
    }

    return redirect()->back();
})->name('language.switch');

// Currency switching route
Route::post('/currency', CurrencyController::class)->name('currency.switch');

// Protected routes that require authentication
Route::middleware(['auth', 'verified'])->group(function () {
    // Chatbot API endpoint (moved from api.php to use web session auth)
    Route::post('/chatbot/message', [ChatbotController::class, 'send'])
        ->middleware('throttle:10,1')
        ->name('chatbot.message');

    // Notification routes
    Route::get('/notifications', function () {
        // For now, render with empty data - will be populated via API
        return Inertia::render('Notifications/Index', [
            'notifications' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 20,
                'total' => 0,
            ],
            'unreadCount' => 0,
            'filters' => [],
        ]);
    })->name('notifications.index');

    require __DIR__ . '/seller.php';
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

Route::get('/customer/orders/index', function(){
    return Inertia::render('Customer/Orders/Index');
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
    Route::get('notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('notifications/{notification}/mark-read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::post('notifications/mark-multiple-read', [\App\Http\Controllers\Api\NotificationController::class, 'markMultipleAsRead']);
    Route::post('notifications/mark-all-read', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
    Route::delete('notifications/{notification}', [\App\Http\Controllers\Api\NotificationController::class, 'destroy']);
    Route::delete('notifications/delete-multiple', [\App\Http\Controllers\Api\NotificationController::class, 'destroyMultiple']);
    Route::get('notifications/unread-count', [\App\Http\Controllers\Api\NotificationController::class, 'unreadCount']);
});

// Test route to create sample notifications (remove in production)
if (app()->environment(['local', 'testing'])) {
    Route::get('/test/create-notifications', function () {
        /** @var \App\Models\User $user */
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        // Get user's role
        $roleName = $user->role_name;
        
        if ($roleName === 'admin') {
            \App\Services\NotificationService::sendToUser($user, 'System Alert', 'Critical system update required', \App\Enums\NotificationType::ADMIN_SYSTEM_ALERT);
            \App\Services\NotificationService::sendToUser($user, 'New User Activity', 'New user registered on the platform', \App\Enums\NotificationType::ADMIN_USER_ACTIVITY);
        } elseif ($roleName === 'seller') {
            \App\Services\NotificationService::sendToUser($user, 'New Order', 'You have received a new order #1234', \App\Enums\NotificationType::SELLER_ORDER_UPDATE);
            \App\Services\NotificationService::sendToUser($user, 'Product Approved', 'Your product "Sample Product" has been approved', \App\Enums\NotificationType::SELLER_PRODUCT_APPROVAL);
        } elseif ($roleName === 'customer') {
            \App\Services\NotificationService::sendToUser($user, 'Order Shipped', 'Your order #5678 has been shipped', \App\Enums\NotificationType::CUSTOMER_ORDER_STATUS);
            \App\Services\NotificationService::sendToUser($user, 'Special Promotion', 'Get 20% off on all items this weekend!', \App\Enums\NotificationType::CUSTOMER_PROMOTION);
        } elseif ($roleName === 'shipper') {
            \App\Services\NotificationService::sendToUser($user, 'New Delivery', 'New delivery order assigned to you', \App\Enums\NotificationType::SHIPPER_ORDER_ASSIGNED);
        }
        
        return redirect()->route('notifications.index')->with('success', 'Test notifications created!');
    })->middleware('auth')->name('test.notifications');
}

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/user.php';
require __DIR__ . '/chat.php';
