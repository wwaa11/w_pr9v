<?php

use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MainController::class, 'temp'])->name('temp');

Route::get('/login', function () {return inertia('login');})->name('login');
Route::post('/login', [MainController::class, 'login']);
Route::post('/logout', [MainController::class, 'logout']);
Route::get('/error', function () {return inertia('error');})->name('error');
Route::get('/success', function () {
    return inertia('success', [
        'message' => request()->query('message', 'Your request has been successfully processed.'),
    ]);
})->name('success');

Route::get('/telemedicine/{hn_token}', [MainController::class, 'telemedicine'])->name('telemedicine');
Route::post('/telemedicine', [MainController::class, 'telemedicine_store']);

Route::get('/telemehealth/{hn_token}', [MainController::class, 'telemehealth'])->name('telemehealth');
Route::post('/telemehealth', [MainController::class, 'telemehealth_store']);

Route::get('/hiv/{hn_token}', [MainController::class, 'hiv'])->name('hiv');
Route::post('/hiv', [MainController::class, 'hiv_store']);

Route::middleware(['auth'])->group(function () {
    Route::get('/search', [MainController::class, 'index'])->name('index');
    Route::post('/search', [MainController::class, 'search']);
});

Route::fallback(function () {
    abort(404);
});
