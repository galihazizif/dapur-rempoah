<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentConfirmationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\VoucherController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public Endpoints
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/menu', [ProductController::class, 'menu']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/vouchers/{code}', [VoucherController::class, 'show']);

Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{hash}', [OrderController::class, 'show']);

Route::post('/payment-confirmations', [PaymentConfirmationController::class, 'store']);

// Admin-Guarded Endpoints
Route::middleware(['admin.secret'])->group(function () {
    // Voucher management
    Route::get('/admin/vouchers', [VoucherController::class, 'adminIndex']);
    Route::post('/admin/vouchers', [VoucherController::class, 'adminStore']);
    Route::put('/admin/vouchers/{code}', [VoucherController::class, 'adminUpdate']);
    Route::delete('/admin/vouchers/{code}', [VoucherController::class, 'adminDestroy']);

    // Settings management
    Route::put('/admin/settings', [SettingController::class, 'adminUpdate']);

    // Product management (using /products and /products/{id})
    Route::post('/products', [ProductController::class, 'adminStore']);
    Route::post('/products/{id}', [ProductController::class, 'adminUpdate']); // supporting multipart PUT via POST route helper if needed
    Route::put('/products/{id}', [ProductController::class, 'adminUpdate']);
    Route::delete('/products/{id}', [ProductController::class, 'adminDestroy']);

    // Order management
    Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
    Route::put('/admin/orders/{id}', [OrderController::class, 'adminUpdate']);

    // Payment confirmation management
    Route::get('/admin/payment-confirmations', [PaymentConfirmationController::class, 'adminIndex']);
    Route::put('/admin/payment-confirmations/{id}', [PaymentConfirmationController::class, 'adminUpdate']);
});
