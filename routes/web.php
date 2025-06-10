<?php

use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MainController::class, 'index']);
Route::get('/login', function () {return inertia('login');})->name('login');
Route::post('/login', [MainController::class, 'login']);
Route::post('/logout', [MainController::class, 'logout']);
Route::get('/error', function () {return inertia('error');})->name('error');
Route::get('/success', function () {return inertia('success');})->name('success');

Route::get('/telemedicine/{hn_token}', [MainController::class, 'telemedicine']);
Route::post('/telemedicine', [MainController::class, 'telemedicine_store']);

Route::middleware(['auth'])->group(function () {
    Route::get('/index', [MainController::class, 'index'])->name('index');
});
