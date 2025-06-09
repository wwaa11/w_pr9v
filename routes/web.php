<?php

use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;

Route::get('/index', [MainController::class, 'index']);
Route::get('/telemedicine', [MainController::class, 'telemedicine']);
Route::post('/telemedicine', [MainController::class, 'telemedicine_store']);

Route::middleware(['auth'])->group(function () {

});
