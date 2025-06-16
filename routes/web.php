<?php

use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [MainController::class, 'temp']);

Route::get('/', [MainController::class, 'index'])->name('home');
Route::get('/api/check-session', [MainController::class, 'checkSession']);

Route::get('/error', function () {return inertia('error');})->name('error');
Route::get('/success', function () {return inertia('success');})->name('success');

Route::get('/login', [MainController::class, 'login'])->name('login');
Route::post('/login', [MainController::class, 'loginRequest']);
Route::post('/logout', [MainController::class, 'logout']);

Route::get('/telemedicine/{hn_token}', [MainController::class, 'telemedicine'])->name('telemedicine');
Route::post('/telemedicine', [MainController::class, 'telemedicine_store']);

Route::get('/telemehealth/{hn_token}', [MainController::class, 'telemehealth'])->name('telemehealth');
Route::post('/telemehealth', [MainController::class, 'telemehealth_store']);

Route::get('/hiv/{hn_token}', [MainController::class, 'hiv'])->name('hiv');
Route::post('/hiv', [MainController::class, 'hiv_store']);

Route::middleware(['auth'])->group(function () {
    Route::post('/api/update-signature', [MainController::class, 'updateSignature'])->middleware('auth');

    Route::get('/admin', [MainController::class, 'index'])->name('admin.index');
    Route::post('/admin', [MainController::class, 'index_search']);

    Route::get('/admin/view', [MainController::class, 'viewConsent'])->name('admin.view');
    Route::get('/admin/telemedicine-consent/{id}', [MainController::class, 'viewTelemedicineConsent'])->name('admin.telemedicine-consent');
    Route::get('/admin/hiv-consent/{id}', [MainController::class, 'viewHivConsent'])->name('admin.hiv-consent');
    Route::get('/admin/telehealth-consent/{id}', [MainController::class, 'viewTelehealthConsent'])->name('admin.telehealth-consent');

    Route::get('/admin/users', [MainController::class, 'manageUsers'])->name('admin.users');
    Route::post('/admin/users/{user}/set-witness', [MainController::class, 'setWitness'])->name('admin.users.set-witness');
    Route::post('/admin/users/add-witness', [MainController::class, 'addWitness'])->name('admin.users.add-witness');
});

Route::fallback(function () {
    abort(404);
});
