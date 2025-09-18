<?php

use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;

Route::fallback(function () {
    abort(404);
});

Route::get('/api/check-session', [MainController::class, 'checkSession']);
Route::get('/error', function () {return inertia('error');})->name('error');
Route::get('/success', function () {return inertia('success');})->name('success');

Route::get('/', [MainController::class, 'user'])->name('user.index');
Route::get('/login-user', [MainController::class, 'loginUser'])->name('login.user');

Route::get('/login', [MainController::class, 'login'])->name('login');
Route::post('/login-user', [MainController::class, 'loginUserRequest'])->name('login.user');
Route::post('/login-request', [MainController::class, 'loginRequest']);
Route::post('/logout', [MainController::class, 'logout']);
Route::post('/logout-user', [MainController::class, 'logoutUser'])->name('logout.user');

Route::get('/telemedicine/{hn_token}', [MainController::class, 'telemedicine'])->name('telemedicine');
Route::post('/telemedicine', [MainController::class, 'telemedicine_store']);

Route::get('/telehealth/{hn_token}', [MainController::class, 'telehealth'])->name('telehealth');
Route::post('/telehealth', [MainController::class, 'telehealth_store']);

Route::get('/hiv/{hn_token}', [MainController::class, 'hiv'])->name('hiv');
Route::post('/hiv', [MainController::class, 'hiv_store']);

Route::get('/sleep-check/{token}', [MainController::class, 'sleep_check'])->name('sleep-check');
Route::post('/sleep-check', [MainController::class, 'sleep_check_store']);

Route::get('/mind9q/{hn_token}', [MainController::class, 'mind9q'])->name('mind9q');
Route::post('/mind9q', [MainController::class, 'mind9q_store']);

Route::get('/s/{code}', [MainController::class, 'redirectShortLink']);

Route::middleware(['auth'])->group(function () {

    Route::post('/api/update-signature', [MainController::class, 'updateSignature'])->middleware('auth');

    Route::get('/admin', [MainController::class, 'admin'])->name('admin.index');
    Route::post('/admin', [MainController::class, 'admin_search']);

    Route::get('/admin/all-consents', [MainController::class, 'allConsents'])->name('admin.all-consents');

    Route::get('/admin/telemedicine-consent/{id}', [MainController::class, 'viewTelemedicineConsent'])->name('admin.telemedicine-consent');
    Route::get('/admin/telehealth-consent/{id}', [MainController::class, 'viewTelehealthConsent'])->name('admin.telehealth-consent');
    Route::get('/admin/hiv-consent/{id}', [MainController::class, 'viewHivConsent'])->name('admin.hiv-consent');
    Route::get('/admin/sleepness-consent/{id}', [MainController::class, 'viewSleepnessConsent'])->name('admin.sleepness-consent');
    Route::get('/admin/mind9q-consent/{id}', [MainController::class, 'viewMind9qConsent'])->name('admin.mind9q-consent');

    Route::get('/admin/users', [MainController::class, 'manageUsers'])->name('admin.users');
    Route::post('/admin/users/{user}/set-witness', [MainController::class, 'setWitness'])->name('admin.users.set-witness');
    Route::post('/admin/users/{user}/set-user', [MainController::class, 'setUser'])->name('admin.users.set-user');
    Route::post('/admin/users/add-witness', [MainController::class, 'addWitness'])->name('admin.users.add-witness');
});
