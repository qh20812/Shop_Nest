<?php

use App\Http\Controllers\DetailController;
use App\Http\Controllers\Debug\InventoryDebugController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes (accessible without login)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/cart-test', function(){
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

Route::post('/product/{productId}/add-to-cart', [DetailController::class, 'addToCart'])
    ->whereNumber('productId')
    ->name('product.addToCart');

Route::post('/product/{productId}/buy-now', [DetailController::class, 'buyNow'])
    ->whereNumber('productId')
    ->name('product.buyNow');

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

// Protected routes that require authentication
Route::middleware(['auth', 'verified'])->group(function () {
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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/user.php';
