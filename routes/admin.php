<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('categories', CategoryController::class)->except(['show', 'create', 'edit']);
    Route::resource('brands', BrandController::class)->except(['show', 'create', 'edit']);
    Route::resource('products', ProductController::class);
    Route::get('/dashboard',function(){
        return Inertia::render('Admin/Dashboard/Index');
    })->name('dashboard');
});
