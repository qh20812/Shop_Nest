<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home/Index');
})->name('home');

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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function(){
        return Inertia::render('Home/Index');
    })->name('home');

    require __DIR__.'/seller.php';
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/user.php';
