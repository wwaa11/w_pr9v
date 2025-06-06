<?php

use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MainController::class, 'index']);
Route::get('/consent/telemedicine', [MainController::class, 'telemedicine']);
Route::post('/consent/telemedicine', [MainController::class, 'telemedicine_store']);

Route::middleware(['auth'])->group(function () {

});
