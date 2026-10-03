<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PostController;

/*
|--------------------------------------------------------------------------
| Autentikasi (Public)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| API Resources (Publik & Admin)
|--------------------------------------------------------------------------
| apiResource otomatis mencakup method: index, store, show, update, destroy
*/
Route::apiResource('products', ProductController::class);
Route::apiResource('posts', PostController::class);
Route::apiResource('orders', OrderController::class);
Route::apiResource('reservations', ReservationController::class);
Route::apiResource('messages', MessageController::class);
Route::apiResource('orders', OrderController::class);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
/*
|--------------------------------------------------------------------------
| Protected Routes (Membutuhkan Bearer Token Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/my-orders', [OrderController::class, 'userOrders']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/admin/orders', [OrderController::class, 'indexAdmin']);
});

Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);