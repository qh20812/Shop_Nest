<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\PromotionController;
use App\Http\Controllers\Admin\ReturnController;
use App\Http\Controllers\Admin\ShipperController;
use App\Http\Controllers\Admin\ShopController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::patch('/categories/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore');
    Route::delete('/categories/{id}/force-delete', [CategoryController::class, 'forceDelete'])->name('categories.forceDelete');
    Route::resource('brands', BrandController::class)->except(['show']);
    Route::patch('/brands/{brand}/restore', [BrandController::class, 'restore'])->name('brands.restore');
    Route::resource('products', ProductController::class)->except(['create', 'store', 'edit', 'update']);
    Route::patch('/products/{product}/status', [ProductController::class, 'updateStatus'])->name('products.updateStatus');
    Route::resource('users',UserController::class)->except(['create','store','show']);
    Route::resource('returns',ReturnController::class)->only(['index','show','update']);
    
    // Order management routes
    Route::resource('orders', OrderController::class)->only(['index', 'show']);
    Route::post('/orders/{order}/assign-shipper', [OrderController::class, 'assignShipper'])->name('orders.assignShipper');
    Route::post('/orders/{order}/refund', [OrderController::class, 'createRefund'])->name('orders.createRefund');
    
    // Promotion management routes
    Route::post('promotions/create-with-rules', [PromotionController::class, 'createWithRules'])->name('promotions.createWithRules');
    Route::post('promotions/preview-matching', [PromotionController::class, 'previewMatchingProducts'])->name('promotions.previewMatching');
    Route::post('promotions/{promotion}/bulk-import', [PromotionController::class, 'bulkImportProducts'])->name('promotions.bulkImport');
    Route::get('promotions/imports/{trackingToken}', [PromotionController::class, 'getImportStatus'])->name('promotions.importStatus');
    Route::patch('promotions/{promotion}/auto-apply', [PromotionController::class, 'toggleAutoApply'])->name('promotions.toggleAutoApply');
    Route::resource('promotions', PromotionController::class);
    
    // Shipper management routes
    Route::get('/shippers', [ShipperController::class, 'index'])->name('shippers.index');
    Route::get('/shippers/{shipper}', [ShipperController::class, 'show'])->name('shippers.show');
    Route::patch('/shippers/{shipper}/status', [ShipperController::class, 'updateStatus'])->name('shippers.updateStatus');

    // Inventory Management Routes
    Route::controller(InventoryController::class)->prefix('inventory')->name('inventory.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/report', 'report')->name('report');
        Route::get('/report/export', 'export')->name('report.export');
        Route::post('/bulk-update', 'bulkUpdate')->name('bulkUpdate');
        Route::get('/{product}', 'show')->name('show')->where('product', '[0-9]+');
        Route::get('/{product}/history', 'history')->name('history')->where('product', '[0-9]+');
        Route::post('/stock-in', 'store')->name('store');
        Route::post('/stock-out', 'stockOut')->name('stockOut');
        Route::put('/{variant}', 'update')->name('update')->where('variant', '[0-9]+');
    });

    // Analytics Routes
    Route::controller(AnalyticsController::class)->prefix('analytics')->name('analytics.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/revenue', 'revenue')->name('revenue');
        Route::get('/users', 'users')->name('users');
        Route::get('/products', 'products')->name('products');
        Route::get('/orders', 'orders')->name('orders');
        Route::get('/reports', 'reports')->name('reports');
    });

    // Shop Management Routes
    Route::controller(ShopController::class)->prefix('shops')->name('shops.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/pending', 'pending')->name('pending');
        Route::get('/dashboard', 'dashboard')->name('dashboard');
        Route::get('/export', 'export')->name('export');

        // Bulk operations
        Route::post('/bulk-approve', 'bulkApprove')->name('bulkApprove');
        Route::post('/bulk-reject', 'bulkReject')->name('bulkReject');

        // Individual shop routes
        Route::get('/{shop}', 'show')->name('show')->where('shop', '[0-9]+');
        Route::get('/{shop}/statistics', 'statistics')->name('statistics')->where('shop', '[0-9]+');
        Route::get('/{shop}/violations', 'violations')->name('violations')->where('shop', '[0-9]+');
        Route::post('/{shop}/violations', 'addViolation')->name('addViolation')->where('shop', '[0-9]+');

        // Shop status management
        Route::post('/{shop}/approve', 'approve')->name('approve')->where('shop', '[0-9]+');
        Route::post('/{shop}/reject', 'reject')->name('reject')->where('shop', '[0-9]+');
        Route::post('/{shop}/suspend', 'suspend')->name('suspend')->where('shop', '[0-9]+');
        Route::post('/{shop}/reactivate', 'reactivate')->name('reactivate')->where('shop', '[0-9]+');
    });
});
