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

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/user.php';
