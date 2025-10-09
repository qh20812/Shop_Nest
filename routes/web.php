<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes (accessible without login)
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/about', function () {
    return Inertia::render('Home/About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Home/Contact');
})->name('contact');

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
