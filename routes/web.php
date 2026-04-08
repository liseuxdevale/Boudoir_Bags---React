<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminOrderController;

// ── Public routes ──────────────────────────────────────────────
Route::get('/',             [ProductController::class, 'landing'])->name('home');
Route::get('/shop',         [ProductController::class, 'index'])->name('shop');
Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.show');

// ── Auth routes ────────────────────────────────────────────────
Route::get('/login',    [LoginController::class, 'show'])->name('login');
Route::post('/login',   [LoginController::class, 'store']);
Route::post('/logout',  [LoginController::class, 'destroy'])->name('logout');
Route::get('/register', [RegisterController::class, 'show'])->name('register');
Route::post('/register',[RegisterController::class, 'store']);

// ── Cart routes (guests allowed) ───────────────────────────────
Route::get('/cart',          [CartController::class, 'index'])->name('cart');
Route::post('/cart/add',     [CartController::class, 'add']);
Route::patch('/cart/{id}',   [CartController::class, 'update']);
Route::delete('/cart/{id}',  [CartController::class, 'remove']);

// ── Protected customer routes ──────────────────────────────────
Route::middleware(['auth'])->group(function () {
    Route::get('/checkout',                   [OrderController::class, 'checkout'])->name('checkout');
    Route::post('/checkout',                  [OrderController::class, 'store']);
    Route::get('/order/confirmation/{order}', [OrderController::class, 'confirmation'])->name('order.confirmation');
});

// ── Admin routes ───────────────────────────────────────────────
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/',                       [AdminDashboardController::class, 'index'])->name('admin');
    Route::get('/products',               [AdminProductController::class, 'index'])->name('admin.products');
    Route::post('/products',              [AdminProductController::class, 'store']);
    Route::put('/products/{id}',          [AdminProductController::class, 'update']);
    Route::delete('/products/{id}',       [AdminProductController::class, 'destroy']);
    Route::get('/orders',                 [AdminOrderController::class, 'index'])->name('admin.orders');
    Route::patch('/orders/{id}/status',   [AdminOrderController::class, 'updateStatus']);
    Route::delete('/orders/{id}',         [AdminOrderController::class, 'destroy']);
});

