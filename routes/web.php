<?php

use Illuminate\Support\Facades\Route;

Route::get('/api/{any}', function () { return response()->json(['message' => 'Not Found'], 404); })->where('any', '.*');

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
