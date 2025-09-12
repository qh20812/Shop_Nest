<?php

use App\Http\Controllers\Admin\CategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function (){
    Route::resource('categories', CategoryController::class)->except(['show','create','edit']);
});