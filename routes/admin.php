<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReturnController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('categories', CategoryController::class)->except(['show', 'create', 'edit']);
    Route::resource('brands', BrandController::class)->except(['show', 'create', 'edit']);
    Route::resource('products', ProductController::class);
    Route::resource('users',UserController::class)->except(['create','store','show']);
    Route::resource('returns',ReturnController::class)->only(['index','show','update']);
});
